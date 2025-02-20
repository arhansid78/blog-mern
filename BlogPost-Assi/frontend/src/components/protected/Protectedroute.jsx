import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";

const ProtectedRoute = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const toastShown = useRef(false); // ✅ Track if toast is already shown

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      if (!toastShown.current) {
        // ✅ Prevent duplicate toast
        toast.error("Please login!", {
          position: "top-right",
          autoClose: 2000,
        });
        toastShown.current = true;
      }
      setIsAuthenticated(false);
    } else {
      toastShown.current = false; // ✅ Reset when user logs in
      setIsAuthenticated(true);
    }
  }, [location.pathname]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
