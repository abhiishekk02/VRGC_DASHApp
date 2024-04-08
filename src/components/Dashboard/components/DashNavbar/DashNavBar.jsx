import React, { useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./DashNav.css";
import useUser from "../../../../private/UseUser";

export default function DashNavBar({ collapsed, toggleNav }) {
  const location = useLocation();
  const { userName, statusMessage, setStatusMessage } = useUser();
  const navigate = useNavigate();

  const signOut = () => {
    localStorage.clear(); 
    navigate("/"); 
  };

 
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatusMessage((prevStatusMessage) => [
        prevStatusMessage[0],
        prevStatusMessage[1],
        false,
      ]);
    }, 5000);
    return () => clearTimeout(timeout); // Cleanup function to clear the timeout
  }, [statusMessage]);


  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <>
      <p className="text-center h3 p-4 mobile">VR GLOBAL CONSULTING</p>
      <div className={`side-nav ${collapsed ? "collapsed" : ""}`}>
        <Nav className="dash-nav">
          <button
            onClick={toggleNav}
            className={`toggle-btn ${collapsed ? "collapsed" : ""}`}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <h2 className="dash-brand">{collapsed ? "VR" : "VR Global Consulting"}</h2>
          <div className={`dash-links${collapsed ? "collapsed" : ""}`}>
            {[
              { to: "/dashboard/Home" ,label: "Home", icon: "bi-house-door-fill" },
              { to: "/dashboard/Certificate", label: "Certificate", icon: "bi-patch-check" },
              { to: "/dashboard/Showcase", label: "Images", icon: "bi bi-images" },
              { to: "/dashboard/Clients", label: "Clients", icon: "bi-person-vcard" },
              { to: "/dashboard/Settings", label: "Settings", icon: "bi-gear" },
            ].map((item) => (
              <Nav.Link
                key={item.to}
                as={Link}
                to={item.to}
                className={`dash-nav-link ${isActive(item.to)}`}
              >
                {collapsed ? (
                  <i className={`bi ${item.icon}`}></i>
                ) : (
                  <span className="icon-text">
                    <i className={`bi ${item.icon}`} style={{ marginRight: "5px" }}></i>
                    <span>{item.label}</span>
                  </span>
                )}
              </Nav.Link>
            ))}
          </div>
        </Nav>
        <div className={`statusBar ${collapsed ? "statusBar-collapse" : ""}`}>
          <div className="container">
            <div className="row align-items-center text-center">
              <div className="col-md-1"></div>
              <div className="col-md-2"></div>
              <div className="col-md-3 welcome-text">
                <p>Welcome {userName}</p>
                <p className="status-text">Dashboard</p>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-3">
                {statusMessage[2] && ( // Render only if the third element is true
                  <div className={`statusMessage  animate`}>
                    <p>
                      <span className={statusMessage[1]}>
                        {statusMessage[0]}{" "}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <div className="col-md-2 d-flex justify-content-end ">
              
                <button className="status-icon" onClick={signOut}>
                  <i className="bi bi-box-arrow-in-right text-danger"></i>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
