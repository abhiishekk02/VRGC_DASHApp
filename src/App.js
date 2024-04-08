import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Administration from "./private/Administration";
import DashApp from "./components/Dashboard/DashApp";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Administration />} />
        <Route path="/dashboard/*" element={<DashApp />} />
      </Routes>
    </Router>
  );
};

export default App;
