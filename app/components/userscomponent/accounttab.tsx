import { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Grid,
} from "@mui/material";
import LayoutContext from "../generalcomponents/LayoutContext";
import { Calculate as CalculateIcon } from "@mui/icons-material";

const CalculatorOnProfile = () => {
  const { openModal } = useContext(LayoutContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ p: 2 }}>
      <Card
        sx={{
          maxWidth: 400,
          mx: "auto",
          background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
          borderRadius: 3,
          border: `1px solid ${theme.palette.primary.light}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 60,
                height: 60,
                mx: "auto",
                mb: 2,
                boxShadow: 3,
              }}
            >
              <CalculateIcon sx={{ fontSize: 32 }} />
            </Avatar>

            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.dark,
              }}
            >
              Property Calculator
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 3,
                lineHeight: 1.6,
                color: theme.palette.grey[700],
              }}
            >
              Easily get your budget estimated based on your location of
              interest
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={openModal}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: 3,
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Open Calculator
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CalculatorOnProfile;
