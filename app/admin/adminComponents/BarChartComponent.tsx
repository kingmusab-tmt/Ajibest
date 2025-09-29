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
