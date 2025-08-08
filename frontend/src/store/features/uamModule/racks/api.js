import axios from "axios";

import { baseUrl, BaseUrl } from "../../../../utils/axios";
const access_token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: baseUrl,
});

export const fetchRacks = async (access_token) => {
  const response = await api.get("/racks/getallracks", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.data.data;
};

export const createRack = async (values) => {
  const response = await api.post("/racks/addrack", values, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

export const updateRack = async (itemId, values) => {
  const response = await api.post(`/racks/updaterack/${itemId}`, values, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.data;
};

export const deleteRack = async (itemId) => {
  await api.post(`/racks/deleterack`, itemId, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
