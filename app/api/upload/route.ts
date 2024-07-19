import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (file) {
    // Check if the uploaded file is an image
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/JPG",
      "image/jpg",
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({
          error: "Invalid file type. Only image files are allowed.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a unique file name
    const ext = file.name.split(".").pop();
    // const newFileName = uuidv4() + "." + ext;
    const newFileName = "ajibest" + uuidv4() + "." + ext;

    // Set the upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create the file path
    const filePath = path.join(uploadDir, newFileName);

    // Create a write stream to save the file
    const writeStream = fs.createWriteStream(filePath);

    // Read the file stream and pipe it to the write stream
    for await (const chunk of file.stream()) {
      writeStream.write(chunk);
    }

    // Close the write stream
    writeStream.end();

    // Create the link to the uploaded file
    const link = `/uploads/${newFileName}`;

    // Return the filename and directory name to be added to the database
    return new Response(
      JSON.stringify({
        filename: newFileName,
        directory: "public/uploads",
        link,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
