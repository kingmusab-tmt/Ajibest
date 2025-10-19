"use client";
import { useState } from "react";
import {
  Box,
  Paper,
  Button,
  ButtonGroup,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import AdminFAQEditor from "@/app/admin/manageWebContent/AdminFAQEditor";
import AdminHeroEditor from "@/app/admin/manageWebContent/hero-content";
import StatsAdminPanel from "@/app/admin/manageWebContent/StatsAdminPanel";

type Section = "Update FAQ" | "Update Hero Content" | "Update Stats";

const ManageWebContent: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>("Update FAQ");
  const theme = useTheme();

  const renderSection = () => {
    switch (currentSection) {
      case "Update FAQ":
        return <AdminFAQEditor />;
      case "Update Hero Content":
        return <AdminHeroEditor />;
      case "Update Stats":
        return <StatsAdminPanel />;
      default:
        return null;
    }
  };

  const sections: Section[] = [
    "Update FAQ",
    "Update Hero Content",
    "Update Stats",
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          backgroundColor: "background.paper",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 2,
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            backgroundImage: "none",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Toolbar sx={{ minHeight: "64px!important", px: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                color: "text.primary",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Manage Web Content
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <ButtonGroup
            variant="outlined"
            aria-label="Manage web content sections"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 0 },
              "& .MuiButton-root": {
                flex: 1,
                textTransform: "none",
                fontWeight: 500,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                py: 1.5,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: "text.secondary",
                "&:not(:first-of-type)": {
                  borderLeftColor: alpha(theme.palette.primary.main, 0.3),
                  ml: { xs: 0, sm: -1 },
                },
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              },
            }}
          >
            {sections.map((section) => (
              <Button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={currentSection === section ? "Mui-selected" : ""}
                sx={{
                  backgroundColor:
                    currentSection === section ? "primary.main" : "transparent",
                  color:
                    currentSection === section
                      ? "primary.contrastText"
                      : "text.secondary",
                  "&:hover": {
                    backgroundColor:
                      currentSection === section
                        ? "primary.dark"
                        : alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                {section}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Paper>

      <Box
        sx={{
          transition: "opastate 300ms ease-in-out",
          minHeight: 400,
        }}
      >
        {renderSection()}
      </Box>
    </Box>
  );
};

export default ManageWebContent;
