import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const BankAccountDetail: React.FC = () => {
  const { data: session, status } = useSession();
  const [account, setAccount] = useState({
    userAccountNumber: "",
    userBankName: "",
    userAccountName: "",
  });
  const [changedFields, setChangedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/users/getSingleUser")
        .then((response) => response.json())
        .then((data) => {
          setAccount(data.data);
        });
    }
  }, [session, status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAccount((prevAccount) => ({ ...prevAccount, [name]: value }));
    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear errors on change
  };

  const validateForm = () => {
    let valid = true;
    let newErrors: { [key: string]: string } = {};

    if (!account.userAccountName) {
      newErrors.userAccountName = "Account Name is required";
      valid = false;
    }
    if (!account.userAccountNumber) {
      newErrors.userAccountNumber = "Account Number is required";
      valid = false;
    }
    if (!account.userBankName) {
      newErrors.userBankName = "Bank Name is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const updatedAccount: { [key: string]: string } = {};
    for (const key in account) {
      if (changedFields[key]) {
        updatedAccount[key] = account[key];
      }
    }

    await fetch("/api/users/updateuser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAccount),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          alert("Account updated successfully");
          setChangedFields({}); // Reset changed fields after successful update
        } else {
          alert("Failed to update account");
        }
      });
  };

  const banks = [
    "Access Bank",
    "Citibank",
    "Diamond Bank",
    "Ecobank Nigeria",
    "Fidelity Bank Nigeria",
    "First Bank of Nigeria",
    "First City Monument Bank",
    "Guaranty Trust Bank",
    "Heritage Bank Plc",
    "Jaiz Bank Plc",
    "Keystone Bank Limited",
    "Providus Bank Plc",
    "Polaris Bank",
    "Stanbic IBTC Bank Nigeria Limited",
    "Standard Chartered Bank",
    "Sterling Bank",
    "Suntrust Bank Nigeria Limited",
    "Taj Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa",
    "Unity Bank Plc",
    "Wema Bank",
    "Zenith Bank",
  ];

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6">Bank Account Detail</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700">Account Name</label>
          <input
            type="text"
            name="userAccountName"
            value={account.userAccountName}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border ${
              errors.userAccountName ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.userAccountName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userAccountName}
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Account Number</label>
          <input
            type="text"
            name="userAccountNumber"
            value={account.userAccountNumber}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border ${
              errors.userAccountNumber ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.userAccountNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userAccountNumber}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">Bank Name</label>
        <select
          name="userBankName"
          value={account.userBankName}
          onChange={handleChange}
          className={`w-full mt-1 p-2 border ${
            errors.userBankName ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="">Select Bank</option>
          {banks.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
        {errors.userBankName && (
          <p className="text-red-500 text-sm mt-1">{errors.userBankName}</p>
        )}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save
      </button>
    </div>
  );
};

export default BankAccountDetail;
