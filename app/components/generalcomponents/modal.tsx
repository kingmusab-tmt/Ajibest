"use client";
import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import {
  Modal as MuiModal,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
  showCloseButton?: boolean;
  animation?: "fade" | "slide";
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = "sm",
  fullScreen = false,
  showCloseButton = true,
  animation = "fade",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted) {
    return null;
  }

  const modalContent = (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: fullScreen ? "flex-start" : "center",
        justifyContent: "center",
        p: isMobile ? 1 : 2,
      }}
      closeAfterTransition
    >
      <Fade in={isOpen} timeout={300}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: fullScreen
              ? "100%"
              : {
                  xs: "100%",
                  sm:
                    maxWidth === "xs"
                      ? 400
                      : maxWidth === "sm"
                      ? 500
                      : maxWidth === "md"
                      ? 600
                      : maxWidth === "lg"
                      ? 800
                      : 1200,
                },
            height: fullScreen ? "100vh" : "auto",
            maxHeight: fullScreen ? "100vh" : "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: fullScreen ? 0 : 2,
            boxShadow: fullScreen ? "none" : 24,
            p: 0,
            m: fullScreen ? 0 : 2,
          }}
        >
          {/* Close Button */}
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                zIndex: 1,
                color: "text.secondary",
                backgroundColor: "background.paper",
                "&:hover": {
                  color: "text.primary",
                  backgroundColor: "action.hover",
                },
                boxShadow: 1,
              }}
              size={isMobile ? "small" : "medium"}
            >
              <CloseIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          )}

          {/* Content */}
          <Box
            sx={{
              p: fullScreen ? 3 : 3,
              pt: fullScreen && showCloseButton ? 7 : fullScreen ? 3 : 3,
              height: fullScreen ? "100%" : "auto",
              overflow: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Fade>
    </MuiModal>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
