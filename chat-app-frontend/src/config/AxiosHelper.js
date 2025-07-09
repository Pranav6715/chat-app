import axios from "axios";

export const baseURL = "/"; // Use root path for same-origin backend

export const httpClient = axios.create({
  baseURL: baseURL,
});
