import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import Home from "../src/menu/Home";
import Landing from "../src/landing/Landing";

const App = () => {

    const hostname = window.location.hostname;

  return (
    <>
     {hostname === "superadmin.tablebite.in" ||  hostname === "admin.tablebite.in"?
      (<Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="/*" element={<AdminLayout />} />
      <Route path="rtl/*" element={<RtlLayout />} />
     </Routes>) 
     : 
     ( <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/restaurant/:restaurantId" element={<Home />} />
    </Routes>)}
    </>
  );
};

export default App;
