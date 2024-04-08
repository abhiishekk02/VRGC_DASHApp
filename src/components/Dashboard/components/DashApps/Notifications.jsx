import React, { useEffect, useState } from "react";
import './styles/Apps.css'
export default function Notifications(params) {
  const [notifications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [message, setMessage] = useState(["", false]);
  const unreadNotifications = notifications.filter(
    (notification) => !notification.mark_read
  );
  const [toggleState, setToggleState] = useState(false);

  const handleCheckboxChange = (notificationId) => {
    const updatedCheckboxes = selectedCheckboxes.includes(notificationId)
      ? selectedCheckboxes.filter((id) => id !== notificationId)
      : [...selectedCheckboxes, notificationId];
    setSelectedCheckboxes(updatedCheckboxes);
  };

  useEffect(() => {
    getNotifications();
    setRefresh(false);
  }, [refresh]);

  const getNotifications = async () => {
    try {
      // const response = await fetch("http://localhost:3006/contactForm");
      const response = await fetch("http://localhost:3006/contactForm");

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        if (data.length === 0) {
          setMessage(["No new messages", true]);
        } else {
          setMessage(["", false]);
        }
      } else {
        console.error("Failed to get notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };



  const handleMarkAsRead = async (id) => {
    try {
      const updateNotification = await fetch(
        `http://localhost:3006/contactForm/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
        // statusmessage
      if (updateNotification) {
        setRefresh(true);
      }
    } catch (error) {
      console.log("Failed to update notifications");
    }
  };
  const toggleNotification = () => {
    setToggleState(!toggleState);
  };

  return (
    <>
      <div className="notification-app">
        <div className="notification-header d-flex">
          <p className="notification-appname">Notifications</p>
          <button
            onClick={toggleNotification}
            className="btn toggleNotification "
          >
            {!toggleState ?  (
              <p > All <i className="bi bi-send"></i> </p>

            ) :  <p>New <i className="bi bi-send"></i> </p>}
          </button>
        </div>
        {!toggleState ? (
        unreadNotifications.length === 0 ? (
          <p className="h6 null-message text-center mt-5">No New Notifications</p>
        ) : (
            <>
              <div className="notification-list notification-list-scrollable">
                {unreadNotifications.map((notification) => (
                 
                 
                 <label
                    key={notification.contact_id}
                    htmlFor={`checkbox-${notification.contact_id}`}
                    className="row notification-list-row"
                  >
                    <div className="col-md-7">
                      <div className="row">
                        <div className="col-md-2">
                          <div className="checkbox-wrapper">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`checkbox-${notification.contact_id}`}
                              onChange={() =>
                                handleCheckboxChange(notification.contact_id)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-10">
                          <p className="notification-name"><b>{notification.contact_name}</b></p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <p className="notification-date">
                      {notification.upload_time}  <span>  </span> {notification.upload_date}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="notification-email">{notification.contact_email}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="notification-number">{notification.contact_phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              {selectedCheckboxes.length > 0 && (
              <div className="row">
                <div className="col-md-12">
              <div className="notification-footer">
                  <button
                    className="btn  notification-mark-read-btn "
                    onClick={() => handleMarkAsRead(selectedCheckboxes)}
                  >
                    Mark as read
                  </button>
                </div>
                </div>
              </div>
              )}
            </>
          )
        ) : (
          <>
            <div className="notification-list notification-all-list-scrollable">
              {notifications.map((notification) => (
                <div key={notification.contact_id} className="row notification-list-row">
                  <div className="col-md-6">
                    <p className="notification-name"> <b> {notification.contact_name}</b></p>
                  </div>
                  <div className="col-md-6">
                    <p className="notification-date">
                      {notification.upload_time} {notification.upload_date}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="notification-email">{notification.contact_email}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="notification-number">{notification.contact_phone}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </>
        )}
      </div>
    </>
  );
}
