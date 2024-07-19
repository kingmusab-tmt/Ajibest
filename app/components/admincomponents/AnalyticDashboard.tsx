import React from "react";
import BarChartComponent from "./BarChartComponent";
import PieChartComponent from "./PieChartComponent";
import CardsComponent from "./CardsComponent";
import TableComponent from "./TableComponent";

const AnalyticDashboard = ({ transactions, users, properties }) => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <CardsComponent
        transactions={transactions}
        users={users}
        properties={properties}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChartComponent transactions={transactions} />
        <PieChartComponent transactions={transactions} users={undefined} />
      </div>
      <TableComponent users={users} />
    </div>
  );
};

export default AnalyticDashboard;
