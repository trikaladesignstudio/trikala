"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ConstructionEstimator() {
  const [formData, setFormData] = useState({
    state: "",
    city: "",
    area: "",
    unit: "sqft",
    basement: "non-basement",
    groundFloor: 400,
    storeys: 0,
    floorHeight: 8,
    buildingClass: "regular",
    roadPosition: "well-defined",
    structureType: "framed-bearing",
  });

  const calculateCosts = () => {
    const baseRate =
      formData.buildingClass === "luxury"
        ? 2000
        : formData.buildingClass === "regular"
        ? 1500
        : 1000;
    const totalArea = formData.groundFloor * (formData.storeys + 1);
    const structuralCost = totalArea * baseRate * 0.6;
    const finishingCost = totalArea * baseRate * 0.4;
    return {
      structural: Math.round(structuralCost),
      finishing: Math.round(finishingCost),
      total: Math.round(structuralCost + finishingCost),
    };
  };

  const costs = calculateCosts();

  return (
    <div className=" overflow-hidden">
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
          Find Out How Much Your Home-building Project Will Cost
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Get an instant estimate for your construction project
        </p>
        {/* {step === 1 ? ( */}
        {/* <div className="space-y-6"> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              Select State
            </label>
            <select
              id="state"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="  block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            >
              <option value="">Select State</option>
              <option value="state1">State 1</option>
              <option value="state2">State 2</option>
              <option value="state3">State 3</option>
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              Select City
            </label>
            <select
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="  block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            >
              <option value="">Select City</option>
              <option value="city1">City 1</option>
              <option value="city2">City 2</option>
              <option value="city3">City 3</option>
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700"
            >
              Area
            </label>
            <div className="flex space-x-4">
              <Input
                type="text"
                id="area"
                value={formData.area}
                onChange={(e) => {
                  const newValue = e.target.value;
                  // Validate to allow only numeric values
                  if (/^\d*$/.test(newValue)) {
                    setFormData({ ...formData, area: newValue });
                  }
                }}
                className="block w-full px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />

              <div className="flex space-x-2">
                <Button
                  className={`px-5 py-2 text-sm font-medium rounded-md ${
                    formData.unit === "sqft"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFormData({ ...formData, unit: "sqft" })}
                >
                  Square Feet
                </Button>
                <Button
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    formData.unit === "sqm"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFormData({ ...formData, unit: "sqm" })}
                >
                  Sq. Meter
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* </div> */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between gap-4 pt-4">
              <div className="space-y-2 border border-gray-300 rounded-md p-4 w-full">
                <label className="block text-sm font-medium text-gray-700 ">
                  Building Class
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["luxury", "regular", "dwelling"].map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        formData.buildingClass === type
                          ? "bg-gray-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, buildingClass: type })
                      }
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border border-gray-300 rounded-md p-4 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Structure Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["framed-bearing", "load-bearing"].map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        formData.structureType === type
                          ? "bg-gray-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, structureType: type })
                      }
                    >
                      {type
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Structural Expenses
                </label>
                <input
                  type="text"
                  value={costs.structural}
                  readOnly
                  className="  block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Finishing Expenses
                </label>
                <input
                  type="text"
                  value={costs.finishing}
                  readOnly
                  className="  block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Expenses
                </label>
                <input
                  type="text"
                  value={costs.total}
                  readOnly
                  className="  block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
