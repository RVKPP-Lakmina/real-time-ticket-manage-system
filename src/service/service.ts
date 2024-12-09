import axios from "axios";

const url: string = import.meta.env.VITE_BACKEND_HOST as string;

export const saveUser = async (user) => {
  try {
    const res = await axios.post(`${url}/users`, user);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
