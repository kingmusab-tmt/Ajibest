"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import mongoose from "mongoose";

interface Transaction {
  _id: string;
  transactionId: string;
  referenceId?: string;
  propertyPrice: number;
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  propertyType: "House" | "Land" | "Farm";
  paymentMethod: "installment" | "payOnce";
  paymentPurpose: "For Sale" | "For Renting";
  amount: number;
  status: "pending" | "successful" | "failed" | "canceled";
  email: string;
  createdAt: Date;
  title?: string;
  userName?: string;
}

const TransactionHistory: React.FC = () => {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [transactionType, setTransactionType] = useState<string>("");
  const [transactionStatus, settransactionStatus] = useState<string>("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const body = {
          sortField,
          sortOrder,
          transactionType,
          transactionStatus,
        };
        const response = await axios.get("/api/transactions", { params: body });
        console.log(response.data.transactions);
        const transactionsData = await Promise.all(
          response.data.transactions.map(async (transaction: Transaction) => {
            const propertyResponse = await axios.get(
              `/api/property/getsingleproperty?id=${transaction.propertyId}`
            );
            console.log("this is the response", propertyResponse.data.data);
            const userResponse =
              session?.user.role === "admin"
                ? await axios.get(
                    `/api/users/getSingleUser?id=${transaction.userId}`
                  )
                : { data: { name: "" } };
            return {
              ...transaction,
              title: propertyResponse.data.data.title,
              userName: userResponse.data.name,
            };
          })
        );

        setTransactions(transactionsData);
      } catch (error) {
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [
    sortField,
    sortOrder,
    transactionType,
    transactionStatus,
    session?.user.role,
    session?.user.email,
    status,
  ]);

  const handleSortChange = (field: string) => {
    const newSortOrder =
      sortField === field && sortOrder === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="container p-4">
      <h1 className="text-x1 sm:text-2xl font-bold mb-4">
        Transaction History
      </h1>

      <div className="mb-4 flex space-x-3 sm:space-x-4">
        <select
          className="px-2 sm:px-4 py-2 border rounded"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="">All Transaction Types</option>
          <option value="installment">Installment</option>
          <option value="payOnce">Pay Once</option>
        </select>

        <select
          className="px-2 sm:px-4 py-2 border rounded"
          value={transactionStatus}
          onChange={(e) => settransactionStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-y-auto overflow-x-auto max-h-screen max-w-80 sm:max-w-full ">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th
                className="px-2 sm:px-4 py-2 border-b cursor-pointer"
                onClick={() => handleSortChange("transactionId")}
              >
                Reference
              </th>
              <th
                className="px-2 sm:px-4 border-b cursor-pointer"
                onClick={() => handleSortChange("paymentMethod")}
              >
                Method
              </th>
              <th
                className="px-2 sm:px-4 py-2 border-b cursor-pointer"
                onClick={() => handleSortChange("amount")}
              >
                Amount
              </th>
              <th
                className="px-2 sm:px-4 py-2 border-b cursor-pointer"
                onClick={() => handleSortChange("date")}
              >
                Date
              </th>
              <th
                className="px-2 sm:px-4 py-2 border-b cursor-pointer"
                onClick={() => handleSortChange("status")}
              >
                Status
              </th>
              {session?.user.role === "Admin" && (
                <>
                  <th className="px-2 sm:px-4 py-2 border-b">User ID</th>
                  <th className="px-2 sm:px-4 py-2 border-b">User Name</th>
                </>
              )}
              <th className="px-2 sm:px-4 py-2 border-b">Payment Purpose</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-2 sm:px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-2 sm:px-4 py-2 text-center text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-2 sm:px-4 py-2 text-center">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-100">
                  <td className="px-2 sm:px-4 py-2 border-b">
                    {transaction.referenceId}
                  </td>
                  <td className="px-2 sm:px-4 py-2 border-b">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-2 sm:px-4 py-2 border-b">
                    {transaction.amount}
                  </td>
                  <td className="px-2 sm:px-4 py-2 border-b">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-4 py-2 border-b">
                    {transaction.status}
                  </td>
                  {session?.user.role === "Admin" && (
                    <>
                      <td className="px-2 sm:px-4 py-2 border-b">
                        {transaction.userId.toString()}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border-b">
                        {transaction.userName}
                      </td>
                    </>
                  )}
                  <td className="px-2 sm:px-4 py-2 border-b">
                    {transaction.paymentPurpose}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
