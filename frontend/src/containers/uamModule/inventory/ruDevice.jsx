import React from "react";
import rudeviceImage from "../../../resources/images/device.png";
const RuDevice = () => {
  const array = [];
  const descendingArray = [];
  const limit = 30;

  for (let i = limit; i >= 1; i--) {
    array.push(i);
  }
  return (
    <>
      <div
        style={{
          border: "20px solid #2D303B",
          width: "170px",
          height: "auto",
        }}
      >
        <img
          width={"100%"}
          style={{ marginTop: "20px" }}
          src={rudeviceImage}
          alt=""
        />

        {array.map((data) => {
          return (
            <>
              <div style={{ position: "relative", height: "20px" }}>
                <p
                  style={{
                    position: "absolute",
                    left: -15,
                    bottom: 0,
                    color: "gray",
                    fontSize: "10px",
                    zIndex: 1,
                    width: "20px",
                  }}
                >
                  {data}
                </p>
                <div
                  style={{ borderBottom: "1px solid #5B5757", height: "30px" }}
                ></div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default RuDevice;
