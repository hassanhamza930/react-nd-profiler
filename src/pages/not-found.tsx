import { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setIsAuthenticated(isLoggedIn === "true");
    if (isLoggedIn === "true") {
      console.log("isAuthenticated", isLoggedIn);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    isAuthenticated && (
      <div className="flex justify-center items-center flex-col">
        <h1>404 - Page Not Found</h1>
        <Button onClick={() => redirect("/dashboard")}>Go to Dashboard</Button>
      </div>
    )
  );
}
