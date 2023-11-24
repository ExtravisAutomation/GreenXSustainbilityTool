// SiteDetail.js
import React from "react";
import { useParams } from "react-router-dom";

const SiteDetail = () => {
  const { id } = useParams();

  return <div>Site Detail for ID: {id}</div>;
};

export default SiteDetail;
