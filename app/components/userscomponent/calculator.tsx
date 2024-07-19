"use client";
import { useState, useEffect, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

// Default property prices in case of fetch failure
const defaultPropertyPrices = {
  land: {
    quarter: 160000,
    half: 310000,
    full: 620000,
  },
  house: {
    "2-bedroom": 2100000,
    "3-bedroom": 3100000,
    "4-bedroom": 4100000,
  },
};

// Fetch property data from the Next.js API
const fetchPropertyData = async (propertyType: string) => {
  try {
    const response = await fetch(
      `/api/propertyData?propertyType=${propertyType}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch property data");
    }
    return await response.json();
  } catch (error) {
    return defaultPropertyPrices[propertyType];
  }
};

const PropertyCalculator = () => {
  const [propertyType, setPropertyType] = useState<string>("");
  const [propertyDetail, setPropertyDetail] = useState<string>("");
  const [paymentDuration, setPaymentDuration] = useState<number | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [propertyPrices, setPropertyPrices] = useState<{
    [key: string]: { [key: string]: number };
  }>({
    land: defaultPropertyPrices.land,
    house: defaultPropertyPrices.house,
  });

  useEffect(() => {
    if (propertyType) {
      const getPropertyData = async () => {
        const fetchedData = await fetchPropertyData(propertyType);
        setPropertyPrices((prevPrices) => ({
          ...prevPrices,
          [propertyType]: fetchedData,
        }));
      };

      getPropertyData();
    }
  }, [propertyType]);

  const handleCalculate = () => {
    let totalPrice = 0;
    if (propertyType === "land" && propertyDetail in propertyPrices.land) {
      totalPrice = propertyPrices.land[propertyDetail];
    } else if (
      propertyType === "house" &&
      propertyDetail in propertyPrices.house
    ) {
      totalPrice = propertyPrices.house[propertyDetail];
    }

    if (paymentDuration) {
      const monthlyPayment = totalPrice / paymentDuration;
      setMonthlyPayment(monthlyPayment);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Property Calculator</h1>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              setPropertyDetail("");
            }}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Property Type</option>
            <option value="land">Land</option>
            <option value="house">House</option>
          </select>
        </div>

        {propertyType && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {propertyType === "land" ? "Plot Size" : "House Specification"}
            </label>
            <select
              value={propertyDetail}
              onChange={(e) => setPropertyDetail(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">
                Select{" "}
                {propertyType === "land" ? "Plot Size" : "House Specification"}
              </option>
              {propertyType === "land" && (
                <>
                  <option value="quarter">Quarter Plot</option>
                  <option value="half">Half Plot</option>
                  <option value="full">Full Plot</option>
                </>
              )}
              {propertyType === "house" && (
                <>
                  <option value="2-bedroom">2 Bedroom</option>
                  <option value="3-bedroom">3 Bedroom</option>
                  <option value="4-bedroom">4 Bedroom</option>
                </>
              )}
            </select>
          </div>
        )}

        {propertyDetail && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Duration
            </label>
            <select
              value={paymentDuration ?? ""}
              onChange={(e) => setPaymentDuration(parseInt(e.target.value))}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Payment Duration</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="18">18 months</option>
              <option value="24">24 months</option>
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!propertyDetail || !paymentDuration}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calculate
        </button>
      </form>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Calculation Result
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Property Type:{" "}
                      {propertyType === "land" ? "Land" : "House"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {propertyType === "land" ? "Plot Size" : "Specification"}:{" "}
                      {propertyDetail}
                    </p>
                    <p className="text-sm text-gray-500">
                      Payment Duration: {paymentDuration} months
                    </p>
                    <p className="text-sm text-gray-500 font-bold mt-4">
                      Monthly Payment: {monthlyPayment?.toLocaleString()} Naira
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default PropertyCalculator;
