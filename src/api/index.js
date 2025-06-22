import axios from "axios";
import { refreshTokeAPI } from "./auth";
import { jwtDecode } from "jwt-decode";

export const APIClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function removeTokenHandler() {
  localStorage.removeItem("auth-store");
  window.location.replace("/login");
}

export function isTokenExpire(token) {
  try {
    const { exp, expiresIn } = jwtDecode(token);
    const now = Date.now() / 1000;
    return (exp ?? expiresIn) < now;
  } catch {
    return true;
  }
}

export const publicRoutes = ["/signup", "/refresh-token", "/login"];

APIClient.interceptors.request.use(
  async (config) => {
    if (!publicRoutes.includes(config.url)) {
      const { token, refreshToken } =
        JSON.parse(localStorage.getItem("auth-store"))?.state ?? {};

      if (isTokenExpire(token)) {
        if (!isTokenExpire(refreshToken)) {
          try {
            const res = await refreshTokeAPI({ refreshToken });
            localStorage.setItem(
              "auth-store",
              JSON.stringify({
                state: {
                  token: res.data.token,
                  refreshToken: res.data.refreshToken,
                },
              })
            );
            config.headers.Authorization = `Bearer ${res.data.token}`;
          } catch {
            removeTokenHandler();
          }
        } else {
          removeTokenHandler();
        }
      } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
