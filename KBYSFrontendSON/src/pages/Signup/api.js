import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export function signUp(body) {
  return axios.post(`${apiUrl}User/register`, body, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "tr"
    }
  });
}
