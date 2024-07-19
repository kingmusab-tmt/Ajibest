"use client";
import React, { useEffect, useState } from "react";
import AnalyticDashboard from "./AnalyticDashboard";

interface DashboardData {
  transactions: any[];
  users: any[];
  properties: any[];
  error: string | null;
}

const fetchData = async (): Promise<DashboardData> => {
  try {
    const [transactionsRes, usersRes, propertiesRes] = await Promise.all([
      fetch("/api/transactions"),
      fetch("/api/users/getUsers"),
      fetch("/api/property/getproperties"),
    ]);

    const [transactions, users, properties] = await Promise.all([
      transactionsRes.json(),
      usersRes.json(),
      propertiesRes.json(),
    ]);

    return {
      transactions: transactions.transactions,
      users: users.data,
      properties: properties.data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching data", error);
    return {
      transactions: [],
      users: [],
      properties: [],
      error: "Failed to fetch data",
    };
  }
};

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    transactions: [],
    users: [],
    properties: [],
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };

    loadData();
  }, []);

  if (data.error) {
    return <div>Error: {data.error}</div>;
  }

  return (
    <div>
      <AnalyticDashboard
        transactions={data.transactions}
        users={data.users}
        properties={data.properties}
      />
    </div>
  );
};

export default DashboardPage;
