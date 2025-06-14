import { AxiosError } from "axios";
import type { GetAllTasksResponse } from "../types/ApiDTO";
import type { Task } from "../types/Models";
import api from "../config/interceptor";

const URL = "/api/taskapi/";

export const getAllTasks = async (
  type: string | null = null
): Promise<GetAllTasksResponse> => {
  const query_param = type ? "?type=" + type : "";
  try {
    const response = await api.get<GetAllTasksResponse>(URL + query_param, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
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

export const completeTask = async (id: number | null = null): Promise<Task> => {
  try {
    const response = await api.put<Task>(URL + id + "/complete/", null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
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

export const revertTask = async (id: number | null = null): Promise<Task> => {
  try {
    const response = await api.put<Task>(URL + id + "/todo/", null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
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

export const updateTask = async (
  id: number,
  task: Partial<Task>
): Promise<Task> => {
  console.log("updating task: ", task);
  try {
    const response = await api.patch<Task>(URL + id + "/", task, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
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
