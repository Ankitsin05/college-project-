import axios from "axios";

const API = axios.create({
  baseURL: "https://college-project-pznf.onrender.com/api"
});

export default API;