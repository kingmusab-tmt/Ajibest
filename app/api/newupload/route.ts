import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";


export const dynamic = 'force-dynamic';
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return new NextResponse(JSON.stringify({ error: "Filename is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await request.formData();
  const file = data.get("file") as Blob;

  if (!file) {
    return new NextResponse(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
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
    return new NextResponse(
      JSON.stringify({
        error: "Invalid file type. Only image files are allowed.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const ext = filename.split(".").pop();
  const newFileName = `ajibest${uuidv4()}.${ext}`;

  const blob = await put(newFileName, file.stream(), {
    access: "public",
  });

  return new NextResponse(
    JSON.stringify({
      filename: newFileName,
      link: blob.url,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
