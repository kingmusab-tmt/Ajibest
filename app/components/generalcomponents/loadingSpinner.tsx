"use client";
import React from "react";
import { Box, keyframes } from "@mui/material";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinSlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const zoomInOut = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const LoadingSpinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
        backdropFilter: "blur(10px)", // Background blur effect
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 200, // Increased size
          height: 200, // Increased size
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Blue Spinner */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            border: "6px solid", // Thicker border
            borderColor: "primary.main",
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderRadius: "50%",
            animation: `${spin} 1s linear infinite`,
          }}
        />

        {/* Red Spinner */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            border: "6px solid", // Thicker border
            borderColor: "error.main", // Red color from theme
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderRadius: "50%",
            animation: `${spinSlow} 2s linear infinite`,
          }}
        />

        {/* Company Logo with Zoom Animation */}
        <Box
          component="img"
          src="/ajibestlogo.png" // Replace with your actual logo path
          alt="Company Logo"
          sx={{
            width: 130, // Larger logo
            height: 130, // Larger logo
            objectFit: "contain",
            zIndex: 1,
            animation: `${zoomInOut} 2s ease-in-out infinite`,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))", // Subtle shadow for depth
          }}
        />
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
