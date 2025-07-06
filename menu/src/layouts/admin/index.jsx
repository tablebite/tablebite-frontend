import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();

  // Track whether we're in "mobile" (<1200px) and sidebar open state
  const [isMobile, setIsMobile] = React.useState(
    () => window.innerWidth < 1200
  );
  const [open, setOpen] = React.useState(
    () => !(window.innerWidth < 1200)
  );
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  // Keep isMobile & open in sync on resize
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1200;
      setIsMobile(mobile);
      // if switching into mobile view, auto-close; if into desktop, auto-open
      setOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update the header text on route change
  React.useEffect(() => {
    routes.forEach(r => {
      if (window.location.href.includes(r.layout + "/" + r.path)) {
        setCurrentRoute(r.name);
      }
    });
  }, [location.pathname]);

  const getActiveNavbar = () => {
    for (let r of routes) {
      if (window.location.href.includes(r.layout + r.path)) {
        return r.secondary || false;
      }
    }
    return false;
  };

  const getRoutes = () =>
    routes.map((r, idx) =>
      r.layout === "/admin" ? (
        <Route path={`/${r.path}`} element={r.component} key={idx} />
      ) : null
    );

  document.documentElement.dir = "ltr";

  return (
    <div className="">
      {/* The drawer */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Backdrop only when open & on mobile */}
      {open && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main className="mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]">
          <Navbar
            onOpenSidenav={() => setOpen(true)}
            logoText="Horizon UI Tailwind React"
            brandText={currentRoute}
            secondary={getActiveNavbar()}
            {...rest}
          />
          <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
            <Routes>
              {getRoutes()}
              <Route
                path="/"
                element={<Navigate to="/admin/default" replace />}
              />
            </Routes>
          </div>
          <div className="p-3">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
