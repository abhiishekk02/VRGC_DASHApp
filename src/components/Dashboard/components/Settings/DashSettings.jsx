import {  Routes, Route } from "react-router-dom"
import UserInfoBanner from "./UserInfoBanner"
import ProfileDetails from "./ProfileDetails"
export default function DashSettings(params) {

  return(
    <>
        <UserInfoBanner/>

        <Routes>

            <Route path="/ProfileDetails"  element={<ProfileDetails/>} />
        </Routes>



    </>
  )  
};
