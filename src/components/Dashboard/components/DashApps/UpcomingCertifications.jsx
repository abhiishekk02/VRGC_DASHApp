import React, { useState, useEffect } from "react";
import nullImg from './UpcomingNull.jpg'
import "./styles/Apps.css"
export default function UpcomingCertifications() {
  const [upcomingCertifications, setUpcomingCertifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUpcomingReCertifications();

  }, []);
    const getUpcomingReCertifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3006/clientDetails/getUpcomingReCertifications/"
        );
        // console.log(response)
        if (!response.ok) {
          throw new Error("Failed to fetch upcoming certifications");
        }
        const clientData = await response.json();
        // console.log("Client Data:", clientData);
        setUpcomingCertifications(clientData);
      } catch (error) {
        console.error("Error fetching certifications:", error);
        // setError(error.message);
      }
    };
 

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <div id="upcoming-certifications-app" className="upcoming-certifications-app">
        <div className="upcoming-certifications-header">
          <p className="upcoming-certifications-appname">Upcoming Certifications</p>
        </div>
  
        <div className="upcoming-certifications-container">
          {upcomingCertifications.length === 0 ? (
            <div className="upcoming-null-container">
              <p className="h6 null-message text-center mt-5">No Upcoming Certifications</p>
            </div>
          ) : (
            <div className="upcoming-list upcoming-list-scrollable">
              {upcomingCertifications.map((client) => (
                <div className="upcoming-list-item" key={client.client_id}>
                  <div className="row upcoming-certifications-row">
                    <div className="col-md-6">
                      <p className="upcoming-comapny-name">{client.companyName}</p>
                      <p className="upcoming-board">{client.accreditationBoard}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="upcoming-date-title">Recertification</p>
                      <p className="upcoming-date">{client.reCertificationDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
              }  