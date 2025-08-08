import { message, Spin } from "antd";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { TbMessageChatbot } from "react-icons/tb";
import { FaHandsClapping } from "react-icons/fa6";
import { MdOutlineMessage } from "react-icons/md";
import { IoHelpCircleOutline } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import Messages from "./messages";
const Chatbot = () => {
  const theme = useTheme();

  const [showChatbot, setShowChatbot] = useState(false);
  const [state, setState] = useState("home");
  const [loading, setLoading] = useState(false);
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  useEffect(() => {
    if (state === "message") {
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // 1 second delay

      // Cleanup the timer when the component unmounts or the effect re-runs
      return () => clearTimeout(timer);
    }
  }, [state]);
  return (
    <div>
      {/* Fixed AI button */}
      <button
        onClick={toggleChatbot}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: theme?.palette?.chat_bot?.icon_bg,
          color: "white",
          borderRadius: "100%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {!showChatbot ? (
          <TbMessageChatbot style={{ color: "white", fontSize: "22px" }} />
        ) : (
          <FaChevronDown style={{ color: "white", fontSize: "22px" }} />
        )}
      </button>

      {/* Modal or chatbot iframe */}
      {showChatbot && (
        <div
          style={{
            position: "fixed",
            bottom: "-90px",
            right: "2%",
            transform: "translate(2%, -30%)",
            width: "400px",
            maxWidth: "500px",
            height: "580px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            // padding: "10px",
          }}
        >
          <div style={{ position: "relative", height: "100%" }}>
            {/* Chatbot iframe */}
            {state == "home" ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(to bottom, ${theme?.palette?.chat_bot?.background?.from_top}, ${theme?.palette?.chat_bot?.background?.to_bottom})`,
                  borderRadius: "10px",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "24px",
                    margin: "0px",
                    color: "white",
                    textAlign: "center",
                    paddingTop: "20px",
                    letterSpacing: "1px",
                  }}
                >
                  <span style={{ fontSize: "20px" }}> Datacenter</span> <br />{" "}
                  Sustainability
                </p>

                <div
                  style={{
                    padding: "80px 20px 20px 20px",
                    width: "90%",
                    margin: "0 auto",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "24px",
                      margin: "0px",
                      marginBottom: "10px",
                      color: "white",
                    }}
                  >
                    Hi <FaHandsClapping />
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "24px",
                      margin: "0px",
                      color: "white",
                    }}
                  >
                    How can we help?
                  </p>
                </div>
                <div
                  style={{
                    background: "white",
                    borderRadius: "10px",
                    padding: "10px",
                    width: "86%",
                    margin: "0 auto",
                    cursor: "pointer",
                  }}
                  onClick={() => setState("message")}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      margin: "0px",
                      marginBottom: "10px",
                    }}
                  >
                    Ask a Question
                  </p>
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: "14px",
                      margin: "0px",
                      color: "gray",
                    }}
                  >
                    Ask anything about{" "}
                    <strong>Datacenter Sustainability!</strong>
                  </p>
                </div>
              </div>
            ) : state == "message" ? (
              <div style={{ height: "100%", position: "relative" }}>
                <Spin
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  spinning={loading}
                ></Spin>

                {/* <iframe
                  src="https://www.chatbase.co/chatbot-iframe/AWJbw5CONnorVJtF0JYIK"
                  width="100%"
                  height="97.5%"
                  style={{
                    border: "none",
                    background: "white",
                    borderRadius: "10px",
                  }}
                  title="Chatbot"
                /> */}
                <Messages />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(to bottom, ${theme?.palette?.chat_bot?.background?.from_top}, ${theme?.palette?.chat_bot?.background?.to_bottom})`,

                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    padding: "5px 10px 10px 10px",
                    width: "90%",
                    margin: "0 auto",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      color: "white",
                      fontWeight: "bold",
                      marginBottom: "30px",
                      letterSpacing: "1px",
                    }}
                  >
                    Help
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "24px",
                      margin: "0px",
                      marginBottom: "10px",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Coming soon...
                  </p>
                </div>
              </div>
            )}
            <div
              style={{
                background: theme?.palette?.chat_bot?.background?.from_top,
                color: "white",
                width: "100%",
                position: "absolute",
                bottom: 0,
                height: "10%",
                display: "flex",
                justifyContent: "space-around",
                borderRadius: "0 0 8px 8px",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  paddingTop: "9px",
                }}
                onClick={() => setState("home")}
              >
                <FaHome />
                <p style={{ margin: "0 5px", fontSize: "14px" }}>Home</p>
              </div>
              <div
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  paddingTop: "9px",
                }}
                onClick={() => setState("message")}
              >
                <MdOutlineMessage />
                <p style={{ margin: "0 5px", fontSize: "14px" }}>Messages</p>
              </div>

              <div
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  paddingTop: "9px",
                }}
                onClick={() => setState("help")}
              >
                <IoHelpCircleOutline style={{ fontSize: "18px" }} />
                <p style={{ margin: "-1.5px 5px 0 5px", fontSize: "14px" }}>
                  Help
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background overlay when chatbot is open */}
      {showChatbot && (
        <div
          onClick={toggleChatbot}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default Chatbot;
