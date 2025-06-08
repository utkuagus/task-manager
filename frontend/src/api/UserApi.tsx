import axios, { AxiosError } from "axios";
import type { LoginRequest, LoginResponse } from "../types/ApiDTO";

const URL = "/api/user/";

export const login = async (req: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(URL + "login/", req);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      console.error("Login failed:", err.response.data);
    } else if (err.request) {
      console.error("No response from server:", err.request);
    } else {
      console.error("Error setting up login request:", err.message);
    }
    throw err;
  }
};
