import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "./UseUser";

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserID } = useUser();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3006/userAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.toLowerCase(), password }),

      });

      if (response.ok) {
        const { success, user_id, redirect_url, message } = await response.json();
        if (success && user_id) {
          setUserID(user_id);
          console.log({ text: message, type: "success" });
          localStorage.setItem("userID", user_id); 
          navigate(redirect_url || '/dashboard/Home');
        } else {
          console.log({ text: message || "Login failed", type: "error" });
          alert(message)
        }
      } else {
        console.log({ text: "Network response was not ok", type: "error" });
        alert("Invalid username and password")

      }
    } catch (error) {
      console.log({ text: "Error occurred", type: "error" });
      console.error("Error occurred:", error);

    }
  };

  return (
    <>
      <div className="container-s">
        <div className=" bg-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVzc2luZXNzfGVufDB8fDB8fHww)', height: '300px' }}></div>

        <div className='mx-5 mb-5 p-5 shadow-md' style={{ marginTop: '-100px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(30px)', borderRadius: "10px" }}>
          <div className='p-5 '>
            <h2 className="fw-bold mb-5">Log in</h2>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-4">
                  <form onSubmit={handleSubmit} action="">
                    <div className="mb-4">
                      <label htmlFor="form2" className="form-label">Username </label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                        value={username}
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="form2" className="form-label">Password </label>
                      <input
                        className="form-control"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="Enter password"
                      />
                    </div>
                    <button className="btn loginBtn btn-primary w-100" type="submit">Login</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
