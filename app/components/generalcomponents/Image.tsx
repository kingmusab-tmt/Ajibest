"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  CircularProgress,
  styled,
} from "@mui/material";

interface EditableImageProps {
  link: string;
  setLink: (link: string) => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const EditableImage: React.FC<EditableImageProps> = ({ link, setLink }) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files.length === 1) {
      const file = files[0];
      setIsUploading(true);

      const data = new FormData();
      data.set("file", file);

      try {
        const uploadPromise = fetch(`/api/newupload?filename=${file.name}`, {
          method: "POST",
          body: data,
        }).then((response) => {
          if (response.ok) {
            return response.json().then((result) => {
              setLink(result.link);
            });
          }
          throw new Error("Something went wrong");
        });

        await toast.promise(uploadPromise, {
          loading: "Uploading...",
          success: "Upload complete",
          error: "Upload error",
        });
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  const handleButtonClick = () => {
    inputFileRef.current?.click();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {link ? (
        <Card
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <CardMedia>
            <Image
              src={link}
              width={250}
              height={200}
              alt="avatar"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </CardMedia>
        </Card>
      ) : (
        <Card
          sx={{
            borderRadius: 2,
            backgroundColor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
            p: 3,
          }}
        >
          <Typography color="grey.500" variant="body1">
            No image
          </Typography>
        </Card>
      )}

      <Button
        component="label"
        variant="outlined"
        fullWidth
        onClick={handleButtonClick}
        disabled={isUploading}
        startIcon={isUploading ? <CircularProgress size={16} /> : null}
        sx={{
          borderRadius: 2,
          textTransform: "none",
        }}
      >
        {isUploading ? "Uploading..." : "Change image"}
        <VisuallyHiddenInput
          type="file"
          ref={inputFileRef}
          onChange={handleFileChange}
          accept="image/*"
        />
      </Button>
    </Box>
  );
};

export default EditableImage;
