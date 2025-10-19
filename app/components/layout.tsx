"use client";
import {
  useState,
  ReactNode,
  createContext,
  useContext,
  forwardRef,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Slide,
  Backdrop,
  Typography,
  Divider,
  Button,
  Fab,
  Zoom,
  SlideProps,
} from "@mui/material";
import {
  Close as CloseIcon,
  Calculate as CalculateIcon,
} from "@mui/icons-material";
import Calculator from "./userscomponent/calculator";

interface LayoutContextType {
  openCalculator: () => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  openCalculator: () => {},
});

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

interface LayoutProps {
  children: ReactNode;
}

// Create a custom Slide transition with upward direction
const SlideUpTransition = forwardRef(function Transition(
  props: SlideProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const openCalculator = () => {
    setIsCalculatorOpen(true);
  };

  const closeCalculator = () => {
    setIsCalculatorOpen(false);
  };

  return (
    <LayoutContext.Provider value={{ openCalculator }}>
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        {/* Calculator Modal */}
        <Dialog
          open={isCalculatorOpen}
          onClose={closeCalculator}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          TransitionComponent={SlideUpTransition}
          PaperProps={{
            elevation: 24,
            sx: {
              borderRadius: isMobile ? 0 : 2,
              background: theme.palette.background.paper,
              overflow: "hidden",
            },
          }}
        >
          {/* Header */}
          <DialogTitle
            sx={{
              py: 2,
              px: 3,
              backgroundColor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CalculateIcon />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Property Calculator
              </Typography>
            </Box>
            <IconButton edge="end" color="inherit" onClick={closeCalculator}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {/* Content */}
          <DialogContent sx={{ p: 3 }}>
            <Calculator />
          </DialogContent>

          {/* Actions */}
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={closeCalculator}
              variant="outlined"
              startIcon={<CloseIcon />}
            >
              Close Calculator
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Zoom in={!isCalculatorOpen}>
          <Fab
            color="primary"
            aria-label="calculator"
            onClick={openCalculator}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: theme.zIndex.speedDial,
            }}
          >
            <CalculateIcon />
          </Fab>
        </Zoom>

        {/* Main Content */}
        {children}
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
