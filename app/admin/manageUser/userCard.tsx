"use client";
import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Stack,
  Button,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

interface UserCardProps {
  user: {
    isActive: boolean;
    _id: string;
    name: string;
    role: string;
    address: string;
    email: string;
    phoneNumber: string;
    image: string;
  };
  onViewProfile: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

const UserCard: FC<UserCardProps> = ({
  user,
  onViewProfile,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const open = Boolean(anchorEl);

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

  const imageSrc = isUrl(user.image) ? user.image : `/uploads/${user.image}`;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(user._id);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(user._id);
    handleMenuClose();
  };

  const handleViewProfile = () => {
    onViewProfile(user._id);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "error";
      case "agent":
        return "info";
      case "user":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        minHeight: 420,
        borderRadius: 3,
        boxShadow: theme.shadows[2],
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
          borderColor: theme.palette.primary.main,
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with Menu */}
      <Box sx={{ position: "relative", p: 2, pb: 1 }}>
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(8px)",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
            <EditIcon fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ gap: 1, color: "error.main" }}>
            <DeleteIcon fontSize="small" />
            Delete
          </MenuItem>
        </Menu>

        {/* User Avatar and Basic Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Avatar
            src={imageSrc}
            alt={user.name}
            sx={{
              width: 80,
              height: 80,
              border: `3px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              mb: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>

          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              mb: 0.5,
              color: theme.palette.text.primary,
            }}
          >
            {user.name}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label={user.role}
              color={getRoleColor(user.role)}
              size="small"
              variant="outlined"
            />
            <Chip
              label={user.isActive ? "Active" : "Inactive"}
              color={user.isActive ? "success" : "default"}
              size="small"
              variant={user.isActive ? "filled" : "outlined"}
            />
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* User Details */}
      <CardContent sx={{ flexGrow: 1, p: 2, pt: 2 }}>
        <Stack spacing={2}>
          {/* Location */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <LocationIcon
              fontSize="small"
              sx={{ color: theme.palette.text.secondary, mt: 0.25 }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  display: "block",
                }}
              >
                Location
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.3,
                }}
              >
                {user.address || "Not specified"}
              </Typography>
            </Box>
          </Box>

          {/* Email */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <EmailIcon
              fontSize="small"
              sx={{ color: theme.palette.text.secondary, mt: 0.25 }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  display: "block",
                }}
              >
                Email
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  wordBreak: "break-word",
                  lineHeight: 1.3,
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>

          {/* Phone */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <PhoneIcon
              fontSize="small"
              sx={{ color: theme.palette.text.secondary, mt: 0.25 }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  display: "block",
                }}
              >
                Phone
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.3,
                }}
              >
                {user.phoneNumber || "Not provided"}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ViewIcon />}
          onClick={handleViewProfile}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          View Profile
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserCard;
