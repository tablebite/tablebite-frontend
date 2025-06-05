import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Dashboard from "./Super-admin/Dashboard";
import Charts from "./Super-admin/BlankPage";
import Modal from "./Super-admin/ModalsPage";
import Buttons from "./Super-admin/ButtonsPage";
import Cards from "./Super-admin/Cards";
import Tables from "./Super-admin/CreateAccount";
import Forms from "./Super-admin/FormsPage";


import Landing from "./Landin-Page/Landing";

function App() {
  const hostname = window.location.hostname;

  return (
    <>
      <div className="status-bar-background" />
      <div className="app-content">
        {hostname === "superadmin.tablebite.in" ? (
          <Routes>
            <Route path="/" element={< Dashboard  />}>
              <Route index element={<h1>Welcome to the Super Admin Dashboard</h1>} />
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
