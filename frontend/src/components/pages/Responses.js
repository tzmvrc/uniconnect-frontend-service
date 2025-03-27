/** @format */
import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import ResponseItem from "./ResponseItem";

const Responses = ({ forum_id, userInfo, setResponseCount }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // 🔄 Auto-refresh trigger

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axiosInstance.get(`/response/${forum_id}`);
        console.log("📥 Full API Response:", response.data);

        if (!Array.isArray(response.data)) {
          console.error("❌ Invalid response format:", response.data);
          return;
        }

        setResponses(response.data);
      } catch (error) {
        console.error("❌ Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [forum_id, refreshKey]); // 🔄 Auto-refresh when refreshKey changes

  // 🔄 Function to trigger an automatic refresh
  const autoRefreshResponses = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    // ✅ WebSocket Setup
    const socket = new WebSocket("wss://https://uniconnect-service-api.onrender.com");
    setSocket(socket);

    socket.onopen = () => {
      console.log("⚡ WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("🟢 WebSocket Message:", event.data);
      try {
        const parsedData = JSON.parse(event.data);
        console.log("🟢 Parsed WebSocket Data:", parsedData);

        if (!parsedData || !parsedData.data) {
          console.error("⚠️ Invalid WebSocket message format:", parsedData);
          return;
        }

        handleRealTimeUpdate(parsedData.data);
      } catch (error) {
        console.error("❌ Error processing WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => {
      socket.close(); // Cleanup when component unmounts
    };
  }, [forum_id]);

  const handleRealTimeUpdate = (change) => {
    console.log("🔄 Real-time update received:", change);

    if (!change || !change.operationType) {
      console.error("⚠️ Invalid change event format:", change);
      return;
    }

    const responseId =
      change.documentKey?._id || // MongoDB Change Streams
      change.fullDocument?._id; // For inserts

    if (!responseId) {
      console.error("❌ No valid _id found in change event:", change);
      return;
    }

    setResponses((prevResponses) => {
      switch (change.operationType) {
        case "insert":
          console.log("✅ New Response Inserted:", change.fullDocument);
          return [change.fullDocument, ...prevResponses];

        case "update":
          console.log("✏️ Response Updated:", change.updateDescription);
          return prevResponses.map((response) =>
            response._id === responseId
              ? { ...response, ...change.updateDescription.updatedFields }
              : response
          );

        case "delete":
          console.log("🗑️ Response Deleted:", responseId);
          return prevResponses.filter(
            (response) => response._id !== responseId
          );

        default:
          console.warn("⚠️ Unhandled change event:", change);
          return prevResponses;
      }
    });

    autoRefreshResponses(); // 🔄 Auto-refresh responses
  };

  return (
    <div className="responses-container">
      {loading ? (
        <p>Loading responses...</p>
      ) : responses.length === 0 ? (
        <p className="text-center mt-[55px] text-[14px] md:text-base">
          No comments yet. Be the first to respond!
        </p>
      ) : (
        responses.map((response) => (
          <ResponseItem
            key={response._id}
            response={response}
            userInfo={userInfo}
            setResponseCount={setResponseCount}
          />
        ))
      )}
    </div>
  );
};

export default Responses;
