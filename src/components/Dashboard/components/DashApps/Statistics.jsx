import React, { useEffect, useState } from "react";

export default function Statistics() {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    getAnalyticsData();
  }, []);

  const getAnalyticsData = async () => {
    try {
      const response = await fetch("http://localhost:3006/analytics");

      if (response.ok) {
        const analyticsResults = await response.json();
        setAnalyticsData(analyticsResults.analyticsData);
      }
    } catch (error) {
      console.error("Failed to get analytic details", error);
    }
  };

  
  function getIcon(tableName) {
    switch (tableName) {
      case "Clients Served":
        return "bi bi-person-vcard";
      case "Request Received":
        return "bi bi-bell";
      
      case "Certificates Issued":
        return "bi bi-patch-check"
        case "Upcoming Re-Certifications":
          return "bi bi-file-earmark-check"
      default:
        return "";
    }
  }

  return (
    <div className="statistics-app container">
      <p className="statistics-appname mx-3 h1" style={{ color: "gray" }}>
        Analytics
      </p>
      <div className="container">
        <div className="row statistics-row mt-3 mx-2 d-flex">
          {analyticsData.map((item, index) => (
            <div key={index} className="col-md-5 statistics-card text-light p-2 rounded shadow-sm">
              <div className="row">
                <div className="col-md-8">
                  <p><b>{Object.keys(item)[0]}</b></p>
                  <p className="statistics-numbers h1">{Object.values(item)[0]}</p>
                </div>
                <div className="col-md-4">
                  <i className={`display-3 float-end ${getIcon(Object.keys(item)[0])}`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
