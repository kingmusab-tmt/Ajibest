"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import { EventNote } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Visit {
  _id: string;
  propertyId: {
    _id: string;
    title: string;
    location: string;
    image: string;
    price: number;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  visitDate: string;
  visitTime?: string;
  status: "scheduled" | "completed" | "cancelled" | "released";
  createdAt: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const PropertyRequestsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [newStatus, setNewStatus] = useState<string>("completed");
  const [updating, setUpdating] = useState(false);

  // Availability state
  const [availableSlotsOpen, setAvailableSlotsOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<
    { date: string; times: string[]; capacity?: number }[]
  >([]);
  const [slotDate, setSlotDate] = useState<string>("");
  const [slotTime, setSlotTime] = useState<string>("");
  const [slotCapacity, setSlotCapacity] = useState<number>(5);
  const [rangeStart, setRangeStart] = useState<string>("");
  const [rangeEnd, setRangeEnd] = useState<string>("");
  const [availableTimeStrings, setAvailableTimeStrings] = useState<string[]>(
    [],
  );
  const [timeRangeStart, setTimeRangeStart] = useState<string>("08:00");
  const [timeRangeEnd, setTimeRangeEnd] = useState<string>("17:00");
  const [savingSlots, setSavingSlots] = useState(false);

  // Terms & Conditions state
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [termsTitle, setTermsTitle] = useState<string>(
    "Property Visit Terms and Conditions",
  );
  const [termsContent, setTermsContent] = useState<string>("");
  const [existingTerms, setExistingTerms] = useState<any>(null);
  const [savingTerms, setSavingTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/login");
      return;
    }

    fetchVisits();
  }, [status, session]);

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/admin/propertyVisits");
      if (response.data.success) {
        setVisits(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching visits:", err);
      setError("Failed to load property visits");
    } finally {
      setLoading(false);
    }
  };

  const getVisitsByStatus = (status: string) => {
    return visits.filter((v) => v.status === status);
  };

  const handleStatusUpdate = async () => {
    if (!selectedVisit) return;

    setUpdating(true);
    try {
      const response = await axios.patch(
        `/api/admin/propertyVisits/${selectedVisit._id}`,
        { status: newStatus },
      );

      if (response.data.success) {
        setVisits(
          visits.map((v) =>
            v._id === selectedVisit._id
              ? { ...v, status: newStatus as any }
              : v,
          ),
        );
        setStatusDialogOpen(false);
      }
    } catch (err) {
      console.error("Error updating visit:", err);
      setError("Failed to update visit status");
    } finally {
      setUpdating(false);
    }
  };

  const scheduledVisits = getVisitsByStatus("scheduled");
  const completedVisits = getVisitsByStatus("completed");
  const releasedVisits = getVisitsByStatus("released");

  const openAvailabilityDialog = async () => {
    try {
      setAvailableSlotsOpen(true);
      setSavingSlots(false);
      setSlotDate("");
      setSlotTime("");
      setRangeStart("");
      setRangeEnd("");
      setSlotCapacity(5);
      setAvailableTimeStrings([]);
      setTimeRangeStart("08:00");
      setTimeRangeEnd("17:00");
      const response = await axios.get(`/api/admin/visitAvailability`);
      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots || []);
      }
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError("Failed to load availability");
    }
  };

  const generateTimeRange = () => {
    if (!timeRangeStart || !timeRangeEnd) return;
    const [startH, startM] = timeRangeStart.split(":").map(Number);
    const [endH, endM] = timeRangeEnd.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    if (startMinutes >= endMinutes) return;

    const times: string[] = [];
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
    setAvailableTimeStrings(times);
  };

  const addTimeSlot = () => {
    if (!slotDate || !slotTime) return;
    setAvailableSlots((prev) => {
      const existing = prev.find((s) => s.date === slotDate);
      if (existing) {
        if (existing.times.includes(slotTime)) return prev;
        return prev.map((s) =>
          s.date === slotDate
            ? {
                ...s,
                times: [...s.times, slotTime],
                capacity: s.capacity || slotCapacity,
              }
            : s,
        );
      }
      return [
        ...prev,
        { date: slotDate, times: [slotTime], capacity: slotCapacity || 1 },
      ];
    });
    setSlotTime("");
  };

  const addRangeWithTimes = () => {
    if (!rangeStart || !rangeEnd || availableTimeStrings.length === 0) return;
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return;

    const dates: string[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      dates.push(cursor.toISOString().split("T")[0]);
      cursor.setDate(cursor.getDate() + 1);
    }

    setAvailableSlots((prev) => {
      const map = new Map(prev.map((s) => [s.date, s]));
      dates.forEach((d) => {
        const existing = map.get(d);
        if (existing) {
          const mergedTimes = Array.from(
            new Set([...existing.times, ...availableTimeStrings]),
          );
          map.set(d, {
            ...existing,
            times: mergedTimes,
            capacity: existing.capacity || slotCapacity,
          });
        } else {
          map.set(d, {
            date: d,
            times: [...availableTimeStrings],
            capacity: slotCapacity || 1,
          });
        }
      });
      return Array.from(map.values());
    });
  };

  const removeTimeSlot = (date: string, time: string) => {
    setAvailableSlots((prev) =>
      prev
        .map((slot) =>
          slot.date === date
            ? { ...slot, times: slot.times.filter((t) => t !== time) }
            : slot,
        )
        .filter((slot) => slot.times.length > 0),
    );
  };

  const saveAvailability = async () => {
    setSavingSlots(true);
    setError(null);
    try {
      const response = await axios.post(`/api/admin/visitAvailability`, {
        availableSlots,
      });
      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots || availableSlots);
        setAvailableSlotsOpen(false);
      }
    } catch (err) {
      console.error("Error saving availability:", err);
      setError("Failed to save availability");
    } finally {
      setSavingSlots(false);
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await axios.get("/api/admin/visitTerms");
      if (response.data.success && response.data.data) {
        setExistingTerms(response.data.data);
        setTermsTitle(response.data.data.title);
        setTermsContent(response.data.data.content);
      } else {
        setExistingTerms(null);
        setTermsTitle("Property Visit Terms and Conditions");
        setTermsContent("");
      }
      setTermsError(null);
    } catch (err) {
      console.error("Error fetching terms:", err);
      setTermsError("Failed to load terms");
    }
  };

  const openTermsDialog = async () => {
    await fetchTerms();
    setTermsDialogOpen(true);
  };

  const saveTerms = async () => {
    if (!termsContent.trim()) {
      setTermsError("Terms content cannot be empty");
      return;
    }

    setSavingTerms(true);
    setTermsError(null);
    try {
      const response = await axios.post("/api/admin/visitTerms", {
        title: termsTitle,
        content: termsContent,
      });
      if (response.data.success) {
        setExistingTerms(response.data.data);
        setTermsDialogOpen(false);
      }
    } catch (err: any) {
      console.error("Error saving terms:", err);
      setTermsError(err.response?.data?.message || "Failed to save terms");
    } finally {
      setSavingTerms(false);
    }
  };

  const deleteTerms = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete the terms and conditions? Users will no longer need to accept them to schedule visits.",
      )
    ) {
      return;
    }

    setSavingTerms(true);
    setTermsError(null);
    try {
      const response = await axios.delete("/api/admin/visitTerms");
      if (response.data.success) {
        setExistingTerms(null);
        setTermsTitle("Property Visit Terms and Conditions");
        setTermsContent("");
        setTermsDialogOpen(false);
      }
    } catch (err: any) {
      console.error("Error deleting terms:", err);
      setTermsError(err.response?.data?.message || "Failed to delete terms");
    } finally {
      setSavingTerms(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          <EventNote sx={{ mr: 1, verticalAlign: "middle" }} />
          Property Visit Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage scheduled property visits and available visit dates
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Global Visit Availability
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set available dates and times for property visits. These will apply to
          all properties that are available, not rented, and not purchased.
        </Typography>
        <Button variant="contained" onClick={() => openAvailabilityDialog()}>
          Manage Available Dates & Times
        </Button>
      </Paper>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Visit Terms & Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {existingTerms
            ? "Users must accept these terms before scheduling a visit."
            : "No terms set. Users can schedule visits directly."}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={openTermsDialog}>
            {existingTerms ? "Edit Terms" : "Add Terms"}
          </Button>
          {existingTerms && (
            <Button variant="outlined" color="error" onClick={deleteTerms}>
              Delete Terms
            </Button>
          )}
        </Stack>
      </Paper>

      <Paper>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label={`Scheduled (${scheduledVisits.length})`} />
          <Tab label={`Completed (${completedVisits.length})`} />
          <Tab label={`Released (${releasedVisits.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Property</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Visit Date/Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduledVisits.map((visit) => (
                  <TableRow key={visit._id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {visit.propertyId.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {visit.propertyId.location}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.3}>
                        <Typography variant="body2">
                          {visit.userId.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {visit.userId.email}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {new Date(visit.visitDate).toLocaleDateString()}
                      {visit.visitTime ? ` at ${visit.visitTime}` : ""}
                    </TableCell>
                    <TableCell>
                      <Chip label={visit.status} color="warning" size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedVisit(visit);
                          setNewStatus("completed");
                          setStatusDialogOpen(true);
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {scheduledVisits.length === 0 && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                No scheduled visits
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Property</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Visit Date/Time</TableCell>
                  <TableCell>Completed Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedVisits.map((visit) => (
                  <TableRow key={visit._id} hover>
                    <TableCell>{visit.propertyId.title}</TableCell>
                    <TableCell>{visit.userId.name}</TableCell>
                    <TableCell>
                      {new Date(visit.visitDate).toLocaleDateString()}
                      {visit.visitTime ? ` at ${visit.visitTime}` : ""}
                    </TableCell>
                    <TableCell>
                      {new Date(visit.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip label={visit.status} color="success" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {completedVisits.length === 0 && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                No completed visits
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Property</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Visit Date/Time</TableCell>
                  <TableCell>Released Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {releasedVisits.map((visit) => (
                  <TableRow key={visit._id} hover>
                    <TableCell>{visit.propertyId.title}</TableCell>
                    <TableCell>{visit.userId.name}</TableCell>
                    <TableCell>
                      {new Date(visit.visitDate).toLocaleDateString()}
                      {visit.visitTime ? ` at ${visit.visitTime}` : ""}
                    </TableCell>
                    <TableCell>
                      {new Date(visit.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip label={visit.status} color="info" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {releasedVisits.length === 0 && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">No released visits</Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update Visit Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="released">Released</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Availability Dialog */}
      <Dialog
        open={availableSlotsOpen}
        onClose={() => setAvailableSlotsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Manage Global Visit Availability</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Alert severity="info">
              Set available dates and times for property visits. These apply to
              all properties that are available, not rented, and not purchased.
            </Alert>

            {/* Capacity Setting */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                1. Set Visitor Capacity Per Day
              </Typography>
              <TextField
                label="Maximum visitors per day"
                type="number"
                value={slotCapacity}
                onChange={(e) => setSlotCapacity(Number(e.target.value) || 1)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
                size="small"
              />
            </Box>

            {/* Time Range Generator */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                2. Generate Available Times (Optional)
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                Generate hourly time slots (e.g., 8am-5pm creates 8:00, 9:00,
                10:00... 17:00)
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="From (e.g., 8:00)"
                  type="time"
                  value={timeRangeStart}
                  onChange={(e) => setTimeRangeStart(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="To (e.g., 17:00)"
                  type="time"
                  value={timeRangeEnd}
                  onChange={(e) => setTimeRangeEnd(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={generateTimeRange}
                  sx={{ minWidth: 120 }}
                >
                  Generate
                </Button>
              </Stack>
            </Box>

            {/* Manual Time Entry */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                3. Or Enter Custom Times Manually
              </Typography>
              <TextField
                label="Available times (comma-separated, e.g., 09:00, 12:00, 16:00)"
                value={availableTimeStrings.join(", ")}
                onChange={(e) =>
                  setAvailableTimeStrings(
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
                fullWidth
                size="small"
                multiline
                rows={2}
                helperText="Times will be used for date ranges below. Format: HH:MM (24-hour)"
              />
            </Box>

            {/* Date Range Add */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                4. Add Date Range
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                Add all the times above to every date in this range (e.g., Jan 1
                - Apr 30, 2026)
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={addRangeWithTimes}
                  disabled={
                    !rangeStart ||
                    !rangeEnd ||
                    availableTimeStrings.length === 0
                  }
                  sx={{ minWidth: 140 }}
                >
                  Add Range
                </Button>
              </Stack>
            </Box>

            {/* Single Date/Time Add */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                5. Or Add Single Date/Time
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                Add a specific time to a specific date (e.g., April 5th at
                9:00am only)
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Date"
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Time"
                  type="time"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={addTimeSlot}
                  disabled={!slotDate || !slotTime}
                  sx={{ minWidth: 120 }}
                >
                  Add Slot
                </Button>
              </Stack>
            </Box>

            {/* Current Availability List */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Current Available Dates & Times
              </Typography>
              {availableSlots.length === 0 && (
                <Alert severity="warning">
                  No availability set. Users won't be able to schedule visits
                  until you add available dates and times.
                </Alert>
              )}

              {availableSlots.map((slot) => (
                <Box
                  key={slot.date}
                  sx={{
                    border: "1px solid #eee",
                    p: 1.5,
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {new Date(slot.date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}{" "}
                    <Chip
                      label={`Capacity: ${slot.capacity || 1}`}
                      size="small"
                      color="primary"
                    />
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {slot.times.map((time) => (
                      <Chip
                        key={`${slot.date}-${time}`}
                        label={time}
                        onDelete={() => removeTimeSlot(slot.date, time)}
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvailableSlotsOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={saveAvailability}
            disabled={savingSlots}
          >
            {savingSlots ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Terms and Conditions Dialog */}
      <Dialog
        open={termsDialogOpen}
        onClose={() => setTermsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Manage Visit Terms & Conditions</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            {termsError && <Alert severity="error">{termsError}</Alert>}

            <TextField
              label="Title"
              value={termsTitle}
              onChange={(e) => setTermsTitle(e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              label="Terms and Conditions Content"
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              fullWidth
              multiline
              rows={10}
              placeholder="Enter your terms and conditions here. Users will need to scroll through and accept these terms before scheduling a visit."
              helperText="Write clear and comprehensive terms for property visits"
            />

            {existingTerms && (
              <Alert severity="info">
                Current version: {existingTerms.version}. Updating will
                increment the version number.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={saveTerms}
            disabled={savingTerms || !termsContent.trim()}
          >
            {savingTerms ? "Saving..." : existingTerms ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PropertyRequestsPage;
