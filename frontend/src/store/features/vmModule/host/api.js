import axios from "axios";

import { baseUrl, BaseUrl } from "../../../../utils/axios";
const access_token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: baseUrl,
});

export const fetchHosts = async () => {
  const response = await api.post("/vcenter/gethostdetails/", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  // console.log(response.data.data, "fetch hosts");
  return response.data.data;
};

export const createSite = async (values) => {
  const response = await api.post("/sites/addsite", values);
  // console.log(response, "add site response");
  return response.data;
};

export const updateSite = async (itemId, values) => {
  const response = await api.post(`/sites/updatesite/${itemId}`, values);
  // console.log(response, "update response");

  return response.data;
};

export const deleteSite = async (itemId) => {
  // console.log(itemId, "item id");
  await api.post(`/sites/deletesite`, itemId);
};
