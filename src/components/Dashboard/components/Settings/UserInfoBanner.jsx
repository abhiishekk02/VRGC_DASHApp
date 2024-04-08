import useUser from "../../../../private/UseUser";

import ProfileDetails from "./ProfileDetails";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
export default function UserInfoBanner(params) {
  const { userName, userFirstName, userLastName ,userProfilePicture } = useUser();
const Navigate = useNavigate()
 

  return (
    <div className="container">
      {/* <h2 className="headline">Settings Page</h2> */}

      <div className="d-flex user-info-box">
        <div className=" profile-picture">
          <img
            className="profile-pic"
            src={userProfilePicture}
            alt="Profile"
          />
        </div>
        <div className="col user-details">
          <p>
            <span className="name">{userFirstName}  {userLastName}</span>
            <br />
            <span className="username">@{userName}</span>
          </p>
        </div>
      </div>
      <div className="settingNavLinks">
<div className="row">

      {/* <button onClick={CheckProfileDetails} className="checkProfileBtn">Profile details <span>&gt;</span> </button> */}

      <ProfileDetails/>

      </div>
      </div>


    </div>
  );
}
