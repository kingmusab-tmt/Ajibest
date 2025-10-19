"use client";

import { FC, useEffect, useState, forwardRef } from "react";
import { createPortal } from "react-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  alpha,
  Slide,
  Avatar,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

const MessageModal: FC<MessageModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircleIcon />,
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1),
        };
      case "error":
        return {
          icon: <ErrorIcon />,
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
        };
      case "info":
        return {
          icon: <InfoIcon />,
          color: theme.palette.info.main,
          bgColor: alpha(theme.palette.info.main, 0.1),
        };
      case "warning":
        return {
          icon: <WarningIcon />,
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1),
        };
      default:
        return {
          icon: <InfoIcon />,
          color: theme.palette.primary.main,
          bgColor: alpha(theme.palette.primary.main, 0.1),
        };
    }
  };

  const typeConfig = getTypeConfig();

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          boxShadow: theme.shadows[8],
          backgroundImage: "none",
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center", padding: theme.spacing(4) }}>
        <Avatar
          sx={{
            backgroundColor: typeConfig.bgColor,
            color: typeConfig.color,
            width: 64,
            height: 64,
            margin: "0 auto 16px",
          }}
        >
          {typeConfig.icon}
        </Avatar>

        <DialogTitle
          sx={{
            padding: 0,
            marginBottom: 2,
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: "1.5rem",
          }}
        >
          {title}
        </DialogTitle>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
            marginBottom: 3,
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ padding: theme.spacing(0, 3, 3, 3) }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: typeConfig.color,
            color: theme.palette.getContrastText(typeConfig.color),
            "&:hover": {
              backgroundColor: typeConfig.color,
              filter: "brightness(0.9)",
            },
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
            padding: theme.spacing(1, 4),
            minWidth: 120,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>,
    document.body
  );
};

export default MessageModal;
