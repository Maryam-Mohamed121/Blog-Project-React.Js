import { jwtDecode } from "jwt-decode";
import { APIClient } from ".";

export const getMe = async () => {
  try {
    const { token } =
      JSON.parse(localStorage.getItem("auth-store"))?.state ?? {};
    if (!token) throw new Error("no token found");
    const { id } = jwtDecode(token);
    return await APIClient.get(`/users/${id}`);
  } catch (error) {
    throw new Error(error);
  }
};
