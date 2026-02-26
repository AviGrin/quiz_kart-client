import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardWrapper from "./DashboardWrapper.jsx";
function App() {


  return (
      <BrowserRouter>
          <Routes>
              <Route path={"/"} element={<LoginPage />} />
              <Route path={"/signup"} element={<SignupPage />} />
              <Route path={"/dashboard"} element={<DashboardWrapper />} />

          </Routes>
      </BrowserRouter>
  )
}

export default App
