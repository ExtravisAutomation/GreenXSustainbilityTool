import axios from "axios";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { baseUrl } from "../../utils/axios";
import styled from "styled-components";
import { CustomInput } from "../../components/customInput";
import axiosInstance from "../../utils/axios/axiosInstance";

const Messages = () => {
  const theme = useTheme();

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const access_token = localStorage.getItem("access_token");

  // Function to handle API call
  const askOpenAi = async () => {
    if (!question) return;
    setLoading(true);

    // Add user's question to chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { type: "user", text: question },
    ]);

    try {
      const res = await axiosInstance.get(
        `${baseUrl}/ai/getai?question=${encodeURIComponent(question)}`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${access_token}`,
        //   },
        // }
      );

      const aiResponse = res?.data?.data?.message || "No response from the AI.";

      // Add AI's response to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "ai", text: aiResponse },
      ]);

      // Clear input field
      setQuestion("");
    } catch (err) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "ai", text: "Failed to get a response!." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer theme={theme}>
      <ChatHeader theme={theme}>Ask anything about Datacenter</ChatHeader>
      <ChatBox theme={theme}>
        {chatHistory.map((message, index) => (
          <ChatMessage
            theme={theme}
            key={index}
            isUser={message.type === "user"}
          >
            <MessageBubble theme={theme} isUser={message.type === "user"}>
              {message.text}
            </MessageBubble>
          </ChatMessage>
        ))}
      </ChatBox>
      <InputContainer theme={theme}>
        <CustomInput
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading && question.trim()) {
              askOpenAi();
            }
          }}
        />
        <ChatButton
          theme={theme}
          onClick={askOpenAi}
          disabled={loading || !question}
        >
          {loading ? "Asking..." : "Send"}
        </ChatButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Messages;

// Styled Components
const ChatContainer = styled.div`
  background: ${({ theme }) =>
    theme?.palette?.chat_bot?.messages_bg || "#00bfa5"};
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: rgba(0, 0, 0, 0.15) !important;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 90%;
`;

const ChatHeader = styled.div`
  padding: 10px;
  background: ${({ theme }) =>
    theme?.palette?.chat_bot?.background?.from_top || "#128c7e"};
  color: white;
  text-align: center;
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ChatBox = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: ${({ theme }) =>
    theme?.palette?.chat_bot?.messages_bg || "#00bfa5"};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatMessage = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  background-color: ${({ isUser, theme }) =>
    isUser
      ? theme?.palette?.chat_bot?.user?.background
      : theme?.palette?.chat_bot?.response?.background};

  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  color: ${({ isUser, theme }) =>
    isUser
      ? theme?.palette?.chat_bot?.user?.color
      : theme?.palette?.chat_bot?.response?.color};
  border-top-left-radius: ${(props) => (props.isUser ? "10px" : "0px")};
  border-top-right-radius: ${(props) => (props.isUser ? "0px" : "10px")};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background: ${({ theme }) =>
    theme?.palette?.chat_bot?.messages_bg || "#00bfa5"};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  margin-right: 10px;
`;

const ChatButton = styled.button`
  padding: 10px 15px;
  margin-left: 10px;
  background: ${({ theme }) =>
    theme?.palette?.chat_bot?.background?.from_top || "#128c7e"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({ theme }) =>
      theme?.palette?.chat_bot?.background?.from_top};
  }
  &:disabled {
    background-color: ${({ theme }) =>
      theme?.palette?.chat_bot?.background?.from_top};
    cursor: not-allowed;
  }
`;
