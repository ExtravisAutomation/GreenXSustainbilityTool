import { Button } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";

import devices from "../../resources/images/devices.png";
import addDeviceForm from "../../resources/images/add-device-form.png";
import selectDevice from "../../resources/images/selectDevice.png";
import falseDevice from "../../resources/images/false.png";
import successImg from "../../resources/images/onboardSuccess.png";

import onboardedDevicesImg from "../../resources/images/onboarded-devices.png";
import onboardedDevicesDetailImg from "../../resources/images/device-details.png";

import screenshotD from "../../resources/images/screenshot-d.png";
import eerGraph from "../../resources/images/eer-graph.png";
import pueGraph from "../../resources/images/pue.png";
import carbonE from "../../resources/images/carbon-e.png";
import eerPerDevice from "../../resources/images/eer-per-device.png";
import puePerDevice from "../../resources/images/pue-per-device.png";
import deviceLevel from "../../resources/images/device-level-carbon-emission.png";
import datatraffic from "../../resources/images/energy-efficieny-trends-accross-data-traffic.png";
import deviceSpecific from "../../resources/images/device-specific-power-consumption.png";
import top5 from "../../resources/images/top-5-devices.png";
import summaryM from "../../resources/images/summary-m.png";
import heatMap from "../../resources/images/heat-map.png";
import hardwareL from "../../resources/images/hardware-life-cycle.png";
import map from "../../resources/images/map.png";
import sitesImg from "../../resources/images/sitesImg.png";
import siteFormImg from "../../resources/images/siteFormImg.png";
import siteDetailImg from "../../resources/images/site-details-img.png";
import siteAdeddImg from "../../resources/images/site-added-msg.png";

import generateReport from "../../resources/images/generate-report.png";
import reportSaveMsg from "../../resources/images/report-saved.png";
import savesReport from "../../resources/images/saved-reports.png";

import hostImg from "../../resources/images/vcenterImg.png";
import hostDetailImg from "../../resources/images/hostsDetailsImg.png";
import vmImg from "../../resources/images/vmImg.png";
import vmdetailImg from "../../resources/images/vmDetailsImg.png";

import { FaHandPointDown } from "react-icons/fa";

