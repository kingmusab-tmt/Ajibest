// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import { Transaction } from "@/constants/interface";

// const TransactionHistory: React.FC = () => {
//   const { data: session, status } = useSession();
//   const userId = session?.user?.email;

//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [page, setPage] = useState<number>(1);
//   const [total, setTotal] = useState<number>(0);
//   const [limit] = useState<number>(10); // Adjust the limit as needed
//   const [sortField, setSortField] = useState<string>("date");
//   const [sortOrder, setSortOrder] = useState<string>("desc");
//   const [transactionType, setTransactionType] = useState<string>("");
//   const [transactionStatus, settransactionStatus] = useState<string>("");
//   // const [userId, setUserId] = useState<string>("");

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get("/api/transactions", {
//           params: {
//             page,
//             limit,
//             sortField,
//             sortOrder,
//             transactionType,
//             transactionStatus,
//             userId,
//           },
//         });
//         setTransactions(response.data.transactions);
//         setTotal(response.data.total);
//       } catch (error) {
//         setError("Failed to load transactions. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [
//     page,
//     limit,
//     sortField,
//     sortOrder,
//     transactionType,
//     transactionStatus,
//     userId,
//   ]);

//   const totalPages = Math.ceil(total / limit);

//   const handleSortChange = (field: string) => {
//     const newSortOrder =
//       sortField === field && sortOrder === "desc" ? "asc" : "desc";
//     setSortField(field);
//     setSortOrder(newSortOrder);
//   };

//   return (
//     <div className="container">
//       <h1 className="text-x1 sm:text-2xl font-bold mb-4">
//         Transaction History
//       </h1>

//       <div className="mb-4 flex space-x-3 sm:space-x-4">
//         <select
//           className="px-2 sm:px-4 py-2 border rounded"
//           value={transactionType}
//           onChange={(e) => setTransactionType(e.target.value)}
//         >
//           <option value="">All Transaction Types</option>
//           <option value="installment">Installment</option>
//           <option value="payOnce">Full Payment</option>
//         </select>

//         <select
//           className="px-2 sm:px-4 py-2 border rounded"
//           value={transactionStatus}
//           onChange={(e) => settransactionStatus(e.target.value)}
//         >
//           <option value="">All Statuses</option>
//           <option value="pending">Pending</option>
//           <option value="successful">Completed</option>
//           <option value="failed">Failed</option>
//           <option value="canceled">Canceled</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border-b">User Name</th>
//               <th className="px-4 py-2 border-b">Property Title</th>
//               {/* <th
//                 className="px-2 sm:px-4 py-2 border-b cursor-pointer"
//                 onClick={() => handleSortChange("transactionId")}
//               >
//                 ID
//               </th> */}
//               <th
//                 className="px-2 sm:px-4 border-b cursor-pointer"
//                 onClick={() => handleSortChange("transactionType")}
//               >
//                 Type
//               </th>
//               <th
//                 className="px-2 sm:px-4 py-2 border-b cursor-pointer"
//                 onClick={() => handleSortChange("amount")}
//               >
//                 Amount
//               </th>
//               <th
//                 className="px-2 sm:px-4 py-2 border-b cursor-pointer"
//                 onClick={() => handleSortChange("date")}
//               >
//                 Date
//               </th>
//               <th
//                 className="px-2 sm:px-4 py-2 border-b cursor-pointer"
//                 onClick={() => handleSortChange("transactionStatus")}
//               >
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={7} className="px-2 sm:px-4 py-2 text-center">
//                   Loading...
//                 </td>
//               </tr>
//             ) : error ? (
//               <tr>
//                 <td
//                   colSpan={7}
//                   className="px-2 sm:px-4 py-2 text-center text-red-500"
//                 >
//                   {error}
//                 </td>
//               </tr>
//             ) : transactions.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-2 sm:px-4 py-2 text-center">
//                   No transactions found.
//                 </td>
//               </tr>
//             ) : (
//               transactions.map((transaction) => (
//                 <tr key={transaction._id} className="hover:bg-gray-100">
//                   <td className="px-4 py-2 border-b">{transaction.userName}</td>
//                   <td className="px-4 py-2 border-b">{transaction.title}</td>
//                   {/* <td className="px-2 sm:px-4 py-2 border-b">
//                     {transaction.transactionId}
//                   </td> */}
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {transaction.paymentMethod}
//                   </td>
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {transaction.amount}
//                   </td>
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {new Date(transaction.createdAt).toLocaleString()}
//                   </td>
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {transaction.status}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => setPage((prev) => Math.max(prev - 1, 2))}
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//           disabled={page === 1 || loading}
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//           disabled={page === totalPages || loading}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Transaction } from "@/constants/interface";

const TransactionHistory: React.FC = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.email;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit] = useState<number>(10); // Adjust the limit as needed
  const [sortField, setSortField] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [transactionType, setTransactionType] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [filterUserName, setFilterUserName] = useState<string>("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/transactions", {
          params: {
            page,
            limit,
            sortField,
            sortOrder,
            transactionType,
            transactionStatus,
            userId,
            filterUserName,
          },
        });
        setTransactions(response.data.transactions);
        setTotal(response.data.total);
      } catch (error) {
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [
    page,
    limit,
    sortField,
    sortOrder,
    transactionType,
    transactionStatus,
    userId,
    filterUserName,
  ]);

  const totalPages = Math.ceil(total / limit);

  const handleSortChange = (field: string) => {
    const newSortOrder =
      sortField === field && sortOrder === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const handleUpdateStatus = async (transactionId: string, status: string) => {
    setLoading(true);
    try {
      await axios.put(
        `/api/transactions/updateTransaction?id=${transactionId}`,
        { status }
      );
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, status }
            : transaction
        )
      );
    } catch (error) {
      setError("Failed to update transaction status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="text-x1 sm:text-2xl font-bold mb-4">
        Transaction History
      </h1>

      <div className="mb-4 flex space-x-3 sm:space-x-4">
        <input
          type="text"
          className="px-2 sm:px-4 py-2 border rounded"
          placeholder="Filter by User Name"
          value={filterUserName}
          onChange={(e) => setFilterUserName(e.target.value)}
        />
        <select
          className="px-2 sm:px-4 py-2 border rounded"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="">All Transaction Types</option>
          <option value="installment">Installment</option>
          <option value="payOnce">Full Payment</option>
        </select>
        <select
          className="px-2 sm:px-4 py-2 border rounded"
          value={transactionStatus}
          onChange={(e) => setTransactionStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="successful">Completed</option>
          <option value="failed">Failed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">User Name</th>
              <th className="px-4 py-2 border-b">Property Title</th>
              <th
                className="px-2 sm:px-4 border-b cursor-pointer"
                onClick={() => handleSortChange("transactionType")}
              >
                Type
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
                onClick={() => handleSortChange("transactionStatus")}
              >
                Status
              </th>
              <th className="px-2 sm:px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-2 sm:px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-2 sm:px-4 py-2 text-center text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-2 sm:px-4 py-2 text-center">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{transaction.userName}</td>
                  <td className="px-4 py-2 border-b">{transaction.title}</td>
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
                  <td className="px-2 sm:px-4 py-2 border-b">
                    <select
                      className="px-2 py-1 border rounded"
                      value={transaction.status}
                      onChange={(e) =>
                        handleUpdateStatus(transaction._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="successful">Successful</option>
                      <option value="failed">Failed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 2))}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          disabled={page === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;
