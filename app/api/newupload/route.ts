import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    const data = await request.formData();
    const file = data.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
      "image/JPG",
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Only image files are allowed.`,
        },
        { status: 400 }
      );
    }

    const ext = filename.split(".").pop();
    const newFileName = `ajibest${uuidv4()}.${ext}`;

    const blob = await put(newFileName, file.stream(), {
      access: "public",
    });

    return NextResponse.json(
      {
        filename: newFileName,
        link: blob.url,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("File upload error:", err);

    return NextResponse.json(
      {
        error: "File upload failed",
        message: err.message || "Unknown error occurred",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}