const TourModule = ({ setModalTour }) => {
  const theme = useTheme();

  const modules = [
    {
      title: "Dashboard",
      path: "tour-dashboard",
      children: [
        {
          name: "EER Graph",
          description:
            "Select the site from here and visualize data for it throughout the dashboard.",
          image: screenshotD,
        },
        {
          name: "PUE",
          description:
            "This represents the total no of devices has been added untill yet.",
          image: screenshotD,
        },
        {
          name: "Carbon Emission",
          description:
            "This represents the total no of onboarded devices has been onboarded untill yet.",
          image: screenshotD,
        },
        {
          name: "EER Per Device",
          description:
            "This represents the total no of racks has been added untill yet.",
          image: screenshotD,
        },
        {
          name: "PUE Per Device",
          description: "This represents the total no of vendors.",
          image: screenshotD,
        },
        {
          name: "Device Level Carbon Emission",
          description:
            "Step-6 : This graph shows Energy Efficiency Ratio for the whole site. You can also filter through the time duration just change in the selector.",
          image: screenshotD,
        },
        {
          name: "Energy Efficiency Trends Across Data Traffic",
          description:
            "Step-7 : This graph shows Power Usage Effectiveness for the whole site. You can also filter through the time duration just change in the selector.",
          image: screenshotD,
        },
        {
          name: "Device-Specific Power Consumption Analysis",
          description:
            "Step-8 : This graph shows carbon emission and Miximum Energy consumed for the selected site. You can visualize according to the mentioned time durations in the selector as well.",
          image: screenshotD,
        },
        {
          name: "Top 5 Devices Power Utilization and Cost from 24 hours",
          description:
            "Step-9 : This graph shows device level Energy Efficiency Ratio. Change the device in the selector to see Energy Efficiency Ratio for it. You can also change time duration through selector to see data accordingly.",
          image: screenshotD,
        },
        {
          name: "Summary Metrics",
          description:
            "Step-10 : This graph shows device level power usage effectiveness. Change the device in the selector to see power usage effectiveness for it. You can also change time duration through selector to see data accordingly.",
          image: screenshotD,
        },
        {
          name: "Heat Map of Racks",
          description:
            "Step-11 : This graph shows device level carbon emission. You can visualize according to the selected time duration by changing in the selector.",
          image: screenshotD,
        },
        {
          name: "Hardware Lifecycle",
          description:
            "Step-12 : This graph shows Energy Efficiency trends accross data traffic for any device. You can select any device and time duration from the selectors to visualize data accordingly.",
          image: screenshotD,
        },
        {
          name: "Energy Emission",
          description:
            "Step-13 : This barchart shows the device specific power consumption analysis. which compares for 2 devices. click on the compare button in the chart to manually compare for any 2 devices.",
          image: screenshotD,
        },

        {
          name: "Top 5 Devices Power Utilization and Cost from 24 hours",
          description:
            "Step-14 : This graph shows top 5 devices Power Utilization and cost for all the durations depends on what have you selected in the selector, if you selected 24 hours it will show data for 24 hours and so on...",
          image: screenshotD,
        },
        {
          name: "Summary Metrics",
          description:
            "Step-15 : This graph shows summary metrics in the context of total power consumption, Peak Usage and Average Energy Efficiency in (KWH).",
          image: screenshotD,
        },
        {
          name: "Heat Map of Racks",
          description: "Step-16 : This graph shows Heat Map of all the Racks.",
          image: screenshotD,
        },
        {
          name: "Hardware Lifecycle",
          description:
            "Step-17 : This graph shows Hardware Lifecycle of the whole site. Click on the see details for indepth details.",
          image: screenshotD,
        },
        {
          name: "Energy Emission",
          description:
            "Step-18 : This map tells about the location of the site and its energy emission. Hover mouse over the site you will see the details of the site.",
          image: screenshotD,
        },
      ],
    },
    {
      title: "Devices Inventory",
      path: "tour-devices",
      children: [
        {
          name: "Add Device",
          description:
            "Step-1 : Start by adding a new device to the inventory.",
          image: devices,
        },
        {
          name: "Enter Device IP",
          description: "Step-2 : Enter the IP address of the device.",
          image: addDeviceForm,
        },
        {
          name: "Select Device Type",
          description: "Step-3 : Choose the type of device from the list.",
          image: addDeviceForm,
        },
        {
          name: "Select Vendor",
          description: "Step-4 : Select the vendor for the device.",
          image: addDeviceForm,
        },
        {
          name: "Select Site",
          description: "Step-5 : Specify the site where the device is located.",
          image: addDeviceForm,
        },
        {
          name: "Select Rack",
          description:
            "Step-6 : Choose the rack where the device will be installed.",
          image: addDeviceForm,
        },
        {
          name: "Select Password Group",
          description: "Step-7 :Assign a password group to the device.",
          image: addDeviceForm,
        },
        {
          name: "Submit",
          description:
            "Step-8 : Submit the device details to complete the process.",
          image: addDeviceForm,
        },
        {
          name: "Added Device",
          description:
            "Step-9 : Added Device but status is false because it is yet not onboarded.",
          image: falseDevice,
        },
        {
          name: "Select the new Added Device",
          description: "Step-10 : Select the new added device to onboard.",
          image: selectDevice,
        },
        {
          name: "Onboard Device",
          description:
            "Step-11: Click on the Onboard Device button to onboard the added device.",
          image: selectDevice,
        },
        {
          name: "Successful Message",
          description:
            "Step-12 : When the device onboard successfully Then you will see this message.",
          image: successImg,
        },
      ],
    },
    {
      title: "OnBoarded Module",
      path: "tour-onboarded",
      children: [
        {
          name: "Sites",
          description:
            "Once you onboard the device you will see that here in this table.",
          // image: sitesImg,
          image: onboardedDevicesImg,
        },
        {
          name: "Racks",
          description:
            "Click on any row to see details for that specific device.",
          // image: siteFormImg,
          image: onboardedDevicesImg,
        },
        {
          name: "OnBoarded Devices",
          description:
            "Data in this card shows the descriptive details of the device.",
          image: onboardedDevicesDetailImg,
        },
        {
          name: "energy efficiency",
          description: "This guage shows the energy efficiency per hour.",
          image: onboardedDevicesDetailImg,
        },
        {
          name: "rack",
          description:
            "Data in this card shows the descriptive details of the device.",
          image: onboardedDevicesDetailImg,
        },
        {
          name: "data traffic",
          description:
            "This graph represents the device data traffic for 24 hours.",
          image: onboardedDevicesDetailImg,
        },
        {
          name: "ee",
          description:
            "This graph represents the device energy efficiency for 24 hours.",
          image: onboardedDevicesDetailImg,
        },
        {
          name: "rest",
          description:
            "In Chasses, Module, Power Supply and Fan only data available in the form of tables visit them and see their details. Now click on next to see for site module.",
          image: onboardedDevicesImg,
        },
        {
          name: "Sites",
          description:
            "This table represents the site details. Now click on the Add Site button to add a new site.",
          image: sitesImg,
        },
        {
          name: "Site Name",
          description: "Enter site name here.",
          image: siteFormImg,
        },
        {
          name: "Site Type",
          description: "Enter site type here.",
          image: siteFormImg,
        },
        {
          name: "Country",
          description: "Enter Country name here.",
          image: siteFormImg,
        },
        {
          name: "City",
          description: "Enter City name here.",
          image: siteFormImg,
        },
        {
          name: "Status",
          description: "Select status here in the dropdown.",
          image: siteFormImg,
        },
        {
          name: "Latitude",
          description: "Enter Latitude here in float.",
          image: siteFormImg,
        },
        {
          name: "Longitude",
          description: "Enter Longitude here in float.",
          image: siteFormImg,
        },
        {
          name: "Submit",
          description: "Click on the submit button to add the site.",
          image: siteFormImg,
        },
        {
          name: "Submit",
          description:
            "When the site add successfully you will see this like message on the screen printed. And then check in the table you will see that new added site.",
          image: siteAdeddImg,
        },
        {
          name: "Sites",
          description:
            "Now Click on any row to see more in detail for a specific site.",
          // image: sitesImg,
          image: onboardedDevicesImg,
        },
        {
          name: "Site Details",
          description:
            "This card shows the specific site data in descriptive form.",
          // image: sitesImg,
          image: siteDetailImg,
        },
        {
          name: "Site EE",
          description:
            "This graph display the sites energy efficiency for 24 hours.",
          image: siteDetailImg,
        },
        {
          name: "current Site EE",
          description:
            "These circular progress bars shows the current site energy efficiency hourly bases.",
          image: siteDetailImg,
        },
        {
          name: "Carbon Emission",
          description: "Here it shows the carbon emission hourly bases.",
          image: siteDetailImg,
        },
        {
          name: "Sites Required Power",
          description: "Here it shows the first 4 Sites Required Power.",
          image: siteDetailImg,
        },
        {
          name: "Carbon Emission",
          description:
            "Here it shows the first 4 Sites Input Energy Efficiency.",
          image: siteDetailImg,
        },
        {
          name: "Sites",
          description:
            "Now Click on the Racks here and repeat same flow as of Sites.",
          // image: sitesImg,
          image: onboardedDevicesImg,
        },
      ],
    },

    {
      title: "Reports",
      path: "tour-reports",
      children: [
        {
          name: "Child 1 - Reports",
          description:
            "This is the default title but you can edit and enter a new one.",
          image: generateReport,
        },
        {
          name: "Child 2 - Reports",
          description: "Select a site from here.",
          image: generateReport,
        },
        {
          name: "Child 3 - Reports",
          description: "Select time duration from here.",
          image: generateReport,
        },
        {
          name: "Child 4 - Reports",
          description:
            "Here in the available options as you can see the checkboxes, select your choices and it will render in the right selected option box.",
          image: generateReport,
        },
        {
          name: "Child 5 - Reports",
          description:
            "After filling the form click on this Run and Save button to save the report",
          image: generateReport,
        },
        {
          name: "Child 6 - Reports",
          description:
            "When the report create successfully then you will see this message printed on the screen.",
          image: reportSaveMsg,
        },
        {
          name: "Child 7 - Reports",
          description:
            "when the report create successfully then click on the saved report menu item to see the created report in the table.",
          image: generateReport,
        },
        {
          name: "Child 8 - Reports",
          description:
            "Search here the created report by Report Title and you will see.",
          image: savesReport,
        },
      ],
    },
    {
      title: "VCenter",
      path: "tour-vcenter",
      children: [
        {
          name: "Child 1 - VCenter",
          description: "Below table shows the hosts in detail.",
          image: hostImg,
        },
        {
          name: "Child 2 - VCenter",
          description:
            "If you want to go more in detail for a specific host then click on the host name it will navigate you to the detail page.",
          image: hostImg,
        },
        {
          name: "Child 3 - VCenter",
          description: "This is the host detail page.",
          image: hostDetailImg,
        },
        {
          name: "Child 4 - VCenter",
          description: "Now click on the Virtual Matchines and explore it.",
          image: hostImg,
        },
        {
          name: "Child 5 - VCenter",
          description: "The below table reprents the virtual matchines.",
          image: vmImg,
        },
        {
          name: "Child 6 - VCenter",
          description:
            "If you want to go more in detail for a specific virtual matchine then click on the virtual matchine it will navigate you to the detail page.",
          image: vmImg,
        },
        {
          name: "last",
          description: "This is the virtual matchine detail page.",
          image: vmdetailImg,
        },
      ],
    },
  ];

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  const moduleRefs = useRef(
    modules.map((module) => module.children.map(() => React.createRef()))
  );

  const currentModule = modules[currentModuleIndex];
  const currentChild = currentModule.children[currentChildIndex];

  const handleNext = () => {
    if (currentChild.name === "last") {
      setCurrentModuleIndex(0);

      setCurrentChildIndex(0);

      setModalTour(false);
    } else {
      const hasNextChild =
        currentChildIndex < modules[currentModuleIndex].children.length - 1;
      if (hasNextChild) {
        setCurrentChildIndex(currentChildIndex + 1);
      } else if (currentModuleIndex < modules.length - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
        setCurrentChildIndex(0);
      }
    }
  };

  const handlePrevious = () => {
    const hasPreviousChild = currentChildIndex > 0;
    if (hasPreviousChild) {
      setCurrentChildIndex(currentChildIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentChildIndex(modules[currentModuleIndex - 1].children.length - 1);
    }
  };

  const dashboardHandPositions = [
    { top: "0.5%", right: "4%" },
    { top: "4%", left: "2%" },
    { top: "4%", left: "28%" },
    { top: "4%", left: "53%" },
    { top: "4%", right: "20%" },
    { top: "6.5%", left: "30%" },
    { top: "6.5%", right: "13%" },
    { top: "16%", right: "50%" },
    { top: "29%", left: "30%" },
    { top: "28.8%", right: "30%" },
    { top: "39%", left: "50%" },
    { top: "51.5%", left: "20%" },
    { top: "51.6%", right: "10%" },

    { top: "62.2%", left: "48%" },
    { top: "62.2%", right: "10%" },
    { top: "73.6%", left: "30%" },
    { top: "73.6%", right: "10%" },
    { top: "85.6%", right: "20%" },
  ];

  // Positions for the hand icon specific to the "Devices Inventory" module
  const devicesInventoryHandPositions = [
    { top: "15%", right: "8%" },
    { top: "20%", left: "25%" },
    { top: "20%", right: "25%" },
    { top: "43%", left: "25%" },
    { top: "43%", right: "25%" },
    { top: "65%", left: "25%" },
    { top: "65%", right: "25%" },
    { top: "79%", right: "44%" },
    { top: "57%", right: "15%" },
    { top: "48%", left: "0%" },
    { top: "-2%", right: "20%" },
    { top: "2%", right: "10%" },
  ];
  const onboardedDevicesPositions = [
    { top: "40%", left: "50%" },
    { top: "52%", left: "32%" },
    { top: "20%", right: "25%" },
    { top: "44%", left: "30%" },
    { top: "44%", right: "15%" },
    { top: "60%", left: "25%" },
    { top: "80%", right: "50%" },
    { top: "30%", left: "35%" },
    { top: "28%", right: "5%" },
    { top: "17%", left: "23%" },
    { top: "17%", right: "30%" },
    { top: "37%", left: "17%" },
    { top: "37%", right: "23%" },
    { top: "56%", left: "17%" },
    { top: "56%", right: "23%" },
    { top: "76%", left: "17%" },
    { top: "88.5%", left: "10%" },
    { top: "22%", left: "40%" },
    { top: "52%", left: "40%" },
    { top: "15%", left: "40%" },
    { top: "35%", left: "30%" },
    { top: "34.5%", left: "50%" },
    { top: "34.5%", right: "10%" },
    { top: "64%", left: "17%" },
    { top: "64%", right: "20%" },
    { top: "6%", left: "11%" },
  ];
  const reportPositions = [
    { top: "31%", left: "20%" },
    { top: "31%", left: "50%" },
    { top: "31%", right: "20%" },
    { top: "48%", left: "25%" },
    { top: "20%", right: "12%" },
    { top: "15%", left: "58%" },
    { top: "15%", left: "23%" },
    { top: "39%", left: "12%" },
  ];

  const vmCenterPositions = [
    { top: "10%", left: "20%" },
    { top: "44%", left: "13%" },
    { top: "13%", left: "30%" },
    { top: "8%", left: "19%" },
    { top: "20%", left: "25%" },
    { top: "38%", left: "13%" },
    { top: "18%", left: "30%" },
  ];

  useEffect(() => {
    const currentChildRef =
      moduleRefs.current[currentModuleIndex][currentChildIndex];
    if (currentChildRef && currentChildRef.current) {
      currentChildRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentChildIndex, currentModuleIndex]);

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "30px",
        background: theme?.palette?.main_layout?.background,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "50px",
        }}
      >
        {modules.map((module, index) => (
          <p
            style={{
              color:
                currentModuleIndex === index
                  ? theme?.palette?.main_layout?.secondary_text
                  : theme?.palette?.main_layout?.primary_text,
              cursor: "pointer",
              fontSize: "16px",
            }}
            key={index}
          >
            {module.title}
            {/* {currentModuleIndex === index && (
              <span> - {currentChild.name}</span>
            )} */}
          </p>
        ))}
      </div>

      {/* Content Section */}
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          textAlign: "center",
          height: "70vh",
          overflowY: "scroll",
          padding: "0px 50px",
        }}
      >
        {currentChild && (
          <div
            style={{
              position: "relative",
            }}
          >
            {/* <p style={{ color: "white" }}>{currentChild.name}</p> */}
            {/* <p style={{ color: "white" }}>{currentChild.description}</p> */}

            {currentChild.image && (
              <img
                src={currentChild.image}
                alt={currentChild.name}
                style={{ width: "100%" }}
              />
            )}

            {(currentModule.title === "Devices Inventory" ||
              currentModule.title === "OnBoarded Module" ||
              currentModule.title === "Reports" ||
              currentModule.title === "VCenter" ||
              currentModule.title === "Dashboard") && (
              <>
                <p
                  // ref={dashboardRefs.current[currentChildIndex]}
                  ref={
                    moduleRefs.current[currentModuleIndex][currentChildIndex]
                  }
                  style={{
                    position: "absolute",
                    background: "#0490E7",
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "13px",

                    ...(currentModule.title === "Devices Inventory"
                      ? devicesInventoryHandPositions[
                          currentChildIndex %
                            devicesInventoryHandPositions.length
                        ]
                      : currentModule.title === "OnBoarded Module"
                      ? onboardedDevicesPositions[
                          currentChildIndex % onboardedDevicesPositions.length
                        ]
                      : currentModule.title === "Reports"
                      ? reportPositions[
                          currentChildIndex % reportPositions.length
                        ]
                      : currentModule.title === "VCenter"
                      ? vmCenterPositions[
                          currentChildIndex % vmCenterPositions.length
                        ]
                      : dashboardHandPositions[
                          currentChildIndex % dashboardHandPositions.length
                        ]),
                  }}
                >
                  {currentChildIndex + 1}
                  {/* <FaHandPointDown
                  style={{ color: "orange", fontSize: "24px" }}
                /> */}
                </p>
                <div
                  style={{
                    position: "absolute",
                    backgroundColor: "rgba(43,48,57,0.4)",
                    backdropFilter: "blur(15.4px)",
                    width: "300px",
                    borderRadius: "10px",
                    padding: "10px 15px",
                    color: "white",
                    minHeight: "80px",
                    textAlign: "start",
                    fontSize: "13px",
                    zIndex: 999,
                    top:
                      currentChildIndex < 5 || currentChildIndex > 8
                        ? `calc(${
                            currentModule.title === "Devices Inventory"
                              ? devicesInventoryHandPositions[
                                  currentChildIndex %
                                    devicesInventoryHandPositions.length
                                ].top
                              : currentModule.title === "OnBoarded Module"
                              ? onboardedDevicesPositions[
                                  currentChildIndex %
                                    onboardedDevicesPositions.length
                                ].top
                              : currentModule.title === "Reports"
                              ? reportPositions[
                                  currentChildIndex % reportPositions.length
                                ].top
                              : currentModule.title === "VCenter"
                              ? vmCenterPositions[
                                  currentChildIndex % vmCenterPositions.length
                                ].top
                              : dashboardHandPositions[
                                  currentChildIndex %
                                    dashboardHandPositions.length
                                ].top
                          } + 40px)`
                        : `calc(${
                            currentModule.title === "Devices Inventory"
                              ? devicesInventoryHandPositions[
                                  currentChildIndex %
                                    devicesInventoryHandPositions.length
                                ].top
                              : currentModule.title === "OnBoarded Module"
                              ? onboardedDevicesPositions[
                                  currentChildIndex %
                                    onboardedDevicesPositions.length
                                ].top
                              : currentModule.title === "Reports"
                              ? reportPositions[
                                  currentChildIndex % reportPositions.length
                                ].top
                              : currentModule.title === "VCenter"
                              ? vmCenterPositions[
                                  currentChildIndex % vmCenterPositions.length
                                ].top
                              : dashboardHandPositions[
                                  currentChildIndex %
                                    dashboardHandPositions.length
                                ].top
                          } - 95px)`,
                    left:
                      currentModule.title === "Devices Inventory"
                        ? devicesInventoryHandPositions[
                            currentChildIndex %
                              devicesInventoryHandPositions.length
                          ].left
                        : currentModule.title === "OnBoarded Module"
                        ? onboardedDevicesPositions[
                            currentChildIndex % onboardedDevicesPositions.length
                          ].left
                        : currentModule.title === "Reports"
                        ? reportPositions[
                            currentChildIndex % reportPositions.length
                          ].left
                        : currentModule.title === "VCenter"
                        ? vmCenterPositions[
                            currentChildIndex % vmCenterPositions.length
                          ].left
                        : dashboardHandPositions[
                            currentChildIndex % dashboardHandPositions.length
                          ].left,
                    right:
                      currentModule.title === "Devices Inventory"
                        ? devicesInventoryHandPositions[
                            currentChildIndex %
                              devicesInventoryHandPositions.length
                          ].right
                        : currentModule.title === "OnBoarded Module"
                        ? onboardedDevicesPositions[
                            currentChildIndex % onboardedDevicesPositions.length
                          ].right
                        : currentModule.title === "Reports"
                        ? reportPositions[
                            currentChildIndex % reportPositions.length
                          ].right
                        : currentModule.title === "VCenter"
                        ? vmCenterPositions[
                            currentChildIndex % vmCenterPositions.length
                          ].right
                        : dashboardHandPositions[
                            currentChildIndex % dashboardHandPositions.length
                          ].right,
                  }}
                >
                  {currentChild.description}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          bottom: "0%",
          width: "100%",
        }}
      >
        <Button
          style={{
            background: "#141B26",
            color: "white",
          }}
          onClick={handlePrevious}
        >
          Previous
        </Button>
        <Button
          style={{
            background: "#141B26",
            color: "white",
          }}
          onClick={handleNext}
        >
          {currentChild.name === "last" ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default TourModule;
