import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { handleLogin } from "../Actions/Action";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Login() {
  let device_token = localStorage.getItem("device_token");
  if (!device_token) {
    device_token = uuidv4();
    localStorage.setItem("device_token", device_token);
  }
  const { login } = useAuth();
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/search");
    }
  }, [])



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const mobileRegex = /^9\d{9}$/;

    if (!mobileRegex.test(username)) {
      setError("मोबाईल नं ९ बाट सुरु भएको १० अंकको हुनुपर्छ");
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const data = {
        username: username,
        password: password,
        device_token: device_token,
        last_login: today
      }
      const res = await handleLogin(data);
      console.log(res);
      // 🔴 IMPORTANT: Detect InfinityFree HTML response
      if (typeof res.data === "string") {
        toast.error("सुरक्षा जाँच भइरहेको छ, कृपया पुनः प्रयास गर्नुहोस्।");
        window.location.reload();
        return;
      }
      if (res.data.success) {
        toast.success(res.data.message);
        login(res.data.data); // login function from context
        navigate("/search")
      } else {
        setError(res.data.message || "प्रयोगकर्ता वा पासवर्ड मिलेन");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">लगईन गर्नुहोस्</h3>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Mobile No */}
          <div className="mb-3">
            <label className="form-label">मोबाईल नं</label>
            <input
              type="text"
              className="form-control"
              placeholder="मोबाईल नं"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">पासवर्ड</label>
            <div className="input-group">
              <input
                type={showPass ? "text" : "password"}
                className="form-control"
                placeholder="पासवर्ड"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "लुकाउनुहोस्" : "देखाउनुहोस्"}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary w-100 mt-2">
            लगईन गर्नुहोस्
          </button>
        </form>
        <button onClick={() => { navigate("/signup") }} type="submit" className="btn btn-info w-100 mt-2">
          नयाँ दर्ता गर्नुहोस्
        </button>
      </div>

    </div>
  );
}
