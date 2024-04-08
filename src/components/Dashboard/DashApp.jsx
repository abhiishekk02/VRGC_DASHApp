import { Route, Routes, useNavigate } from "react-router-dom";
import DashNavBar from "./components/DashNavbar/DashNavBar";
import { useState, useEffect } from "react";
import useUser from "../../private/UseUser";
import "./Dash.css";
import DashHome from "./components/DashHome/DashHome";
import Certificates from "./components/DashCertificate/DashCertificates";
import DashShowcase from "./components/DashShowCase/DashShowcase"
import DashSettings from "./components/Settings/DashSettings";
import Clients from "./components/DashClients/Clients";
// import DashShowTest from "./components/DashShowCase/DashShowTest";
export default function DashApp() {
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setCollapsed(isMobile);
    };

    handleResize(); 

    window.addEventListener("resize", handleResize); 

    return () => {
      window.removeEventListener("resize", handleResize); 
    };
  }, []); 

  const navigate = useNavigate();
  const {
    setUserID,
    setUserNameIP,
    setUserEmailIP,
    setUserFirstName,
    setUserLastName,
    setUserCountry,
    setUserProfilePicture,
    setRefresh,
    refresh
  } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const toggleNav = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    setUserID(storedUserID);

    if (storedUserID) {

      const fetchUserDetails = async () =>{
    const storedUserID = localStorage.getItem("userID");

        try {
          const response = await fetch(`http://localhost:3006/userAuth/${storedUserID}`)
          

          if(response.ok){
            const userData = await response.json()
            setUserNameIP(userData.user_name)
            setUserFirstName(userData.first_name)
            setUserLastName(userData.last_name)
            setUserCountry(userData.country)
            setUserEmailIP(userData.user_email)
            setUserProfilePicture(userData.profile_picture)
            setRefresh(false)

           
          }
          
        } catch (error) {
          console.error("Unable to fetch user details", error)
        }
      }


fetchUserDetails()

    } else {
      navigate("/");
    }
  }, [setUserID, navigate, refresh]);

 


  return (
    <>
      <div className="Dash">
        <DashNavBar collapsed={collapsed} toggleNav={toggleNav} />
        <div className={`Content container ${collapsed ? "collapsed" : ""}`}>
          <div className="StatusPlaceholder" />
          <Routes >
            <Route path="/Home" element={<DashHome/>} />
            <Route path="/Certificate" element={<Certificates/>} />
            <Route path="/Showcase" element={<DashShowcase/>} />
            <Route path="/Clients" element={<Clients/>} />
            {/* <Route path="/Clients" element={<DashClients/>} /> */}


            <Route path="/Settings/*" element={<DashSettings/>} />



          </Routes>
        </div>
      </div>
    </>
  );
}
