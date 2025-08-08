// src/components/Notification.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification } from "../store/features/notificationslice";

const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 8000); // Clear notification after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification.message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)",
        width: "350px",
        background: "white",
        border: "2px solid green",
        zIndex: 999,
        // height: "70px",
        borderRadius: "6px",
        color: "green",
        textAlign: "center",
        padding: "10px",
      }}
      className={`notification ${notification.type}`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
