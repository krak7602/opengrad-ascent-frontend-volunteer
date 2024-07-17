import axios from "axios";
import { cookies } from "next/headers";
const full = cookies().get("connect.sid");
const val = full?.name + "=" + full?.value;

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Cookie: val,
  },
});

export default axiosInstance;
