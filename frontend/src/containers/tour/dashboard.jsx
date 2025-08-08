import React from "react";
import eerGraph from "../../resources/images/eer-graph.png";
import { Col, Row } from "antd";
const Dashboard = () => {
  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <div>
        This is your dashboard, let's explain in detail each and everything
      </div>

      <Row gutter={[10, 10]}>
        <Col lg={12}>
          <img style={{ width: "100%" }} src={eerGraph} alt="" />
          <div>
            <p>
              The Energy Efficiency Ratio (EER) is a key measure used to assess
              how efficiently data center equipment uses energy. It is
              calculated by dividing the power output by the power input.
              Essentially, the EER tells us how well the equipment converts
              electrical power into useful work. A higher EER means the
              equipment is more efficient, wasting less energy and performing
              better.
            </p>
            <p>EER= PowerOuput /PowerInput</p>
            <p>
              Description: Calculates the EER by dividing the power output with
              the power input.
            </p>
          </div>
        </Col>
        <Col lg={12}>
          <img style={{ width: "100%" }} src={eerGraph} alt="" />
          <div>Let's explain about Dashboard here</div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
