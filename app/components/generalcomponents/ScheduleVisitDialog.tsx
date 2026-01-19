import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { isBefore, startOfDay } from "date-fns";
import TermsAndConditionsModal from "./TermsAndConditionsModal";

interface ScheduleVisitDialogProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  onVisitScheduled: () => void;
}

const ScheduleVisitDialog: React.FC<ScheduleVisitDialogProps> = ({
  open,
  onClose,
  propertyId,
  propertyTitle,
  onVisitScheduled,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookedCounts, setBookedCounts] = useState<Record<string, number>>({});
  const [availableSlots, setAvailableSlots] = useState<
    { date: string; times: string[]; capacity?: number }[]
  >([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Terms & Conditions state
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsData, setTermsData] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fetchingTerms, setFetchingTerms] = useState(false);

  useEffect(() => {
    if (open) {
      fetchTermsAndDates();
      setSelectedDate(null);
      setSelectedTime("");
      setError(null);
      setTermsAccepted(false);
    }
  }, [open, propertyId]);

  const fetchTermsAndDates = async () => {
    setLoading(true);
    try {
      // Fetch terms
      const termsResponse = await axios.get("/api/property/visitTerms");
      if (termsResponse.data.success && termsResponse.data.data) {
        setTermsData({
          title: termsResponse.data.data.title,
          content: termsResponse.data.data.content,
        });
        setTermsOpen(true);
      } else {
        // No terms set, proceed to date selection
        setTermsAccepted(true);
      }

      // Fetch available dates in parallel
      const datesResponse = await axios.get(
        `/api/property/visitSchedule/booked-dates/${propertyId}`,
      );
      if (datesResponse.data.success) {
        setBookedCounts(datesResponse.data.data.bookedCounts || {});
        setAvailableSlots(datesResponse.data.data.availableSlots || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load visit information");
    } finally {
      setLoading(false);
    }
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setTermsOpen(false);
  };

  const handleTermsReject = () => {
    setTermsOpen(false);
    onClose();
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());

    // Disable past dates
    if (isBefore(date, today)) {
      return true;
    }

    const dateStr = date.toISOString().split("T")[0];
    const slot = availableSlots.find((s) => s.date === dateStr);

    if (!slot) return true; // not configured

    const capacity = slot.capacity || 1;
    const booked = bookedCounts[dateStr] || 0;

    // disable if capacity reached
    if (booked >= capacity) return true;

    // allow date if there is at least one time defined
    return slot.times.length === 0;
  };

  const handleScheduleVisit = async () => {
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    if (!selectedTime) {
      setError("Please select a time");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await axios.post("/api/property/visitSchedule", {
        propertyId,
        visitDate: selectedDate.toISOString(),
        visitTime: selectedTime,
      });

      if (response.data.success) {
        onVisitScheduled();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to schedule visit");
    } finally {
      setSubmitting(false);
    }
  };

  // Show T&C modal if terms exist and not accepted yet
  if (!termsAccepted && termsOpen) {
    return (
      <>
        <TermsAndConditionsModal
          open={termsOpen}
          title={termsData?.title || "Terms and Conditions"}
          content={termsData?.content || ""}
          onAccept={handleTermsAccept}
          onReject={handleTermsReject}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Property Visit</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Property: <strong>{propertyTitle}</strong>
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: "text.secondary" }}
                >
                  Select a date for your visit. Booked dates are disabled.
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(value) => {
                      setSelectedDate(value);
                      setSelectedTime("");
                      if (!value) {
                        setAvailableTimes([]);
                        return;
                      }

                      const dateKey = value.toISOString().split("T")[0];
                      const slot = availableSlots.find(
                        (s) => s.date === dateKey,
                      );

                      if (slot) {
                        setAvailableTimes(slot.times);
                        if (slot.times.length === 1) {
                          setSelectedTime(slot.times[0]);
                        }
                      } else {
                        setAvailableTimes([]);
                      }
                    }}
                    shouldDisableDate={isDateDisabled}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
                {selectedDate && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      Selected: <strong>{selectedDate.toDateString()}</strong>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel id="visit-time-label">Time</InputLabel>
                      <Select
                        labelId="visit-time-label"
                        value={selectedTime}
                        label="Time"
                        onChange={(e) => setSelectedTime(e.target.value)}
                        disabled={availableTimes.length === 0}
                      >
                        {availableTimes.length === 0 && (
                          <MenuItem value="" disabled>
                            No time slots available
                          </MenuItem>
                        )}
                        {availableTimes.map((time) => (
                          <MenuItem key={time} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleScheduleVisit}
            variant="contained"
            disabled={!selectedDate || submitting}
          >
            {submitting ? "Scheduling..." : "Schedule Visit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ScheduleVisitDialog;
