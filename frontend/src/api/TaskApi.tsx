import axios, { AxiosError } from "axios";
import type { GetAllTasksResponse } from "../types/ApiDTO";
import type { Task } from "../types/Models";

const URL = "/api/taskapi/";

export const getAllTasks = async (
  token: String,
  type: string | null = null
): Promise<GetAllTasksResponse> => {
  const query_param = type ? "?type=" + type : "";
  try {
    const response = await axios.get<GetAllTasksResponse>(URL + query_param, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

export const completeTask = async (
  token: String,
  id: number | null = null
): Promise<Task> => {
  try {
    const response = await axios.put<Task>(URL + id + "/complete/", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

export const revertTask = async (
  token: String,
  id: number | null = null
): Promise<Task> => {
  try {
    const response = await axios.put<Task>(URL + id + "/todo/", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
