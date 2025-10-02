// Notifications.js
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjcsImVtYWlsIjoiZ2FtZW5vY2t0ZXN0aW5nQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoiR29vZ2xlIiwiaWF0IjoxNzU4MDA3Njc5LCJleHAiOjE3NTg2MTI0Nzl9.Fyilrtd0wUdXeOeByGiXLPcMd6afBQBuh9hw-cjOVKc";

  useEffect(() => {
    // Fetch existing notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://13.61.183.201:3002/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched notifications:", res.data);
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();

    // Connect to Socket.IO
    const socket = io("http://13.61.183.201:3002", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("notification", (notif) => {
      console.log("Received notification:", notif);
      setNotifications((prev) => [notif, ...prev]);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((notif, index) => (
            <li
              key={notif.id}
              style={
                notif.type === "friend_request_accepted"
                  ? { color: "green" }
                  : {}
              }
            >
              {index + 1}. {notif.message}{" "}
              <small>({new Date(notif.createdAt).toLocaleTimeString()})</small>
              {notif.type && <small> [Type: {notif.type}]</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
