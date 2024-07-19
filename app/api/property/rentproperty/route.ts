import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../utils/connectDB";
import User from "@/models/user";
import Property from "@/models/properties";
import Transaction from "@/models/transaction";
import authMiddleware from "@/utils/authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { propertyId, months } = req.body;
        const user = await User.findById(req.user.id);
        const property = await Property.findById(propertyId);

        if (!user || !property) {
          return res
            .status(404)
            .json({ message: "User or Property not found" });
        }

        const amount = property.price * months;
        await user.deductFromWallet(amount);

        await Transaction.create({
          user: user._id,
          property: property._id,
          amount,
          type: "rent",
          status: "success",
        });

        res
          .status(200)
          .json({ success: true, message: "Transaction successful" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res
        .status(400)
        .json({ success: false, message: "Invalid request method" });
      break;
  }
};

export default authMiddleware(handler);
