import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  // baseURL: "https://sih-4602.onrender.com/api/v1",
  withCredentials: true,
});
