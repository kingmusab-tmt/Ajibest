"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Slider,
  useTheme,
  useMediaQuery,
  Collapse,
  IconButton,
  Drawer,
} from "@mui/material";
import { Close, ExpandMore, ExpandLess } from "@mui/icons-material";

interface FilterProps {
  onFilter?: () => void;
  isMobile?: boolean;
}

const PropertyFilters = ({ onFilter, isMobile = false }: FilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    type: true,
    purpose: true,
    price: true,
    bedrooms: false,
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    (searchParams.get("propertyType") || "").split(",").filter(Boolean),
  );
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>(
    (searchParams.get("purpose") || "").split(",").filter(Boolean),
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get("minPrice") || "0"),
    parseInt(searchParams.get("maxPrice") || "100000000"),
  ]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number[]>(
    (searchParams.get("bedrooms") || "").split(",").filter(Boolean).map(Number),
  );

  const propertyTypes = [
    "House",
    "Farm",
    "Land",
    "Commercial",
    "Office",
    "Shop",
  ];
  const purposes = [
    { label: "For Sale", value: "For Sale" },
    { label: "For Renting", value: "For Renting" },
  ];
  const bedroomOptions = [1, 2, 3, 4, 5, 6];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handlePurposeChange = (purpose: string) => {
    setSelectedPurpose((prev) =>
      prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose],
    );
  };

  const handleBedroomChange = (bed: number) => {
    setSelectedBedrooms((prev) =>
      prev.includes(bed) ? prev.filter((b) => b !== bed) : [...prev, bed],
    );
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange([newValue[0], newValue[1]]);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.append("search", searchQuery);
    if (selectedTypes.length > 0)
      params.append("propertyType", selectedTypes.join(","));
    if (selectedPurpose.length > 0)
      params.append("purpose", selectedPurpose.join(","));
    if (priceRange[0] > 0) params.append("minPrice", priceRange[0].toString());
    if (priceRange[1] < 100000000)
      params.append("maxPrice", priceRange[1].toString());
    if (selectedBedrooms.length > 0)
      params.append("bedrooms", selectedBedrooms.join(","));

    router.push(`/properties?${params.toString()}`);
    setDrawerOpen(false);
    onFilter?.();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTypes([]);
    setSelectedPurpose([]);
    setPriceRange([0, 100000000]);
    setSelectedBedrooms([]);
    router.push("/properties");
    setDrawerOpen(false);
    onFilter?.();
  };

  const filterContent = (
    <Box sx={{ p: 3 }}>
      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            cursor: "pointer",
          }}
          onClick={() => toggleSection("search")}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Search
          </Typography>
          {expandedSections.search ? <ExpandLess /> : <ExpandMore />}
        </Box>
        <Collapse in={expandedSections.search}>
          <TextField
            fullWidth
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
        </Collapse>
      </Box>

      {/* Property Type */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            cursor: "pointer",
          }}
          onClick={() => toggleSection("type")}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Property Type
          </Typography>
          {expandedSections.type ? <ExpandLess /> : <ExpandMore />}
        </Box>
        <Collapse in={expandedSections.type}>
          <Stack spacing={1}>
            {propertyTypes.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    size="small"
                  />
                }
                label={type}
              />
            ))}
          </Stack>
        </Collapse>
      </Box>

      {/* Listing Purpose */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            cursor: "pointer",
          }}
          onClick={() => toggleSection("purpose")}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Listing Purpose
          </Typography>
          {expandedSections.purpose ? <ExpandLess /> : <ExpandMore />}
        </Box>
        <Collapse in={expandedSections.purpose}>
          <Stack spacing={1}>
            {purposes.map((purpose) => (
              <FormControlLabel
                key={purpose.value}
                control={
                  <Checkbox
                    checked={selectedPurpose.includes(purpose.value)}
                    onChange={() => handlePurposeChange(purpose.value)}
                    size="small"
                  />
                }
                label={purpose.label}
              />
            ))}
          </Stack>
        </Collapse>
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            cursor: "pointer",
          }}
          onClick={() => toggleSection("price")}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Price Range
          </Typography>
          {expandedSections.price ? <ExpandLess /> : <ExpandMore />}
        </Box>
        <Collapse in={expandedSections.price}>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              min={0}
              max={100000000}
              step={100000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₦${(value / 1000000).toFixed(1)}M`}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="caption">
                ₦{(priceRange[0] / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="caption">
                ₦{(priceRange[1] / 1000000).toFixed(1)}M
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Bedrooms */}
      <Box sx={{ mb: 15 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            cursor: "pointer",
          }}
          onClick={() => toggleSection("bedrooms")}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Bedrooms
          </Typography>
          {expandedSections.bedrooms ? <ExpandLess /> : <ExpandMore />}
        </Box>
        <Collapse in={expandedSections.bedrooms}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {bedroomOptions.map((bed) => (
              <Button
                key={bed}
                variant={
                  selectedBedrooms.includes(bed) ? "contained" : "outlined"
                }
                size="small"
                onClick={() => handleBedroomChange(bed)}
                sx={{ minWidth: 50 }}
              >
                {bed}+
              </Button>
            ))}
          </Stack>
        </Collapse>
      </Box>
    </Box>
  );

  const actionButtons = (
    <Stack spacing={2}>
      <Button variant="contained" fullWidth onClick={applyFilters} size="large">
        Apply Filters
      </Button>
      <Button variant="outlined" fullWidth onClick={clearFilters} size="large">
        Clear All
      </Button>
    </Stack>
  );

  // For desktop, show as sidebar
  if (!isSmallScreen) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: 2,
          border: `1px solid`,
          borderColor: "divider",
          height: "80vh",
          position: "sticky",
          top: 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Scrollable Filter Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "3px",
              "&:hover": {
                background: "rgba(0, 0, 0, 0.4)",
              },
            },
          }}
        >
          {filterContent}
        </Box>

        {/* Fixed Action Buttons */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid`,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          {actionButtons}
        </Box>
      </Paper>
    );
  }

  // For mobile, show as drawer
  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => setDrawerOpen(true)}
        sx={{ mb: 2 }}
      >
        🔍 Filters
      </Button>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 300,
            p: 2,
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 10,
            }}
          >
            <Close />
          </IconButton>

          {/* Scrollable Content */}
          <Box
            sx={{
              mt: 4,
              flex: 1,
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "3px",
                "&:hover": {
                  background: "rgba(0, 0, 0, 0.4)",
                },
              },
            }}
          >
            {filterContent}
          </Box>

          {/* Fixed Action Buttons */}
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px solid`,
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            {actionButtons}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default PropertyFilters;
