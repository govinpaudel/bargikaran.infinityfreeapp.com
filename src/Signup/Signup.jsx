import { useState } from "react";
import {handleSignup} from "../Actions/Action";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Signup() {
  let device_token = localStorage.getItem("device_token");
    if (!device_token) {
      device_token = uuidv4();
      localStorage.setItem("device_token", device_token);
    }
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate Mobile Number
    const mobileRegex = /^9\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      setError("मोबाईल नं ९ बाट सुरु भएको १० अंकको हुनुपर्छ");
      return;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("ईमेल ठीक छैन");
      return;
    }

    if (password.length < 6) {
      setError("पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ");
      return;
    }

    try {
      const data = { mobile, email,name , password,device_token };
      const res = await handleSignup(data);
      if (res.data.success) {
        setSuccess("साइनअप सफल भयो!");
      } else {
        setError(res.data.message || "साइनअप असफल भयो");
      }
    } catch (err) {
      setError("Server Error! Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">खाता खोल्नुहोस्</h3>

        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && <div className="alert alert-success text-center">{success}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Mobile Number */}
          <div className="mb-3">
            <label className="form-label">मोबाईल नं</label>
            <input
              type="text"
              className="form-control"
              value={mobile}
              placeholder="98xxxxxxxx"
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setMobile(value);
              }}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">ईमेल</label>
            <input
              type="email"
              className="form-control"
              value={email}
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
            {/* Nepali Name */}
          <div className="mb-3">
            <label className="form-label">नाम नेपालीमा</label>
            <input
              type="text"
              className="form-control"
              value={name}
              placeholder="नाम बहादुर थर"
              onChange={(e) => setName(e.target.value)}
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
                value={password}
                placeholder="पासवर्ड"
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

          <button type="submit" className="btn btn-primary w-100 mt-2">
            खाता खोल्नुहोस्
          </button>
        </form>
        <button onClick={()=>{
          navigate("/login")
        }} className="btn btn-success w-100 mt-2">
            लगईन मा जानुहोस्
          </button>
      </div>
    </div>
  );
}
