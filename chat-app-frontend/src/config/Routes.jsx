import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";
import ChatPage from "../components/ChatPage";

// Optional: create a separate component for 404
const NotFound = () => <h1>404 - Page Not Found</h1>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/about" element={<h1>This is the About Page</h1>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
