import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import DashboardSA from "./Super-admin/DashboardSA";
import HomeSDashboard from "./Super-admin/HomeSDashboard";
import ViewMenus from "./Super-admin/ViewMenus"; 
import AddRestaurant from "./Super-admin/AddRestaurant";
import ViewRestaurants from "./Super-admin/ViewRestaurants";
import Landing from "./Landin-Page/Landing";

function App() {
  const hostname = window.location.hostname;

  return (
    <>
      <div className="status-bar-background" />
      <div className="app-content">
        {hostname === "superadmin.tablebite.in" ? (
          <Routes>
            <Route path="/" element={<HomeSDashboard />}>
              <Route index element={<h1>Welcome to the Super Admin Dashboard</h1>} />
              <Route path="add-menu" element={<DashboardSA />} />
              <Route path="view-menus" element={<ViewMenus />} />
              <Route path="add-restaurants" element={<AddRestaurant />} />
              <Route path="view-restaurants" element={<ViewRestaurants />} />
              <Route path="settings" element={<h1>Settings Section</h1>} />
            </Route>
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/restaurant/:restaurantId" element={<Home />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        )}
      </div>
    </>
  );
}

export default App;
