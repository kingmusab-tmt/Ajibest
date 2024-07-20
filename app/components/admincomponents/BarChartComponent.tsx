// import React, { useMemo, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const categorizeTransactions = (
//   transactions,
//   startDate,
//   endDate,
//   status,
//   paymentMethod,
//   propertyType
// ) => {
//   const categories = {
//     Daily: 0,
//     Weekly: 0,
//     Monthly: 0,
//     Yearly: 0,
//   };

//   transactions.forEach((transaction) => {
//     const createdAt = new Date(transaction.createdAt);
//     if (
//       (startDate && createdAt < new Date(startDate)) ||
//       (endDate && createdAt > new Date(endDate)) ||
//       (status && transaction.status !== status) ||
//       (paymentMethod && transaction.paymentMethod !== paymentMethod) ||
//       (propertyType && transaction.propertyType !== propertyType)
//     ) {
//       return;
//     }

//     const now = new Date();
//     const diffTime = Math.abs(now - createdAt);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays <= 1) {
//       categories.Daily += transaction.amount;
//     } else if (diffDays <= 7) {
//       categories.Weekly += transaction.amount;
//     } else if (diffDays <= 30) {
//       categories.Monthly += transaction.amount;
//     } else {
//       categories.Yearly += transaction.amount;
//     }
//   });

//   return [
//     { name: "Daily", amount: categories.Daily },
//     { name: "Weekly", amount: categories.Weekly },
//     { name: "Monthly", amount: categories.Monthly },
//     { name: "Yearly", amount: categories.Yearly },
//   ];
// };

