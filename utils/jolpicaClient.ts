import axios from "axios";

export const jolpicaClient = axios.create({
  baseURL: "https://api.jolpi.ca/ergast/f1/",
  headers: {
    "User-Agent": "gridbox",
  },
});
