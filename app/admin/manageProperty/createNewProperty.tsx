"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditableImage from "../../components/generalcomponents/Image";
import MessageModal from "../../components/generalcomponents/messageModal";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.divider}`,
}));

interface PropertyState {
  title: string;
  description: string;
  location: string;
  image: string;
  propertyType: string;
  price: string;
  listingPurpose: string;
  bedrooms: string;
  rentalDuration: string;
  bathrooms: string;
  amenities: string;
  plotNumber: string;
  utilities: string;
  purchased: boolean;
  rented: boolean;
  instamentAllowed: boolean;
  size: string;
}

const NewProperty = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState({
    createAnother: false,
    exit: false,
  });

  const router = useRouter();
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [property, setProperty] = useState<PropertyState>({
    title: "",
    description: "",
    location: "",
    image: "",
    propertyType: "",
    price: "",
    listingPurpose: "",
    bedrooms: "",
    rentalDuration: "",
    bathrooms: "",
    amenities: "",
    plotNumber: "",
    utilities: "",
    purchased: false,
    rented: false,
    instamentAllowed: true,
    size: "",
  });
  const [changedFields, setChangedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, { message: string }>>({});

  const handleSuccess = (title: string, message: string) => {
    setModalType("success");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleError = (title: string, message: string) => {
    setModalType("error");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const setErrorWithTimeout = (errorMessages: any) => {
    setErrors(errorMessages);
    setTimeout(() => {
      setErrors({});
    }, 5000);
  };

  // Handle input changes for TextField components
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProperty((prevProperty) => ({
      ...prevProperty,
      [name]: type === "checkbox" ? checked : value,
    }));
    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
  };

  // Handle select changes for Select components
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setProperty((prevProperty) => ({
      ...prevProperty,
      [name as string]: value,
    }));
    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name as string]: true,
    }));
  };

  const handleImageChange = (newImage: string) => {
    setImage(newImage);
    setImageChanged(true);
  };

  const resetForm = () => {
    setProperty({
      title: "",
      description: "",
      location: "",
      image: "",
      propertyType: "",
      price: "",
      listingPurpose: "",
      bedrooms: "",
      rentalDuration: "",
      bathrooms: "",
      amenities: "",
      plotNumber: "",
      utilities: "",
      purchased: false,
      rented: false,
      instamentAllowed: true,
      size: "",
    });
    setChangedFields({});
    setImageChanged(false);
    setImage("");
    setErrors({});
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Clear form when modal is closed after successful submission
    if (modalType === "success") {
      resetForm();
    }
  };

  const handleSave = async (action: "createAnother" | "exit") => {
    setLoading((prev) => ({ ...prev, [action]: true }));

    const createProperty: any = {};
    for (const key in property) {
      if (changedFields[key]) {
        createProperty[key] = property[key as keyof PropertyState];
      }
    }

    if (imageChanged) {
      createProperty["image"] = image;
    }

    try {
      const response = await fetch("/api/property/newproperty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store",
        },
        body: JSON.stringify(createProperty),
      });

      const data = await response.json();
      if (response.ok) {
        handleSuccess("Property Listed Successfully", "Close to Continue");
        if (action === "createAnother") {
          // Form will be cleared when modal is closed
        } else if (action === "exit") {
          // Form will be cleared when modal is closed, then redirect
          setTimeout(() => {
            router.push("/admin");
          }, 1000);
        }
      } else {
        setErrorWithTimeout(data.details?.errors || {});
      }
    } catch (error) {
      // console.log(error);
      handleError("Error", "An error occurred while saving the property");
    } finally {
      setLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  const isUrl = (str: string) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageSrc = isUrl(image) ? image : `/uploads/${image}`;

  const listPurposes = ["For Renting", "For Sale"];
  const propTypes = ["House", "Farm", "Land", "Commercial", "Office", "Shop"];
  const propSizes = ["Quarter Plot", "Half Plot", "Full Plot"];
  const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          List a New Property
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Fill in the details below to add a new property to your listings
        </Typography>
      </Box>

      <StyledPaper elevation={3}>
        {/* Image Upload Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Property Image
          </Typography>
          <Box display="flex" justifyContent="center">
            <Card sx={{ maxWidth: 200 }}>
              <CardContent>
                <EditableImage link={imageSrc} setLink={handleImageChange} />
                {errors["image"] && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors["image"].message}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Basic Information Section */}
        <Box mb={4}>
          <SectionTitle variant="h5">Basic Information</SectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Property Title"
                name="title"
                value={property.title}
                onChange={handleInputChange}
                error={!!errors["title"]}
                helperText={errors["title"]?.message}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors["propertyType"]}>
                <InputLabel>Property Type</InputLabel>
                <Select
                  name="propertyType"
                  value={property.propertyType}
                  onChange={handleSelectChange}
                  label="Property Type"
                >
                  <MenuItem value="">Select Property Type</MenuItem>
                  {propTypes.map((propType) => (
                    <MenuItem key={propType} value={propType}>
                      {propType}
                    </MenuItem>
                  ))}
                </Select>
                {errors["propertyType"] && (
                  <Typography color="error" variant="caption">
                    {errors["propertyType"].message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Property Address"
                name="location"
                value={property.location}
                onChange={handleInputChange}
                error={!!errors["location"]}
                helperText={errors["location"]?.message}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors["listingPurpose"]}>
                <InputLabel>Listing Purpose</InputLabel>
                <Select
                  name="listingPurpose"
                  value={property.listingPurpose}
                  onChange={handleSelectChange}
                  label="Listing Purpose"
                >
                  <MenuItem value="">Select Listing Purpose</MenuItem>
                  {listPurposes.map((listPurpose) => (
                    <MenuItem key={listPurpose} value={listPurpose}>
                      {listPurpose}
                    </MenuItem>
                  ))}
                </Select>
                {errors["listingPurpose"] && (
                  <Typography color="error" variant="caption">
                    {errors["listingPurpose"].message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {property.listingPurpose === "For Renting" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rental Duration"
                  name="rentalDuration"
                  value={property.rentalDuration}
                  onChange={handleInputChange}
                  error={!!errors["rentalDuration"]}
                  helperText={errors["rentalDuration"]?.message}
                  placeholder="e.g., 12 months, 6 months"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Property Description"
                name="description"
                value={property.description}
                onChange={handleInputChange}
                error={!!errors["description"]}
                helperText={errors["description"]?.message}
                required
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Pricing & Details Section */}
        <Box mb={4}>
          <SectionTitle variant="h5">Pricing & Details</SectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Property Price"
                name="price"
                value={property.price}
                onChange={handleInputChange}
                error={!!errors["price"]}
                helperText={errors["price"]?.message}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors["size"]}>
                <InputLabel>Property Size</InputLabel>
                <Select
                  name="size"
                  value={property.size}
                  onChange={handleSelectChange}
                  label="Property Size"
                >
                  <MenuItem value="">Select Property Size</MenuItem>
                  {propSizes.map((propSize) => (
                    <MenuItem key={propSize} value={propSize}>
                      {propSize}
                    </MenuItem>
                  ))}
                </Select>
                {errors["size"] && (
                  <Typography color="error" variant="caption">
                    {errors["size"].message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Property Specific Details */}
        <Box mb={4}>
          <SectionTitle variant="h5">Property Details</SectionTitle>

          <Grid container spacing={3}>
            {/* Plot Number for Land/Farm */}
            {(property.propertyType === "Land" ||
              property.propertyType === "Farm") && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Plot Number"
                  name="plotNumber"
                  value={property.plotNumber}
                  onChange={handleInputChange}
                  error={!!errors["plotNumber"]}
                  helperText={errors["plotNumber"]?.message}
                />
              </Grid>
            )}

            {/* Bedrooms and Bathrooms for House/Shop/Office */}
            {(property.propertyType === "House" ||
              property.propertyType === "Shop" ||
              property.propertyType === "Office") && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors["bedrooms"]}>
                    <InputLabel>Bedrooms</InputLabel>
                    <Select
                      name="bedrooms"
                      value={property.bedrooms}
                      onChange={handleSelectChange}
                      label="Bedrooms"
                    >
                      <MenuItem value="">Select Bedrooms</MenuItem>
                      {bedrooms.map((bedroom) => (
                        <MenuItem key={bedroom} value={bedroom.toString()}>
                          {bedroom} {bedroom === 1 ? "Bedroom" : "Bedrooms"}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["bedrooms"] && (
                      <Typography color="error" variant="caption">
                        {errors["bedrooms"].message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Bathrooms"
                    name="bathrooms"
                    value={property.bathrooms}
                    onChange={handleInputChange}
                    error={!!errors["bathrooms"]}
                    helperText={errors["bathrooms"]?.message}
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amenities"
                    name="amenities"
                    value={property.amenities}
                    onChange={handleInputChange}
                    error={!!errors["amenities"]}
                    helperText={errors["amenities"]?.message}
                    placeholder="e.g., Swimming Pool, Gym, Parking"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Utilities"
                    name="utilities"
                    value={property.utilities}
                    onChange={handleInputChange}
                    error={!!errors["utilities"]}
                    helperText={errors["utilities"]?.message}
                    placeholder="e.g., Water, Electricity, Internet"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Status Section */}
        <Box mb={4}>
          <SectionTitle variant="h5">Property Status</SectionTitle>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="purchased"
                    checked={property.purchased}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Purchased"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rented"
                    checked={property.rented}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Rented"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="instamentAllowed"
                    checked={property.instamentAllowed}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Installment Allowed"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ pt: 3, borderTop: 1, borderColor: "divider" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleSave("createAnother")}
                disabled={loading.createAnother || loading.exit}
                startIcon={
                  loading.createAnother ? <CircularProgress size={20} /> : null
                }
                sx={{ py: 1.5 }}
              >
                {loading.createAnother
                  ? "Saving..."
                  : "Save and Create Another"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => handleSave("exit")}
                disabled={loading.createAnother || loading.exit}
                startIcon={loading.exit ? <CircularProgress size={20} /> : null}
                sx={{ py: 1.5 }}
              >
                {loading.exit ? "Saving..." : "Save and Exit"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>

      {/* Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </Container>
  );
};

export default NewProperty;
