import React, { useEffect, useState } from "react";
// import { update } from "@react-spring/web";
import useUser from "../../../../private/UseUser";
export default function ProfileDetails(params) {
  const {
    userFirstName,
    userLastName,
    userEmail,
    userCountry,
    userID,
    userProfilePicture,
    setRefresh,
  } = useUser();
  const [editFlag, setEditFlag] = useState(false);
  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    firstName: userFirstName,
    lastName: userLastName,
    email: userEmail,
    country: userCountry,
    userID: userID,
    profile_picture: userProfilePicture,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  useEffect(() => {
    setUpdatedUserDetails({
      firstName: userFirstName,
      lastName: userLastName,
      email: userEmail,
      country: userCountry,
      userID: userID,

      profile_picture: userProfilePicture,
    });
  }, [
    userFirstName,
    userLastName,
    userEmail,
    userCountry,
    userID,
    userProfilePicture,
  ]);
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
      }

      if (newPassword === currentPassword) {
        alert("New password must be different from the current password");
        return;
      }

      const reset = await fetch(
        "http://localhost:3006/userAuth/resetPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID, currentPassword, newPassword }),
        }
      );

      if (reset.ok) {
        setCurrentPassword(" ");
        setNewPassword(" ");
        alert("Password changed successfully");
      } else {
        const errorResponse = await reset.json();
        throw new Error(errorResponse.message || "Failed to change password");
      }
    } catch (error) {
      alert("Invalid Password");
      console.error("Error changing password:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditFlag(editFlag ? false : true);
    if (editFlag) {
      const updateDetails = fetch("http://localhost:3006/userAuth/userUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserDetails),
      });

      setRefresh(true);

      console.log("Updated user details:", updatedUserDetails);
    }
  };

  return (
    <>
      <div className="container profile-details-section">
        <div className="d-flex">
          <p className="mb-3 h2">
            <b>Profile Details</b>
          </p>

          {/* <button className="btn edit-btn1">
            <i className="bi bi-pencil-fill"></i>
          </button> */}
        </div>
        {editFlag ? (
          <>
            <div className="more-info">
              <form onSubmit={handleSubmit}>
                <div className="row d-flex">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="firstName">First name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={updatedUserDetails.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="lastName">Last name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={updatedUserDetails.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={updatedUserDetails.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="country">Country:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={updatedUserDetails.country}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="profile_picture">
                        Profile Image URL:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="profile_picture"
                        name="profile_picture"
                        value={updatedUserDetails.profile_picture}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="more-info">
            <div className="row">
              <div className="col-md-6">
                <p className="info-item">
                  First name:{" "}
                  <span className="info-text"> {userFirstName} </span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="info-item">
                  Last name: <span className="info-text"> {userLastName} </span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="info-item">
                  Email: <span className="info-text"> {userEmail} </span>
                </p>
              </div>

              <div className="col-md-6">
                <p className="info-item">
                  Country: <span className="info-text"> {userCountry} </span>
                </p>
              </div>
              <button
                onClick={handleSubmit}
                type="submit"
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 ">
        <p className="h2">
          <b>Password </b>
        </p>
        <form action="">
          <div className="d-flex">
            <input
              type="password"
              className="form-control w-25 m-1 p-2"
              placeholder="Enter Current Password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              className="form-control w-25 m-1 p-2"
              placeholder="Enter New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={handleResetPassword} className="btn btn-dark m-2">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
