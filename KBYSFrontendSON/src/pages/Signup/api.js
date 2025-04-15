import axios from "axios";

export function signUp(body) {
  return axios.post('/api/User/register', body, { // Use the full backend URL
    headers: {
      "Content-Type": "application/json", // Ensure content-type header is included
      "Accept-Language": "tr"
    }
  });
}
