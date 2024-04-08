import React, { createContext, useState, useContext } from "react";

const UserContext = createContext(); //To create a context

export const UserProvider = ({ children }) => {
  const [userName, setUserNameIP] = useState("");
  const [userEmail, setUserEmailIP] = useState("");
  const [userFirstName, setUserFirstName] = useState("")
  const [userLastName, setUserLastName] = useState("")
  const [userCountry, setUserCountry] = useState("")
  const [userProfilePicture, setUserProfilePicture] = useState("")
  const [refresh, setRefresh] = useState(false)
  // const [statusMessage, setStatusMessage] = useState({
  //   text: '',
  //   type: 'success',
  //   visible: false
  // });
  const [statusMessage, setStatusMessage] = useState(['hi','success', false])

  

const [userID, setUserID] = useState("")

  return (
    <UserContext.Provider
      value={{ userName, setUserNameIP, userEmail, setUserEmailIP, userFirstName, setUserFirstName, userLastName, setUserLastName, userCountry, setUserCountry, userProfilePicture, setUserProfilePicture, userID, setUserID, refresh, setRefresh, statusMessage, setStatusMessage }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);
export default useUser;