"use client";
import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery,
  Container,
  Fade,
  Grid,
} from "@mui/material";
import PersonalInformation from "./userprofile";
import BankAccountDetail from "./userBankdetail";
import NextOfKinDetail from "./nextOfkin";
import ChangePassword from "../generalcomponents/updatepassword";

type Section =
  | "Personal Information"
  | "Bank Account Detail"
  | "Next of Kin Detail"
  | "Change Password";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={500}>
          <Box>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

const NavigationComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentTab, setCurrentTab] = useState<number>(0);

  const sections: Section[] = [
    "Personal Information",
    "Bank Account Detail",
    "Next of Kin Detail",
    "Change Password",
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (isMobile) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTab-root": {
                  fontSize: "0.75rem",
                  py: 1.5,
                  minWidth: "auto",
                  px: 1,
                  textTransform: "none",
                  fontWeight: 600,
                },
              }}
            >
              {sections.map((section, index) => (
                <Tab key={section} label={section} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 2 }}>
            <TabPanel value={currentTab} index={0}>
              <PersonalInformation />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <BankAccountDetail />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <NextOfKinDetail />
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              <ChangePassword />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Desktop layout with sidebar tabs
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Tabs
              orientation="vertical"
              value={currentTab}
              onChange={handleTabChange}
              aria-label="Profile settings tabs"
              sx={{
                "& .MuiTab-root": {
                  alignItems: "flex-start",
                  px: 3,
                  py: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.action.selected,
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiTabs-indicator": {
                  left: 0,
                  width: 4,
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              {sections.map((section, index) => (
                <Tab key={section} label={section} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ borderRadius: 2, p: 4, minHeight: 400 }}>
            <TabPanel value={currentTab} index={0}>
              <PersonalInformation />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <BankAccountDetail />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <NextOfKinDetail />
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              <ChangePassword />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NavigationComponent;
