import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Navbar() {
  const navigate = useNavigate();
  const [userData,setUserData]=useState([]);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user")) || [];
    setUserData(user);
  }, []);  

  const handleLogout = () => {    
    navigate("/logout");
  };

  return (
    <>
   <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
  <div className="container-fluid">
    <span className="navbar-brand">वर्गिकरण व्यवस्थापन प्रणाली</span>
    <span className="ms-2">( {userData.nepali_name} )</span>

    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#mainNavbar"
      aria-controls="mainNavbar"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="mainNavbar">
      <div className="d-flex ms-auto">
        <button className="btn btn-light me-2" onClick={() => navigate("/search")}>
          खोजि गर्नुहोस्
        </button>

        {userData.role === 2 && (
          <button className="btn btn-light me-2" onClick={() => navigate("/admin")}>
            एडमिन
          </button>
        )}

        {userData.role === 1 && (
          <button className="btn btn-light me-2" onClick={() => navigate("/superadmin")}>
            सुपर एडमिन
          </button>
        )}

        <button className="btn btn-danger" onClick={handleLogout}>
          लगआउट
        </button>
      </div>
    </div>
  </div>
</nav>
<hr />
   </>

  );
}
