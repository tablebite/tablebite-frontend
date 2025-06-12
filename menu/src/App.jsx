import React from "react";
import { Routes, Route } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import Home from "../src/menu/Home";
import Landing from "../src/landing/Landing";

const App = () => {
    const hostname = window.location.hostname;

    return (
        
            <Routes>
                {/* Check if the hostname is 'admin.tablebite.in' */}
                {hostname === "admin.tablebite.in" ? (
                    <>
                        <Route path="auth/*" element={<AuthLayout />} />
                       <Route path="dashboard/*" element={<AdminLayout />} />
                        <Route path="rtl/*" element={<RtlLayout />} />
                    </>
                ) : (
                    <>
                        {/* Default routes when hostname is not 'admin.tablebite.in' */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/restaurant/:restaurantId" element={<Home />} />
                    </>
                )}
                
            </Routes>
        
    );
};

export default App;
