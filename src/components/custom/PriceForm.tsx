"use client";

import { BarGraph } from "@/components/custom/BarGraph";
import { PieChartComponent } from "@/components/custom/PieChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { get_cities, get_data_by_location, getStates } from "@/lib/sheetAccess";
import {
  BuildingClassType,
  EstimaterDataType,
  locationType,
} from "@/types/actions";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const formatedNumber = (num: number) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
    notation: "compact",
  }).format(num);
};

const convertToSqft = (meters: number) => meters * 10.7639;
const convertToSqM = (sqft: number) => sqft / 10.7639;

export default function PriceForm({ handleBack }: { handleBack: () => void }) {
  // static
  const [unit, setUnit] = useState<"sqft" | "sqm">("sqft");
  const [buildingClass, setBuildingClass] =
    useState<BuildingClassType>("regular");

  // dynamic read data to show on load
  const [stateData, setStateData] = useState<locationType[]>([]);
  const [CityData, setCityData] = useState<locationType[]>([]);

  const [isFormFilled, setIsFormFilled] = useState(false);
  const [area, setArea] = useState(0);
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [ValueToCalculator, setValueToCalculator] =
    useState<EstimaterDataType | null>(null);

  const [results, setResults] = useState<EstimaterDataType[BuildingClassType]>({
    interior: 0,
    construction: 0,
    days: 0,
  });

  const [change, setChange] = useState<Boolean>(false);

  const resultSectionRef = useRef<HTMLDivElement>(null);

  // dynamic location data
  useEffect(() => {
    getStates().then(setStateData);
  }, []);

  useEffect(() => {
    if (stateId !== "") {
      setChange(true);
      setCityData([]);
      get_cities(parseInt(stateId)).then((res) => {
        setCityData(res);
      });
    }
  }, [stateId]);

  useEffect(() => {
    if (stateId && cityId && area > 0) {
      setChange(true);
    }
  }, [cityId]);

  // convert area accordingly
  useEffect(() => {
    if (unit === "sqm") {
      setArea(convertToSqM(area));
    }

    if (unit === "sqft") {
      setArea(convertToSqft(area));
    }
  }, [unit]);

  useEffect(() => {
    if (ValueToCalculator) {
      const data = ValueToCalculator[buildingClass];

      const convertedAreaToSqft = unit !== "sqft" ? convertToSqft(area) : area;

      setResults({
        interior: data.interior * convertedAreaToSqft,
        construction: data.construction * convertedAreaToSqft,
        days: data.days * convertedAreaToSqft,
      });
    }
  }, [buildingClass, area, ValueToCalculator]);

  const getCostFromInputs = async (stateId: number, cityId: number) => {
    const data = await get_data_by_location(stateId, cityId);

    if (data) {
      setValueToCalculator(data);
    }
  };

  const handleSubmit = async () => {
    if (!stateId || !cityId) {
      toast.error("Please select state and city");
      return;
    }

    if (area <= 0) {
      toast.error("Please enter a valid area");
      return;
    }

    if (change) {
      await getCostFromInputs(parseInt(stateId), parseInt(cityId));
      setIsFormFilled(true);
      setChange(false);

      // Wait for the result section to render, then scroll into view
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        toast.success("Estimated successfully");
      }, 10);
    } else {
      toast.error("Please enter a valid area");
    }
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="mx-auto py-2  flex flex-col items-center lg:w-[80%]">
        <div className="container mx-auto py-2 space-y-6 ">
          <div className="text-center space-y-2 relative ">
            <div className="flex items-center absolute top-0 lg:top-1/2 left-0 -translate-y-1/2">
              <Button variant="ghost" size="sm" onClick={() => handleBack()}>
                <ArrowLeft className="lg:mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
            <h1 className="text-3xl font-serif">Price Estimator</h1>
            <p className="text-muted-foreground text-sm">
              Get an instant estimate for your construction project
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location & Area Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">State</Label>
                  <Select value={stateId} onValueChange={setStateId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {stateData.map(({ title, id }) => (
                        <SelectItem key={id} value={`${id}`}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">City</Label>
                  <Select value={cityId} onValueChange={setCityId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    {/* city options dynamic */}
                    <SelectContent className="bg-white">
                      {CityData.map(({ title, id }) => (
                        <SelectItem key={id} value={`${id}`}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Area</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter area"
                    className="flex-1"
                    value={area || ""}
                    onChange={(e) => setArea(Number(e.target.value))}
                  />

                  <div className="flex">
                    <Button
                      className={`${unit === "sqft"
                        ? "bg-gray-500 text-white"
                        : " text-gray-700"
                        }`}
                      size="sm"
                      variant={unit === "sqft" ? "secondary" : "outline"}
                      onClick={() => setUnit("sqft")}
                    >
                      ft²
                    </Button>
                    <Button
                      className={`${unit === "sqm"
                        ? "bg-gray-500 text-white"
                        : " text-gray-700"
                        }`}
                      size="sm"
                      variant={unit === "sqm" ? "secondary" : "outline"}
                      onClick={() => setUnit("sqm")}
                    >
                      m²
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Building Class</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${buildingClass === "regular"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setBuildingClass("regular")}
                >
                  <svg
                    className={`w-6 h-6 mb-2 ${buildingClass === "regular" ? "text-blue-500" : "text-gray-500"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className={`text-sm font-medium ${buildingClass === "regular" ? "text-blue-500" : "text-gray-700"
                    }`}>
                    Regular
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Standard finishes</span>
                </button>

                <button
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${buildingClass === "luxury"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setBuildingClass("luxury")}
                >
                  <svg
                    className={`w-6 h-6 mb-2 ${buildingClass === "luxury" ? "text-blue-500" : "text-gray-500"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  <span className={`text-sm font-medium ${buildingClass === "luxury" ? "text-blue-500" : "text-gray-700"
                    }`}>
                    Luxury
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Premium finishes</span>
                </button>

                <button
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${buildingClass === "dwelling"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setBuildingClass("dwelling")}
                >
                  <svg
                    className={`w-6 h-6 mb-2 ${buildingClass === "dwelling" ? "text-blue-500" : "text-gray-500"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className={`text-sm font-medium ${buildingClass === "dwelling" ? "text-blue-500" : "text-gray-700"
                    }`}>
                    Dwelling
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Basic finishes</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {change && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full bg-gray-200"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {isFormFilled && (
        <>
          <div ref={resultSectionRef} className="flex flex-col lg:flex-row gap-2">
            <div className="w-full lg:w-[35%]">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-rows-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          Structural
                        </div>
                        <div className="font-semibold">
                          {new Intl.NumberFormat("en-IN", {
                            maximumFractionDigits: 1,
                            style: "currency",
                            currency: "INR",
                          }).format(results.construction)}
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${(results.construction / (results.construction + results.interior)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          Finishing
                        </div>
                        <div className="font-semibold">
                          {new Intl.NumberFormat("en-IN", {
                            maximumFractionDigits: 1,
                            style: "currency",
                            currency: "INR",
                          }).format(results.interior)}
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500 right-0 absolute"
                          style={{
                            width: `${(results.interior / (results.construction + results.interior)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="pt-1 border-t my-1">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Total Cost</div>
                        <div className="text-lg font-bold">
                          {new Intl.NumberFormat("en-IN", {
                            maximumFractionDigits: 1,
                            style: "currency",
                            currency: "INR",
                          }).format(results.construction + results.interior)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="h-[380px] w-full">
                  <PieChartComponent
                    totalValue={formatedNumber(results.construction + results.interior)}
                  />
                </div>
              </Card>
            </div>
            <Card className="w-full lg:w-[65%] h-full">
              <BarGraph
                days={results.days}
                totalValue={results.construction + results.interior}
              />
            </Card>
          </div>
          <div className="text-center text-muted-foreground text-sm mt-4 mb-8">
            <span className="font-semibold">Note: &nbsp;</span>
            This is an estimate and may vary based on the actual project requirements and site conditions.
            For more detailed estimates, larger projects, or custom requirements, please contact us.
          </div>
        </>
      )}
    </div>
  );
}
