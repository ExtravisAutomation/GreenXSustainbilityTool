import React from "react";
import styled from "styled-components";
import { Progress } from "antd";

const StyledProgress = styled(Progress)`
  &.ant-progress {
    display: flex;
    align-items: center;
  }

  .ant-progress-steps-item {
    height: ${({ size }) => size[1] || "30px"};
    width: ${({ size }) => size[0] || "20px"};
    background-color: ${({ stepColor }) => stepColor || "#1890ff"};
    border-radius: 2px;
    margin: 0 1px;
  }

  .ant-progress-steps-item-active {
    background-color: ${({ activeStepColor }) => activeStepColor || "#52c41a"};
  }
`;

const CustomStepProgress = ({
  steps,
  percent,
  value,
  size,
  stepColor,
  activeStepColor,
  customUnit,
  ...rest
}) => {
  const calculatedPercent = (value / steps) * 100;
  console.log("calculatedPercent", calculatedPercent);

  return (
    <StyledProgress
      steps={steps}
      // percent={value || percent}
      percent={calculatedPercent}
      size={size}
      stepColor={stepColor}
      activeStepColor={activeStepColor}
      format={(percent) => `${value}${customUnit}`}
      {...rest}
    />
  );
};

export default CustomStepProgress;
