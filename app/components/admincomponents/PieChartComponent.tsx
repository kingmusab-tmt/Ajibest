import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const PieChartComponent = ({ transactions, users }) => {
  const data = [
    {
      name: "Sold",
      value: users?.reduce(
        (sum, user) =>
          sum +
          user.propertyPurOrRented?.reduce(
            (acc, curr) => acc + (curr.paymentPurpose === "For Sale" ? 1 : 0),
            0
          ),
        0
      ),
    },
    {
      name: "Rented",
      value: users?.reduce(
        (sum, user) =>
          sum +
          user.propertyPurOrRented?.reduce(
            (acc, curr) =>
              acc + (curr.paymentPurpose === "For Renting" ? 1 : 0),
            0
          ),
        0
      ),
    },
    {
      name: "One Time Payment",
      value: transactions?.filter((t) => t.paymentMethod === "payOnce").length,
    },
    {
      name: "Installment Payment",
      value: transactions?.filter((t) => t.paymentMethod === "installment")
        .length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
