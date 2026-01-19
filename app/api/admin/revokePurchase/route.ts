import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import User from "@/models/user";
import Property from "@/models/properties";
import RefundRequest from "@/models/refundRequest";
import dbConnect from "@/utils/connectDB";
import { saveNotification } from "@/models/notification";
import { sendEmail } from "@/utils/emailService";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json(
      { message: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  try {
    // Check if user is admin
    const adminUser = await User.findOne({ email: session.user.email });
    if (adminUser?.role !== "Admin") {
      return Response.json(
        { message: "Admin access required", success: false },
        { status: 403 },
      );
    }

    const { userEmail, propertyId, reason } = await req.json();

    if (!userEmail || !propertyId || !reason) {
      return Response.json(
        {
          message: "User email, property ID, and reason are required",
          success: false,
        },
        { status: 400 },
      );
    }

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    // Find the property in user's propertyPurOrRented or propertyUnderPayment
    let propertyToRevoke: any = null;
    let sourceArray: "propertyPurOrRented" | "propertyUnderPayment" | null =
      null;
    let propertyIndex = -1;

    // Check in propertyPurOrRented first
    propertyIndex = user.propertyPurOrRented.findIndex(
      (p: any) => p.propertyId.toString() === propertyId,
    );

    if (propertyIndex !== -1) {
      sourceArray = "propertyPurOrRented";
      propertyToRevoke = user.propertyPurOrRented[propertyIndex];
    } else {
      // Check in propertyUnderPayment
      propertyIndex = user.propertyUnderPayment.findIndex(
        (p: any) => p.propertyId.toString() === propertyId,
      );

      if (propertyIndex !== -1) {
        sourceArray = "propertyUnderPayment";
        propertyToRevoke = user.propertyUnderPayment[propertyIndex];
      }
    }

    if (!propertyToRevoke || !sourceArray) {
      return Response.json(
        {
          message: "Property not found in user's owned properties",
          success: false,
        },
        { status: 404 },
      );
    }

    // Move the property to propertyWithdrawn array
    const withdrawnProperty = {
      title: propertyToRevoke.title,
      description: propertyToRevoke.description,
      location: propertyToRevoke.location,
      image: propertyToRevoke.image,
      userEmail: propertyToRevoke.userEmail,
      propertyId: propertyToRevoke.propertyId,
      propertyType: propertyToRevoke.propertyType,
      listingPurpose: propertyToRevoke.listingPurpose,
      paymentMethod: propertyToRevoke.paymentMethod,
      initialPayment: propertyToRevoke.initialPayment || 0,
      propertyPrice: propertyToRevoke.propertyPrice,
      bedrooms: propertyToRevoke.bedrooms,
      bathrooms: propertyToRevoke.bathrooms,
      amenities: propertyToRevoke.amenities,
      utilities: propertyToRevoke.utilities,
      plotNumber: propertyToRevoke.plotNumber,
      state: propertyToRevoke.state,
      size: propertyToRevoke.size,
      instalmentAllowed: propertyToRevoke.instalmentAllowed,
      paymentHistory: propertyToRevoke.paymentHistory || [],
      withdrawnDate: new Date(),
      isWithdrawnApproved: true,
      withdrawalReason: reason,
      isWithdrawn: true,
      approvedAt: new Date(),
      approvedBy: session.user.email,
    };

    user.propertyWithdrawn.push(withdrawnProperty);

    // Remove the property from source array
    if (sourceArray === "propertyPurOrRented") {
      user.propertyPurOrRented.splice(propertyIndex, 1);
    } else {
      user.propertyUnderPayment.splice(propertyIndex, 1);
    }

    await user.save();

    // Create refund request for the revoked property
    let savedRefundRequest: any = undefined;
    try {
      // Calculate total money paid by user from paymentHistory
      const totalPaid = (withdrawnProperty.paymentHistory || []).reduce(
        (sum: number, payment: any) => sum + (Number(payment.amount) || 0),
        0,
      );

      // Only create refund request if there's money to refund
      if (totalPaid > 0) {
        // Create refund schedule based on payment history
        const refundSchedule = createRefundSchedule(
          withdrawnProperty.paymentHistory,
        );

        // Create and save refund request
        const refundReq = new RefundRequest({
          userId: user._id,
          userEmail: user.email,
          userName: user.name,
          propertyId: propertyId,
          propertyTitle: withdrawnProperty.title,
          totalRefundAmount: totalPaid,
          refundSchedule: refundSchedule,
          status: "pending",
          createdAt: new Date(),
          createdBy: session.user.email,
          notes: `Property revoked by admin. Reason: ${reason}`,
        });

        savedRefundRequest = await refundReq.save();
      }
    } catch (err) {
      // Continue with the process even if refund request creation fails
    }

    // Update the property to make it available again
    await Property.findByIdAndUpdate(propertyId, {
      status: "available",
      purchased: false,
      rented: false,
    });

    // Send notification to user
    const notificationMessage = `Your property "${withdrawnProperty.title}" has been revoked by admin. Reason: ${reason}`;
    try {
      await saveNotification(notificationMessage, userEmail);
    } catch (err) {
      // Notification failed but continue
    }

    // Send email to user
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f44336; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: white; margin: 0;">Property Purchase Revoked</h2>
          </div>
          
          <p>Dear ${user.name || "User"},</p>
          
          <p>We regret to inform you that your purchase of the following property has been revoked by the admin:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Property:</strong> ${withdrawnProperty.title}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${withdrawnProperty.location}</p>
            <p style="margin: 5px 0;"><strong>Price:</strong> ₦${withdrawnProperty.propertyPrice.toLocaleString()}</p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404;"><strong>Reason:</strong> ${reason}</p>
          </div>
          
          <p>If you have any questions or concerns, please contact our support team.</p>
          
          <p>Best regards,<br/>
          <strong>Ajibest Properties</strong></p>
        </div>
      `;

      await sendEmail({
        to: userEmail,
        subject: `Property Purchase Revoked - ${withdrawnProperty.title}`,
        html: emailHtml,
      });
    } catch (err) {
      // Email failed but continue
    }

    return Response.json(
      {
        message: "Purchase revoked successfully",
        success: true,
        refundRequestId: savedRefundRequest
          ? savedRefundRequest._id
          : undefined,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}

// Helper function to create refund schedule based on payment history
function createRefundSchedule(paymentHistory: any[]) {
  interface RefundScheduleItem {
    amount: number;
    dueDate: Date;
    isPaid: boolean;
    paidAt: Date | null;
    paymentMethod: string;
  }

  const refundSchedule: RefundScheduleItem[] = [];

  // Sort payment history by date
  const sortedPayments = [...paymentHistory].sort(
    (a, b) =>
      new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
  );

  // Start refunds one month from now
  let currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);

  for (const payment of sortedPayments) {
    const amount = Number(payment.amount) || 0;
    if (amount > 0) {
      refundSchedule.push({
        amount: amount,
        dueDate: new Date(currentDate),
        isPaid: false,
        paidAt: null,
        paymentMethod: "bank_transfer",
      });

      // Move to next month for next refund
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return refundSchedule;
}
