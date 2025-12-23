import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user")) || {};
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
          <span className="ms-2 text-white">
            ( {userData.nepali_name ? userData.nepali_name: 'गेष्ट प्रयोगकर्ता'} )
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            {userData.role != null?            
            <div className="ms-auto dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >

  { userData.role === 1
    ? 'सुपर एडमिन'
    : 'एडमिन'}
  
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/search")}
                  >
                    🔍 खोजि गर्नुहोस्
                  </button>
                </li>

                {(userData.role === 1) && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/listuser")}
                    >
                      👥 प्रयोगकर्ता सूची
                    </button>
                  </li>
                )}
                {(userData.role === 2) && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/admin")}
                    >
                      👥 वर्गिकरण थप
                    </button>
                  </li>
                )}

                {userData.role === 1 && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/syncdata")}
                    >
                      🔄 डाटा सिङ्क
                    </button>
                  </li>
                  
                )}
                {userData.role === 1 && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/uploadexcel")}
                    >
                      🔄 अपलोड Excel
                    </button>
                  </li>
                  
                )}

                <li><hr className="dropdown-divider" /></li>
                {userData.role ? (<li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    🚪 लगआउट
                  </button>
                </li>):null}
              </ul>
            </div>
: null}
          </div>
        </div>
      </nav>
      <hr />
    </>
  );
}
