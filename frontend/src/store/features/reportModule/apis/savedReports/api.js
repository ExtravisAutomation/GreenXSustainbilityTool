import axios from "axios";

import { BaseUrl } from "../../../../../utils/axios";
const api = axios.create({
  baseURL: BaseUrl,
});

export const fetchSavedReports = async () => {
  const response = await api.get("/reports/getallreports");
  return response.data.data;
};

export const createSavedReport = async (values) => {
  const response = await api.post("/sites/addsite", values);
  // console.log(response, "add site response");
  return response.data;
};

export const updateSavedReport = async (itemId, values) => {
  const response = await api.post(`/sites/updatesite/${itemId}`, values);
  // console.log(response, "update response");

  return response.data;
};

export const deleteSavedReport = async (itemId) => {
  console.log(itemId, "item id");
  await api.post(`/reports/deletereport`, itemId);
};
