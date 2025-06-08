import axios from "axios";

const URL = "/api/user/";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
