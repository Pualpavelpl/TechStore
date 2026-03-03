import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode"; // <-- исправлено

export const registration = async (email, password) => {
  const { data } = await $host.post("api/user/registration", {
    email,
    password,
    role: "ADMIN",
  });
  localStorage.setItem("token", data.token);
  if (data.token) {
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
  }
};
console.log(process.env.REACT_APP_API_URL);
export const login = async (email, password) => {
  const { data } = await $host.post("api/user/login", { email, password });
  localStorage.setItem("token", data.token); // <-- исправлено
  if (data.token) {
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
  }
};

export const check = async () => {
  const { data } = await $authHost.get("api/user/auth");
  localStorage.setItem("token", data.token);
  if (data.token) {
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
  }
};
