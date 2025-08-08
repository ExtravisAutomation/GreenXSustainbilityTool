import React from "react";
import { Pagination } from "antd";

const CustomPagination = ({ total, onChange, current }) => {
  const handlePrev = () => {
    onChange(current - 1);
  };

  const handleNext = () => {
    onChange(current + 1);
  };

  return (
    <Pagination
      simple
      total={total}
      defaultPageSize={10}
      current={current}
      onChange={onChange}
      prevIcon="⟨"
      nextIcon="⟩"
    />
  );
};

export default CustomPagination;
