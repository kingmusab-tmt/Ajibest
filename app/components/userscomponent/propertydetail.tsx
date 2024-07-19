import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Card, CardMedia, CardContent, Box, IconButton } from "@mui/material";

interface PropertyDetailProps {
  open: boolean;
  handleClose: () => void;
  property: {
    propertyId: string;
  } | null;
}

interface Property {
  title: string;
  image: string;
  bathrooms: string;
  size: string;
  description: string;
  location: string;
  price?: number;
  listingPurpose: string;
  bedrooms: number;
  amenities: string[];
  purchased: boolean;
  rented: boolean;
  utilities: string[];
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({
  open,
  handleClose,
  property,
}) => {
  const [newproperty, setNewProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!property?.propertyId) return;

    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(
          `/api/property/getsingleproperty?id=${property.propertyId}`
        );
        const data = await response.json();
        setNewProperty(data.data);
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      }
    };

    fetchPropertyDetails();
  }, [property?.propertyId]);

  if (!property) return null;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{newproperty?.title}</DialogTitle>
      <DialogContent>
        <Card>
          <Box position="relative">
            <CardMedia
              component="img"
              height="100"
              image={`/uploads/${newproperty?.image}`}
              alt={newproperty?.title}
            />
          </Box>
          <CardContent sx={{ textAlign: "left" }}>
            <Typography variant="body2" color="text.secondary">
              Location: {newproperty?.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Description: {newproperty?.description}
            </Typography>
            {newproperty?.bedrooms && (
              <Typography variant="body2" color="text.secondary">
                Bedrooms: {newproperty?.bedrooms}
              </Typography>
            )}
            {newproperty?.bathrooms && (
              <Typography variant="body2" color="text.secondary">
                Bathrooms: {newproperty?.bathrooms}
              </Typography>
            )}
            {newproperty?.amenities && (
              <Typography variant="body2" color="text.secondary">
                Amenities: {newproperty?.amenities}
              </Typography>
            )}
            {newproperty?.utilities && (
              <Typography variant="body2" color="text.secondary">
                Utilities: {newproperty?.utilities}
              </Typography>
            )}
            {newproperty?.size && (
              <Typography variant="body2" color="text.secondary">
                Size: {newproperty?.size}
              </Typography>
            )}
            <Typography variant="h6" color="text.primary">
              Price: {formatter.format(Number(newproperty?.price))}
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyDetail;
