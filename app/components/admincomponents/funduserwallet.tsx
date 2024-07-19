"use client";
import { useState } from "react";
// import { useSession } from "next-auth/react";
import axios from "axios";

const FundUserWallet = () => {
  //   const { data: session } = useSession();
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  //   const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);

  const handleFundWallet = async () => {
    try {
      const response = await fetch("/api/users/searchbyemail");

      if (response.ok) {
        const data = await response.json();
        const userId = data._id;
        const response1 = await axios.post("/api/fund-wallet", {
          userId,
          amount,
        });
        const response2 = await axios.put("/api/users/" + userId, {
          walletBalance: amount,
        });
        if (response1.data.success && response2.data.success) {
          setError(null);
          setAmount(0);
          setEmail("");
          //   setUserId("");
        } else {
          setError(response1.data.error || response2.data.error);
        }
      } else {
        setError(error);
      }
    } catch (error) {
      throw error;
    }
  };
  return (
    <div className="max-w-md mx-auto p-4 pt-6 pb-8 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-4">Fund User Wallet</h1>
      <form className="space-y-6">
        <div className="flex flex-col">
          <label className="text-sm" htmlFor="userName">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="w-full p-2 pl-10 text-sm text-gray-700"
          />
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleFundWallet}
        >
          Fund Wallet
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};
export default FundUserWallet;
