import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";

// Define allowed field groups
const ALLOWED_FIELDS = {
  nextOfKin: [
    "address",
    "email",
    "name",
    "phoneNumber",
    "userAccountNumber",
    "userBankName",
    "image",
  ],
  userAccount: ["userAccountName", "userAccountNumber", "userBankName"],
  userProfile: [
    "username",
    "name",
    "phoneNumber",
    "address",
    "bvnOrNin",
    "country",
    "state",
    "lga",
  ],
};

function filterAllowedFields(data, allowedFields) {
  const filtered = {};

  Object.keys(data).forEach((key) => {
    if (allowedFields.includes(key)) {
      filtered[key] = data[key];
    }
  });

  return filtered;
}

function filterNextOfKinFields(nextOfKinData) {
  if (!nextOfKinData || typeof nextOfKinData !== "object") return {};

  const filtered = {};
  ALLOWED_FIELDS.nextOfKin.forEach((field) => {
    if (nextOfKinData[field] !== undefined) {
      filtered[field] = nextOfKinData[field];
    }
  });

  return filtered;
}

function validateUpdateData(updateData) {
  const allowedKeys = [
    ...ALLOWED_FIELDS.userAccount,
    ...ALLOWED_FIELDS.userProfile,
    "nextOfKin",
  ];

  // Check if any disallowed fields are being updated
  const invalidFields = Object.keys(updateData).filter(
    (key) => !allowedKeys.includes(key),
  );

  if (invalidFields.length > 0) {
    throw new Error(`Disallowed fields: ${invalidFields.join(", ")}`);
  }

  // Filter the actual data
  const filteredData: Record<string, any> = {};

  // Filter user account fields
  ALLOWED_FIELDS.userAccount.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  // Filter user profile fields
  ALLOWED_FIELDS.userProfile.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  // Filter nextOfKin fields
  if (updateData.nextOfKin) {
    filteredData.nextOfKin = filterNextOfKinFields(updateData.nextOfKin);
  }

  return filteredData;
}

function flattenNextOfKin(updateData: Record<string, any>) {
  if (!updateData.nextOfKin) return updateData;

  const { nextOfKin, ...rest } = updateData;
  const flattened: Record<string, any> = { ...rest };

  Object.entries(nextOfKin).forEach(([key, value]) => {
    flattened[`nextOfKin.${key}`] = value;
  });

  return flattened;
}

export const dynamic = "force-dynamic";

export async function PUT(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({
      message: "Unauthorized",
      status: 401,
      success: false,
    });
  }

  try {
    const data = await req.json();
    const { _id, ...userInfo } = data;

    let filter = {};
    if (_id) {
      filter = { _id };
    } else {
      const email = session?.user?.email;
      filter = { email };
    }

    // Validate and filter the update data
    const filteredUpdateData = validateUpdateData(userInfo);
    // For partial nextOfKin updates, use dotted paths so we don't overwrite the entire subdocument
    const updatePayload = flattenNextOfKin(filteredUpdateData);

    // Check if there's any valid data to update
    if (Object.keys(updatePayload).length === 0) {
      return Response.json({
        message: "No valid fields to update",
        status: 400,
        success: false,
      });
    }

    await User.updateOne(filter, { $set: updatePayload });

    return Response.json({
      message: "Update successful",
      status: 200,
      success: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    if (message.startsWith("Disallowed fields:")) {
      return Response.json({
        message,
        status: 400,
        success: false,
      });
    }

    return Response.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
}

export async function PATCH(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({
      message: "Unauthorized",
      status: 401,
      success: false,
    });
  }

  try {
    const data = await req.json();
    const { _id, ...updateData } = data;

    let filter = {};
    if (_id) {
      filter = { _id };
    } else {
      const email = session?.user?.email;
      filter = { email };
    }

    const user = await User.findOne(filter);
    if (!user) {
      return Response.json({
        message: "User not found",
        status: 404,
        success: false,
      });
    }

    // Validate and filter the update data
    const filteredUpdateData = validateUpdateData(updateData);
    const updatePayload = flattenNextOfKin(filteredUpdateData);

    // Check if there's any valid data to update
    if (Object.keys(updatePayload).length === 0) {
      return Response.json({
        message: "No valid fields to update",
        status: 400,
        success: false,
      });
    }

    await User.updateOne(filter, { $set: updatePayload });

    return Response.json({
      message: "Update successful",
      status: 200,
      success: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    if (message.startsWith("Disallowed fields:")) {
      return Response.json({
        message,
        status: 400,
        success: false,
      });
    }

    return Response.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
}
