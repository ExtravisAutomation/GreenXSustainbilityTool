import React, { useEffect, useRef } from "react";
import BackButton from "../../components/backButton";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const About = () => {
  const theme = useTheme();
  const location = useLocation();
  const { title } = location.state || {};
  console.log("title", title);
  // const eerRef = useRef(null);

  // useEffect(() => {
  //   if (title === "ee" && eerRef.current) {
  //     eerRef.current.scrollIntoView({ behavior: "smooth" });
  //     eerRef.current.style.color = "yellow"; // Highlight with a yellow border

  //     const timer = setTimeout(() => {
  //       eerRef.current.style.color = "#C8CFDA"; // Remove highlight after 3 seconds
  //     }, 3000);

  //     // Cleanup function to clear the timer if the component unmounts
  //     return () => clearTimeout(timer);
  //   }
  // }, [title]);

  const refs = {
    ee: useRef(null),
    pcr: useRef(null),
    pue: useRef(null),
    cost: useRef(null),
    traffic: useRef(null),
    co2: useRef(null),
    interrelation: useRef(null),
  };

  useEffect(() => {
    if (title && refs[title]?.current) {
      refs[title].current.scrollIntoView({ behavior: "smooth" });
      refs[title].current.style.color = "yellow"; // Highlight with yellow color

      const timer = setTimeout(() => {
        refs[title].current.style.color = "#C8CFDA"; // Remove highlight after 3 seconds
      }, 3000);

      // Cleanup function to clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [title, refs]);
  return (
    <>
      <BackButton
        style={{ marginLeft: "20px", marginTop: "20px" }}
      ></BackButton>
      <div
        style={{
          margin: "20px",
          border: `1px solid  ${theme?.palette?.default_card?.border}`,
        }}
      >
        <div style={{ margin: "35px 10px" }}>
          <div
            style={{
              textAlign: "center",
              borderBottom: "1px solid #36424E",
              paddingBottom: "25px",
            }}
          >
            <p
              style={{
                fontSize: "24px",
                fontWeight: 500,
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              Key Metrics of Data Centre Sustainability
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                lineHeight: "20px",
              }}
            >
              In our ongoing mission to make our data center operations more
              sustainable, we rely on a set of important measurements and
              tactics. Let's <br /> explore these in simple terms, focusing on
              how we're making our operations greener while ensuring they remain
              efficient and effective.
            </p>
          </div>
          <div
            style={{
              margin: "30px 20px",
              paddingBottom: "25px",
              borderBottom: "1px solid #36424E",
            }}
          >
            <p
              ref={refs.ee}
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              Energy Efficiency Ratio (EER)
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                marginBottom: "25px",
                fontSize: "14px",
                lineHeight: "20px",
                textAlign: "justify",
              }}
            >
              The Energy Efficiency Ratio (EER) is a key measure used to assess
              how efficiently data center equipment uses energy. It is
              calculated by dividing the power output by the power input.
              Essentially, the EER tells us how well the equipment converts
              electrical power into useful work. A higher EER means the
              equipment is more efficient, wasting less energy and performing
              better.
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
              }}
            >
              EER= PowerOuput /PowerInput
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
                marginTop: "-5px",
              }}
            >
              Description: Calculates the EER by dividing the power output with
              the power input.
            </p>
          </div>
          <div
            style={{
              margin: "30px 20px",
              paddingBottom: "25px",
              borderBottom: "1px solid #36424E",
            }}
          >
            <p
              ref={refs.pcr}
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              Power Consumption Ratio (PCR)
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                marginBottom: "25px",
                fontSize: "14px",
                lineHeight: "20px",
                textAlign: "justify",
              }}
            >
              The Power Consumption Ratio (PCR) measures how efficiently power
              is used relative to the data rate of a network device
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
              }}
            >
              PCR=input_power_used / input_output_data_rate
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
                marginTop: "-5px",
              }}
            >
              Description: Calculates the PCR by dividing the "input power used"
              with the "input-output data rate".
            </p>
          </div>
          <div
            style={{
              margin: "30px 20px",
              paddingBottom: "25px",
              borderBottom: "1px solid #36424E",
            }}
          >
            <p
              ref={refs.pue}
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: theme?.palette?.main_layout?.primary_text,
                marginBottom: "25px",
              }}
            >
              Power Usage Effectiveness (PUE)
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
                marginBottom: "25px",
                lineHeight: "20px",
              }}
            >
              The Power Usage Effectiveness (PUE) measures how efficiently a
              data center uses energy. It is the ratio of total power input to
              the power used for actual computing. PUE shows how well energy is
              distributed and used. Lower PUE values mean better energy use,
              with more power going to productive work and less wasted as heat.
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
              }}
            >
              PUE= Total Power Input/ Used Power for computing
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
                marginTop: "-5px",
              }}
            >
              Description: Measures the PUE of devices by comparing the total
              power input to the power output that is utilized for operations
            </p>
          </div>
          <div
            style={{
              margin: "30px 20px",
              paddingBottom: "25px",
              borderBottom: "1px solid #36424E",
            }}
          >
            <p
              ref={refs.cost}
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              Cost Estimation Based on Power Usage
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                marginBottom: "25px",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              The economic implications of energy consumption are also paramount
              in data center management. The cost estimation formula calculates
              the cost by multiplying energy consumption by the price of
              electricity. This helps understand the financial impact of energy
              use. By using energy efficiently, data centers can save money and
              support sustainability efforts.
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
              }}
            >
              Cost Estimation: Energy consumption (E) x cost per unit of
              electricity (C)
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
                marginTop: "-5px",
              }}
            >
              Description: Estimates the cost of energy consumption where E is
              the energy consumed and C is the cost per unit of electricity.
            </p>
          </div>
          <div
            style={{
              margin: "30px 20px",
              paddingBottom: "25px",
              borderBottom: "1px solid #36424E",
            }}
          >
            <p
              ref={refs.traffic}
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              Traffic Throughput
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
                marginBottom: "25px",
                lineHeight: "20px",
              }}
            >
              The Traffic Throughput metric quantifies the efficiency of data
              transfer across network infrastructures by comparing actual data
              throughput to the total capacity of the network. <br /> Expressed
              in gigabytes (GB), this metric offers valuable insights into
              network optimization strategies, guiding the allocation of
              resources to accommodate burgeoning data traffic <br /> demands
              while minimizing latency and enhancing overall user experience.
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
              }}
            >
              Traffic Throughput=Total byte rate / 2**30
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
              }}
            >
              Description: Assesses the efficiency of data transmission across
              the network by comparing the actual data transferred to the total
              data capacity of the network.
            </p>
          </div>
          <div
            style={{
              margin: "30px 20px",
              paddingBottom: "25px",
              borderBottom: "1px solid #36424E",
            }}
          >
            <p
              ref={refs.co2}
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              CO2 Emissions
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              To calculate CO2 emissions, use real-time electricity data from
              the Electricity Map API, which provides carbon intensity
              information. Firstly, fetch the real-time carbon intensity data
              for the data center's region from Electricity Map API. Then
              Measure the electricity consumption in kilowatt-hours (kWh).
              Finally, use this data to calculate the CO2 emissions.
            </p>

            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
              }}
            >
              Co2 emissions = Carbon Intensity x total power KW
            </p>
          </div>
          <div
            ref={refs.interrelation}
            style={{
              margin: "30px 20px",
              //   paddingBottom: "25px",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
               Interrelation of PUE and EER
            </p>
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              The symbiotic relationship between PUE and EER underscores the
              interconnected nature of energy efficiency initiatives within data
              center operations. By improving the efficiency of cooling <br />
              systems (as reflected by enhancements in EER), data center
              operators can achieve lower overall PUE values, signifying
              optimized energy usage across the facility. This iterative process
              of <br /> refinement emphasizes the pivotal role of efficient
              cooling infrastructure in driving sustainable energy practices
              within data center environments, ultimately fostering resilience
              and <br /> longevity in digital infrastructure ecosystems.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
