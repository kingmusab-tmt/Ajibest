// components/HeroSearch.tsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

interface SearchFilters {
  city: string;
  propertyType: string;
  priceRange: string;
  purpose: string;
}

const HeroSearch: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [filters, setFilters] = useState<SearchFilters>({
    city: "",
    propertyType: "",
    priceRange: "",
    purpose: "",
  });

  const handleChange =
    (field: keyof SearchFilters) => (event: SelectChangeEvent) => {
      setFilters({ ...filters, [field]: event.target.value });
    };

  const handleSearch = () => {
    // Create query string from filters
    const queryParams = new URLSearchParams();

    if (filters.city) queryParams.append("city", filters.city);
    if (filters.propertyType)
      queryParams.append("propertyType", filters.propertyType);
    if (filters.priceRange)
      queryParams.append("priceRange", filters.priceRange);
    if (filters.purpose) queryParams.append("purpose", filters.purpose);

    // Redirect to properties page with filters
    router.push(`/properties?${queryParams.toString()}`);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: "primary.light",
        borderRadius: 2,
        mt: 0,
        mb: 4,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              value={filters.city}
              label="City"
              onChange={handleChange("city")}
            >
              <MenuItem value="abia">Abia</MenuItem>
              <MenuItem value="adamawa">Adamawa</MenuItem>
              <MenuItem value="akwa ibom">Akwa Ibom</MenuItem>
              <MenuItem value="anambra">Anambra</MenuItem>
              <MenuItem value="bauchi">Bauchi</MenuItem>
              <MenuItem value="bayelsa">Bayelsa</MenuItem>
              <MenuItem value="benue">Benue</MenuItem>
              <MenuItem value="borno">Borno</MenuItem>
              <MenuItem value="cross river">Cross River</MenuItem>
              <MenuItem value="delta">Delta</MenuItem>
              <MenuItem value="ebonyi">Ebonyi</MenuItem>
              <MenuItem value="edo">Edo</MenuItem>
              <MenuItem value="ekiti">Ekiti</MenuItem>
              <MenuItem value="enugu">Enugu</MenuItem>
              <MenuItem value="gombe">Gombe</MenuItem>
              <MenuItem value="imo">Imo</MenuItem>
              <MenuItem value="jigawa">Jigawa</MenuItem>
              <MenuItem value="kaduna">Kaduna</MenuItem>
              <MenuItem value="kano">Kano</MenuItem>
              <MenuItem value="katsina">Katsina</MenuItem>
              <MenuItem value="kebbi">Kebbi</MenuItem>
              <MenuItem value="kogi">Kogi</MenuItem>
              <MenuItem value="kwara">Kwara</MenuItem>
              <MenuItem value="lagos">Lagos</MenuItem>
              <MenuItem value="nasarawa">Nasarawa</MenuItem>
              <MenuItem value="niger">Niger</MenuItem>
              <MenuItem value="ogun">Ogun</MenuItem>
              <MenuItem value="ondo">Ondo</MenuItem>
              <MenuItem value="osun">Osun</MenuItem>
              <MenuItem value="oyo">Oyo</MenuItem>
              <MenuItem value="plateau">Plateau</MenuItem>
              <MenuItem value="rivers">Rivers</MenuItem>
              <MenuItem value="sokoto">Sokoto</MenuItem>
              <MenuItem value="taraba">Taraba</MenuItem>
              <MenuItem value="yobe">Yobe</MenuItem>
              <MenuItem value="zamfara">Zamfara</MenuItem>
              <MenuItem value="fct">FCT (Abuja)</MenuItem>

              <MenuItem value="all">All States</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel id="property-type-label">Type</InputLabel>
            <Select
              labelId="property-type-label"
              value={filters.propertyType}
              label="Type"
              onChange={handleChange("propertyType")}
            >
              <MenuItem value="farm land">Farm Land</MenuItem>
              <MenuItem value="residential land">Residential Land</MenuItem>
              <MenuItem value="house for sell">House for Sale</MenuItem>
              <MenuItem value="house for rent">House for Rent</MenuItem>
              <MenuItem value="commercial property">
                Commercial Property
              </MenuItem>
              <MenuItem value="office space">Office Space</MenuItem>
              <MenuItem value="shop space">Shop Space</MenuItem>
              <MenuItem value="all">All Types</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel id="purpose-label">Purpose</InputLabel>
            <Select
              labelId="purpose-label"
              value={filters.purpose}
              label="Purpose"
              onChange={handleChange("purpose")}
            >
              <MenuItem value="sale">For Sale</MenuItem>
              <MenuItem value="rent">For Rent</MenuItem>
              <MenuItem value="all">All Purposes</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel id="price-range-label">Price Range</InputLabel>
            <Select
              labelId="price-range-label"
              value={filters.priceRange}
              label="Price Range"
              onChange={handleChange("priceRange")}
            >
              <MenuItem value="300000-500000">₦300,000 - ₦500,000</MenuItem>
              <MenuItem value="600000-1000000">₦600,000 - ₦1,000,000</MenuItem>
              <MenuItem value="1000000-1500000">₦1M - ₦1.5M</MenuItem>
              <MenuItem value="2000000-2500000">₦2M - ₦2.5M</MenuItem>
              <MenuItem value="3000000-5500000">₦3M - ₦5.5M</MenuItem>
              <MenuItem value="6000000-10000000">₦6M - ₦10M</MenuItem>
              <MenuItem value="all">All Price Ranges</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
            size="large"
            startIcon={<SearchIcon />}
            sx={{ height: isMobile ? "40px" : "56px" }}
          >
            {isMobile ? "Search" : "Find Properties"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HeroSearch;