// const BarChartComponent = ({ transactions }) => {
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [status, setStatus] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [propertyType, setPropertyType] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [displayModes, setDisplayModes] = useState({
//     Daily: true,
//     Weekly: true,
//     Monthly: true,
//     Yearly: true,
//   });

//   const data = useMemo(
//     () =>
//       categorizeTransactions(
//         transactions,
//         startDate,
//         endDate,
//         status,
//         paymentMethod,
//         propertyType
//       ),
//     [transactions, startDate, endDate, status, paymentMethod, propertyType]
//   );

//   const handleStartDateChange = (e) => {
//     const newStartDate = e.target.value;
//     if (endDate && new Date(newStartDate) > new Date(endDate)) {
//       alert("Start date cannot be after end date.");
//       return;
//     }
//     setStartDate(newStartDate);
//   };

//   const handleEndDateChange = (e) => {
//     const newEndDate = e.target.value;
//     if (startDate && new Date(newEndDate) < new Date(startDate)) {
//       alert("End date cannot be before start date.");
//       return;
//     }
//     setEndDate(newEndDate);
//   };

//   const resetFilters = () => {
//     setStartDate(null);
//     setEndDate(null);
//     setStatus("");
//     setPaymentMethod("");
//     setPropertyType("");
//     setDisplayModes({
//       Daily: true,
//       Weekly: true,
//       Monthly: true,
//       Yearly: true,
//     });
//   };

//   const toggleDisplayMode = (mode) => {
//     setDisplayModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
//   };

//   return (
//     <div>
//       <button onClick={() => setShowFilters(!showFilters)}>Filter</button>
//       {showFilters && (
//         <div className="filter-dropdown">
//           <label>
//             Start Date:
//             <input
//               type="date"
//               value={startDate || ""}
//               onChange={handleStartDateChange}
//             />
//           </label>
//           <label>
//             End Date:
//             <input
//               type="date"
//               value={endDate || ""}
//               onChange={handleEndDateChange}
//             />
//           </label>
//           <label>
//             Status:
//             <select value={status} onChange={(e) => setStatus(e.target.value)}>
//               <option value="">All</option>
//               <option value="pending">Pending</option>
//               <option value="completed">Completed</option>
//             </select>
//           </label>
//           <label>
//             Payment Method:
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             >
//               <option value="">All</option>
//               <option value="installment">Installment</option>
//               <option value="payOnce">Full Payment</option>
//             </select>
//           </label>
//           <label>
//             Property Type:
//             <select
//               value={propertyType}
//               onChange={(e) => setPropertyType(e.target.value)}
//             >
//               <option value="">All</option>
//               <option value="House">House</option>
//               <option value="Apartment">Apartment</option>
//               <option value="Land">Land</option>
//             </select>
//           </label>
//           <label>
//             Display Modes:
//             <div>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={displayModes.Daily}
//                   onChange={() => toggleDisplayMode("Daily")}
//                 />
//                 Daily
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={displayModes.Weekly}
//                   onChange={() => toggleDisplayMode("Weekly")}
//                 />
//                 Weekly
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={displayModes.Monthly}
//                   onChange={() => toggleDisplayMode("Monthly")}
//                 />
//                 Monthly
//               </label>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={displayModes.Yearly}
//                   onChange={() => toggleDisplayMode("Yearly")}
//                 />
//                 Yearly
//               </label>
//             </div>
//           </label>
//           <button onClick={resetFilters}>Reset Filters</button>
//         </div>
//       )}
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           {displayModes.Daily && (
//             <Bar dataKey="amount" name="Daily" fill="#8884d8" />
//           )}
//           {displayModes.Weekly && (
//             <Bar dataKey="amount" name="Weekly" fill="#82ca9d" />
//           )}
//           {displayModes.Monthly && (
//             <Bar dataKey="amount" name="Monthly" fill="#ffc658" />
//           )}
//           {displayModes.Yearly && (
//             <Bar dataKey="amount" name="Yearly" fill="#ff7300" />
//           )}
//         </BarChart>
//       </ResponsiveContainer>
//       <style jsx>{`
//         .filter-dropdown {
//           display: flex;
//           flex-direction: column;
//           background: #fff;
//           border: 1px solid #ccc;
//           padding: 10px;
//           position: absolute;
//           z-index: 1;
//         }
//         .filter-dropdown label {
//           margin-bottom: 10px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BarChartComponent;
// import React, { useMemo, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const categorizeTransactions = (
//   transactions,
//   startDate,
//   endDate,
//   status,
//   paymentMethod,
//   propertyType,
//   displayMode
// ) => {
//   const categories = {
//     Daily: 0,
//     Weekly: 0,
//     Monthly: 0,
//   };

//   transactions.forEach((transaction) => {
//     const createdAt = new Date(transaction.createdAt);
//     if (
//       (startDate && createdAt < new Date(startDate)) ||
//       (endDate && createdAt > new Date(endDate)) ||
//       (status && transaction.status !== status) ||
//       (paymentMethod && transaction.paymentMethod !== paymentMethod) ||
//       (propertyType && transaction.propertyType !== propertyType)
//     ) {
//       return;
//     }

//     const now = new Date();
//     const diffTime = Math.abs(now - createdAt);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (displayMode === "Daily" && diffDays <= 1) {
//       categories.Daily += transaction.amount;
//     } else if (displayMode === "Weekly" && diffDays <= 7) {
//       categories.Weekly += transaction.amount;
//     } else if (displayMode === "Monthly" && diffDays <= 30) {
//       categories.Monthly += transaction.amount;
//     }
//   });

//   return [{ name: displayMode, amount: categories[displayMode] }];
// };

// const BarChartComponent = ({ transactions }) => {
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [status, setStatus] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [propertyType, setPropertyType] = useState("");
//   const [displayMode, setDisplayMode] = useState("Daily");
//   const [showFilters, setShowFilters] = useState(false);

//   const data = useMemo(
//     () =>
//       categorizeTransactions(
//         transactions,
//         startDate,
//         endDate,
//         status,
//         paymentMethod,
//         propertyType,
//         displayMode
//       ),
//     [
//       transactions,
//       startDate,
//       endDate,
//       status,
//       paymentMethod,
//       propertyType,
//       displayMode,
//     ]
//   );

//   const handleStartDateChange = (e) => {
//     const newStartDate = e.target.value;
//     if (endDate && new Date(newStartDate) > new Date(endDate)) {
//       alert("Start date cannot be after end date.");
//       return;
//     }
//     setStartDate(newStartDate);
//   };

//   const handleEndDateChange = (e) => {
//     const newEndDate = e.target.value;
//     if (startDate && new Date(newEndDate) < new Date(startDate)) {
//       alert("End date cannot be before start date.");
//       return;
//     }
//     setEndDate(newEndDate);
//   };

//   const resetFilters = () => {
//     setStartDate(null);
//     setEndDate(null);
//     setStatus("");
//     setPaymentMethod("");
//     setPropertyType("");
//     setDisplayMode("Daily");
//   };

//   return (
//     <div>
//       <button onClick={() => setShowFilters(!showFilters)}>Filter</button>
//       {showFilters && (
//         <div className="filter-dropdown">
//           <label>
//             Start Date:
//             <input
//               type="date"
//               value={startDate || ""}
//               onChange={handleStartDateChange}
//             />
//           </label>
//           <label>
//             End Date:
//             <input
//               type="date"
//               value={endDate || ""}
//               onChange={handleEndDateChange}
//             />
//           </label>
//           <label>
//             Status:
//             <select value={status} onChange={(e) => setStatus(e.target.value)}>
//               <option value="">All</option>
//               <option value="pending">Pending</option>
//               <option value="completed">Completed</option>
//             </select>
//           </label>
//           <label>
//             Payment Method:
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             >
//               <option value="">All</option>
//               <option value="installment">Installment</option>
//               <option value="full">Full Payment</option>
//             </select>
//           </label>
//           <label>
//             Property Type:
//             <select
//               value={propertyType}
//               onChange={(e) => setPropertyType(e.target.value)}
//             >
//               <option value="">All</option>
//               <option value="House">House</option>
//               <option value="Apartment">Apartment</option>
//               <option value="Land">Land</option>
//             </select>
//           </label>
//           <label>
//             Display Mode:
//             <select
//               value={displayMode}
//               onChange={(e) => setDisplayMode(e.target.value)}
//             >
//               <option value="Daily">Daily</option>
//               <option value="Weekly">Weekly</option>
//               <option value="Monthly">Monthly</option>
//             </select>
//           </label>
//           <button onClick={resetFilters}>Reset Filters</button>
//         </div>
//       )}
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="amount" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//       <style jsx>{`
//         .filter-dropdown {
//           display: flex;
//           flex-direction: column;
//           background: #fff;
//           border: 1px solid #ccc;
//           padding: 10px;
//           position: absolute;
//           z-index: 1;
//         }
//         .filter-dropdown label {
//           margin-bottom: 10px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BarChartComponent;
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const categorizeTransactions = (transactions) => {
  const categories = {
    Daily: 0,
    Weekly: 0,
    Monthly: 0,
    Yearly: 0,
  };

  transactions.forEach((transaction) => {
    const createdAt = new Date(transaction.createdAt);
    const createdAtDate = new Date(createdAt);

    const now = new Date();

    const diffTime = Math.abs(Number(now) - Number(createdAt));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      categories.Daily += transaction.amount;
    } else if (diffDays <= 7) {
      categories.Weekly += transaction.amount;
    } else if (diffDays <= 30) {
      categories.Monthly += transaction.amount;
    } else {
      categories.Yearly += transaction.amount;
    }
  });

  return [
    { name: "Daily", amount: categories.Daily },
    { name: "Weekly", amount: categories.Weekly },
    { name: "Monthly", amount: categories.Monthly },
    { name: "Yearly", amount: categories.Yearly },
  ];
};

const BarChartComponent = ({ transactions }) => {
  const data = useMemo(
    () => categorizeTransactions(transactions),
    [transactions]
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
