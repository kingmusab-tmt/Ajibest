"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import EditableImage from "../../components/generalcomponents/Image";
import MessageModal from "../../components/generalcomponents/messageModal";

// Material-UI imports
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Stack,
  CircularProgress,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

interface PropertyFormProps {
  propertyId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

interface Property {
  title: string;
  description: string;
  location: string;
  image: string;
  propertyType: string;
  price: number;
  listingPurpose: string;
  bedrooms: number;
  rentalDuration: number;
  bathrooms: number;
  amenities: string;
  plotNumber: number;
  utilities: string;
  purchased: boolean;
  rented: boolean;
  size: string;
  createdAt: Date;
}

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const FormGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const UpdateProperty: React.FC<PropertyFormProps> = ({
  propertyId,
  onSuccess,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [changedFields, setChangedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [property, setProperty] = useState<Property>({
    title: "",
    description: "",
    location: "",
    image: "",
    propertyType: "House",
    price: 0,
    listingPurpose: "For Renting",
    bedrooms: 0,
    rentalDuration: 0,
    bathrooms: 0,
    amenities: "",
    plotNumber: 0,
    utilities: "",
    purchased: false,
    rented: false,
    size: "",
    createdAt: new Date(),
  });

  const handleSuccess = (title: string, message: string) => {
    setModalType("success");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
    setSubmitting(false);

    // Auto-close the modal after 2 seconds and call onSuccess
    setTimeout(() => {
      setIsModalOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };

  const handleError = (title: string, message: string) => {
    setModalType("error");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
    setSubmitting(false);
  };

  const setErrorWithTimeout = (error: any) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    setErrors({ general: errorMessage });
    setSubmitting(false);
    setTimeout(() => {
      setErrors({});
    }, 5000);
  };

  useEffect(() => {
    if (propertyId) {
      setLoading(true);
      axios
        .get(`/api/property/getsingleproperty?id=${propertyId}`)
        .then((response) => {
          setProperty(response.data.data);
          setImage(response.data.data.image);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch property", error);
          handleError("Error", "Failed to load property data");
          setLoading(false);
        });
    }
  }, [propertyId]);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const name = e.target.name as keyof Property;
    const value = e.target.value;

    if (!name) return;

    setProperty((prevProperty) => {
      // Handle different value types properly
      let processedValue: string | number | boolean = value as string;

      // Convert number fields
      if (
        name === "price" ||
        name === "rentalDuration" ||
        name === "plotNumber" ||
        name === "bedrooms"
      ) {
        processedValue = value === "" ? 0 : Number(value);
      }

      // Handle boolean fields for checkboxes
      if (name === "purchased" || name === "rented") {
        processedValue = !prevProperty[name];
      } else {
        processedValue = value as string | number;
      }

      return {
        ...prevProperty,
        [name]: processedValue,
      };
    });

    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
  };

  const handleSelectChange = (e: any) => {
    const name = e.target.name as keyof Property;
    const value = e.target.value;

    setProperty((prevProperty) => ({
      ...prevProperty,
      [name]: value,
    }));

    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Property;
    const checked = e.target.checked;

    setProperty((prevProperty) => ({
      ...prevProperty,
      [name]: checked,
    }));

    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
  };

  const handleImageChange = (newImage: string) => {
    setImage(newImage);
    setImageChanged(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const updateProperty: Partial<Property> = {};

    // Only include changed fields
    Object.keys(changedFields).forEach((key) => {
      if (changedFields[key] && key in property) {
        (updateProperty as any)[key] = property[key as keyof Property];
      }
    });

    if (imageChanged) {
      updateProperty.image = image;
    }

    // Check if anything was actually changed
    if (Object.keys(updateProperty).length === 0 && !imageChanged) {
      handleError("No Changes", "Please make some changes before updating.");
      return;
    }

    axios
      .put(
        `/api/aapi/property/updateproperty?id=${propertyId}`,
        updateProperty,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        handleSuccess(
          "Property Updated Successfully",
          "Property has been updated successfully."
        );
      })
      .catch((error) => {
        setErrorWithTimeout(error);
        handleError(
          "Update Failed",
          "Failed to update property. Please try again."
        );
        console.error("Failed to update property", error);
      });
  };

  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageSrc = isUrl(image) ? image : `/uploads/${image}`;
  const listPurposes = ["For Renting", "For Sale"];
  const propTypes = ["House", "Farm", "Land", "Office", "Shop", "Commercial"];
  const propSizes = ["Quarter Plot", "Half Plot", "Full Plot"];
  const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <StyledPaper elevation={0}>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Image Upload */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box sx={{ p: 2, borderRadius: 2, border: "1px dashed #ccc" }}>
              <EditableImage link={imageSrc} setLink={handleImageChange} />
            </Box>
          </Box>

          <FormGrid container spacing={3}>
            {/* Property Title */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Property Title"
                name="title"
                value={property.title}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {/* Property Description */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Property Description"
                name="description"
                value={property.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>

            {/* Property Address */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Property Address"
                name="location"
                value={property.location}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {/* Listing Purpose */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Listing Purpose</InputLabel>
                <Select
                  name="listingPurpose"
                  value={property.listingPurpose}
                  onChange={handleSelectChange}
                  label="Listing Purpose"
                >
                  {listPurposes.map((listPurpose) => (
                    <MenuItem key={listPurpose} value={listPurpose}>
                      {listPurpose}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Property Price */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Property Price"
                name="price"
                type="number"
                value={property.price}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {/* Property Plot Size */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Property Plot Size</InputLabel>
                <Select
                  name="size"
                  value={property.size}
                  onChange={handleSelectChange}
                  label="Property Plot Size"
                >
                  {propSizes.map((propSize) => (
                    <MenuItem key={propSize} value={propSize}>
                      {propSize}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Rent Duration */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rent Duration (months)"
                name="rentalDuration"
                type="number"
                value={property.rentalDuration}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {/* Amenities */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amenities"
                name="amenities"
                value={property.amenities}
                onChange={handleChange}
                variant="outlined"
                placeholder="Comma separated amenities"
              />
            </Grid>

            {/* Checkboxes */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="purchased"
                    checked={property.purchased}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Purchased"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="rented"
                    checked={property.rented}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Rented"
              />
            </Grid>

            {/* Property Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Property Type</InputLabel>
                <Select
                  name="propertyType"
                  value={property.propertyType}
                  onChange={handleSelectChange}
                  label="Property Type"
                >
                  {propTypes.map((propType) => (
                    <MenuItem key={propType} value={propType}>
                      {propType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Conditional Fields */}
            {(property.propertyType === "Land" ||
              property.propertyType === "Farm") && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Plot Number"
                  name="plotNumber"
                  type="number"
                  value={property.plotNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            )}

            {property.propertyType === "House" && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Number of Bedrooms</InputLabel>
                  <Select
                    name="bedrooms"
                    value={property.bedrooms}
                    onChange={handleSelectChange}
                    label="Number of Bedrooms"
                  >
                    <MenuItem value="">
                      <em>Select number of bedrooms</em>
                    </MenuItem>
                    {bedrooms.map((bedroom) => (
                      <MenuItem key={bedroom} value={bedroom}>
                        {bedroom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </FormGrid>

          {/* Action Buttons */}
          <DialogActions sx={{ mt: 3, gap: 1 }}>
            <Button onClick={onClose} variant="outlined" disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
              sx={{
                backgroundColor: "#2e7d32",
                "&:hover": {
                  backgroundColor: "#1b5e20",
                },
                minWidth: 150,
              }}
            >
              {submitting ? "Updating..." : "Update Property"}
            </Button>
          </DialogActions>
        </Box>
      </StyledPaper>

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </Box>
  );
};

export default UpdateProperty;
