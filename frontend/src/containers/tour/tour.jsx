import React, { useRef, useState } from "react";
import { Button, Tour } from "antd";
import styled from "styled-components";
import devices from "../../resources/images/devices.png";
import addDeviceForm from "../../resources/images/add-device-form.png";

import { FaHandPointDown } from "react-icons/fa";
const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const StepBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  // justify-content: center;
  // width: 18px;
  height: 18px;
  border-radius: 100%;
  margin: 0 10px;
  background-color: ${(props) => (props.isActive ? "#1890ff" : "#f0f0f0")};
  color: ${(props) => (props.isActive ? "#fff" : "#000")};
  border: 1px solid ${(props) => (props.isActive ? "#1890ff" : "#d9d9d9")};
  // border-radius: 5px;
  font-weight: bold;
`;

const SiteTour = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);

  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Devices Inventory",

      description: (
        <div
          style={{
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <div>Modules1</div>
            <div>Modules2</div>
            <div>Modules3</div>
            <div>Modules4</div>
            <div>Modules5</div>
            <div>Modules6</div>
            <div>Modules7</div>
          </div>
          <p style={{ fontWeight: 500, marginBottom: "20px" }}>
            <strong>Step 1:</strong> Click on "Add Device" Button and enter
            inventory details
          </p>
          <p
            style={{
              position: "absolute",
              top: 140,
              right: 45,
            }}
          >
            <FaHandPointDown style={{ color: "orange", fontSize: "24px" }} />
          </p>
          <img width="100%" src={devices} alt="" srcset="" />
        </div>
      ),

      target: () => ref1.current,
    },
    {
      title: "Devices Inventory",
      description: (
        <div style={{ position: "relative" }}>
          <StepIndicator>
            <StepBox isActive={currentStep === 0}>1</StepBox>
            <StepBox isActive={currentStep === 1}>2</StepBox>
            <StepBox isActive={currentStep === 2}>3</StepBox>
            <StepBox isActive={currentStep === 2}>4</StepBox>
            <StepBox isActive={currentStep === 2}>5</StepBox>
            <StepBox isActive={currentStep === 2}>6</StepBox>
            <StepBox isActive={currentStep === 2}>7</StepBox>
          </StepIndicator>
          <p style={{ fontWeight: 500 }}>
            <strong>Step 2:</strong> Enter Device IP
          </p>
          <p
            style={{
              position: "absolute",
              top: 160,
              left: "25%",
            }}
          >
            <FaHandPointDown style={{ color: "orange", fontSize: "24px" }} />
          </p>
          <img width="100%" src={addDeviceForm} alt="" srcset="" />
        </div>
      ),
      target: () => ref2.current,
    },
    {
      title: "Devices Inventory",
      description: (
        <div style={{ position: "relative" }}>
          <StepIndicator>
            <StepBox isActive={currentStep === 0}>1</StepBox>
            <StepBox isActive={currentStep === 1}>2</StepBox>
            <StepBox isActive={currentStep === 2}>3</StepBox>
            <StepBox isActive={currentStep === 2}>4</StepBox>
            <StepBox isActive={currentStep === 2}>5</StepBox>
            <StepBox isActive={currentStep === 2}>6</StepBox>
            <StepBox isActive={currentStep === 2}>7</StepBox>
          </StepIndicator>
          <p style={{ fontWeight: 500 }}>
            <strong>Step 3:</strong> Select Device Type
          </p>
          <p
            style={{
              position: "absolute",
              top: 160,
              right: "25%",
            }}
          >
            <FaHandPointDown style={{ color: "orange", fontSize: "24px" }} />
          </p>
          <img width="100%" src={addDeviceForm} alt="" srcset="" />
        </div>
      ),
      target: () => ref3.current,
    },
    {
      title: "Devices Inventory",
      description: (
        <div style={{ position: "relative" }}>
          <StepIndicator>
            <StepBox isActive={currentStep === 0}>1</StepBox>
            <StepBox isActive={currentStep === 1}>2</StepBox>
            <StepBox isActive={currentStep === 2}>3</StepBox>
            <StepBox isActive={currentStep === 3}>4</StepBox>
            <StepBox isActive={currentStep === 4}>5</StepBox>
            <StepBox isActive={currentStep === 5}>6</StepBox>
            <StepBox isActive={currentStep === 6}>7</StepBox>
            {/* <StepBox isActive={currentStep === 2}>8</StepBox> */}
          </StepIndicator>
          <p style={{ fontWeight: 500 }}>
            <strong>Step 3:</strong> Select Device Type
          </p>
          <p
            style={{
              position: "absolute",
              top: 160,
              right: "25%",
            }}
          >
            <FaHandPointDown style={{ color: "orange", fontSize: "24px" }} />
          </p>
          <img width="100%" src={addDeviceForm} alt="" srcset="" />
        </div>
      ),
      target: () => ref4.current,
    },
    {
      title: "Devices Inventory",
      description: (
        <div style={{ position: "relative" }}>
          <StepIndicator>
            <StepBox isActive={currentStep === 0}>1</StepBox>
            <StepBox isActive={currentStep === 1}>2</StepBox>
            <StepBox isActive={currentStep === 2}>3</StepBox>
            <StepBox isActive={currentStep === 3}>4</StepBox>
            <StepBox isActive={currentStep === 4}>5</StepBox>
            <StepBox isActive={currentStep === 5}>6</StepBox>
            <StepBox isActive={currentStep === 6}>7</StepBox>
          </StepIndicator>
          <p style={{ fontWeight: 500 }}>
            <strong>Step 3:</strong> Select Device Type
          </p>
          <p
            style={{
              position: "absolute",
              top: 160,
              right: "25%",
            }}
          >
            <FaHandPointDown style={{ color: "orange", fontSize: "24px" }} />
          </p>
          <img width="100%" src={addDeviceForm} alt="" srcset="" />
        </div>
      ),
      target: () => ref5.current,
    },
    {
      title: "Devices Inventory",
      description: (
        <div style={{ position: "relative" }}>
          <StepIndicator>
            <StepBox isActive={currentStep === 0}>1</StepBox>
            <StepBox isActive={currentStep === 1}>2</StepBox>
            <StepBox isActive={currentStep === 2}>3</StepBox>
            <StepBox isActive={currentStep === 3}>4</StepBox>
            <StepBox isActive={currentStep === 4}>5</StepBox>
            <StepBox isActive={currentStep === 5}>6</StepBox>
            <StepBox isActive={currentStep === 6}>7</StepBox>
          </StepIndicator>
          <p style={{ fontWeight: 500 }}>
            <strong>Step 3:</strong> Select Device Type
          </p>
          <p
            style={{
              position: "absolute",
              top: 160,
              right: "25%",
            }}
          >
            <FaHandPointDown style={{ color: "orange", fontSize: "24px" }} />
          </p>
          <img width="100%" src={addDeviceForm} alt="" srcset="" />
        </div>
      ),
      target: () => ref6.current,
    },
    {
      title: "Devices Inventory",
      description: (
        <div style={{ position: "relative" }}>
          <StepIndicator>
            <StepBox isActive={currentStep === 0}>1</StepBox>
            <StepBox isActive={currentStep === 1}>2</StepBox>
            <StepBox isActive={currentStep === 2}>3</StepBox>
            <StepBox isActive={currentStep === 3}>4</StepBox>
            <StepBox isActive={currentStep === 4}>5</StepBox>
            <StepBox isActive={currentStep === 5}>6</StepBox>
            <StepBox isActive={currentStep === 6}>7</StepBox>
          </StepIndicator>
          <p style={{ fontWeight: 500 }}>
            <strong>Step 3:</strong> Select Device Type
          </p>
          <p
            style={{
              position: "absolute",
              top: 160,
              right: "25%",
            }}
          >
            <FaHandPointDown style={{ color: "orange", fontSize: "24px" }} />
          </p>
          <img width="100%" src={addDeviceForm} alt="" srcset="" />
        </div>
      ),
      target: () => ref7.current,
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Begin Tour
      </Button>
      {/* <div>
        <Button ref={ref1}>Upload</Button>
        <Button ref={ref2} type="primary">
          Save
        </Button>
        <Button ref={ref3}>Other Actions</Button>
      </div> */}

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        current={currentStep}
        onChange={(current) => setCurrentStep(current)}
        type="primary"
      />
    </>
  );
};

export default SiteTour;
