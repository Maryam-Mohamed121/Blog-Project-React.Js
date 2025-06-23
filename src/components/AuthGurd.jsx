import { isTokenExpire } from "@/api";
import { useAuthStore } from "@/store/auth";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthGurdRoute = () => {
  const { pathname } = useLocation();
  const { token, isValidTokens, loading } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      console.log("Checking tokens...");
      await isValidTokens();
      setChecked(true);
      console.log("Checked tokens, setChecked(true)");
    })();
  }, []);

  if (loading || !checked)
    return <div className="text-center my-5">Checking authentication...</div>;

  if (!token || isTokenExpire(token)) {
    return <Navigate to={`/login?redirectTo=${pathname}`} />;
  }

  return <Outlet />;
};

export default AuthGurdRoute;
