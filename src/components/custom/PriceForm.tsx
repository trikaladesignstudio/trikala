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
      setResults({
        interior: data.interior * area,
        construction: data.construction * area,
        days: data.days * area,
      });
    }
  }, [buildingClass, area, ValueToCalculator]);

  const getCostFromInputs = async (stateId: number, cityId: number) => {
    const data = await get_data_by_location(stateId, cityId);
    // console.log(data);

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
        toast.success("Form submitted successfully");
      }, 10);
    } else {
      toast.error("Please enter a valid area");
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 ">
      <div className="mx-auto py-6 px-4 flex flex-col items-center lg:w-[60%]">
        <div className="container mx-auto py-6 px-4 space-y-6 ">
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
                      className={`${
                        unit === "sqft"
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
                      className={`${
                        unit === "sqm"
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
              <CardTitle className="text-sm font-medium">
                Building Class
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={"outline"}
                  className={`${
                    buildingClass === "regular"
                      ? "bg-gray-500 text-white"
                      : " text-gray-700"
                  }`}
                  onClick={() => setBuildingClass("regular")}
                >
                  Regular
                </Button>
                <Button
                  size="sm"
                  variant={"outline"}
                  className={`${
                    buildingClass === "luxury"
                      ? "bg-gray-500 text-white"
                      : " text-gray-700"
                  }`}
                  onClick={() => setBuildingClass("luxury")}
                >
                  Luxury
                </Button>
                <Button
                  size="sm"
                  variant={"outline"}
                  className={`${
                    buildingClass === "dwelling"
                      ? "bg-gray-500 text-white"
                      : " text-gray-700"
                  }`}
                  onClick={() => setBuildingClass("dwelling")}
                >
                  Dwelling
                </Button>
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
        <div ref={resultSectionRef} className="flex flex-row gap-2">
          <div className="w-full lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-center">
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-1">
                <div className="grid grid-row-3 gap-1">
                  <div className="space-y-1  flex justify-between w-full">
                    <div className="text-sm text-muted-foreground font-bold">
                      Structural
                    </div>
                    {new Intl.NumberFormat("en-IN", {
                      maximumFractionDigits: 1,
                      style: "currency",
                      currency: "INR",
                    }).format(results.construction)}
                  </div>
                  <div className="space-y-1 flex justify-between w-full">
                    <div className="text-sm text-muted-foreground font-bold">
                      Finishing
                    </div>
                    {new Intl.NumberFormat("en-IN", {
                      maximumFractionDigits: 1,
                      style: "currency",
                      currency: "INR",
                    }).format(results.interior)}
                  </div>
                  <div className="space-y-1  flex justify-between w-full">
                    <div className="text-sm text-muted-foreground font-bold">
                      Total
                    </div>
                    {new Intl.NumberFormat("en-IN", {
                      maximumFractionDigits: 1,
                      style: "currency",
                      currency: "INR",
                    }).format(results.construction + results.interior)}
                  </div>
                </div>
              </CardContent>
              <PieChartComponent
                totalValue={formatedNumber(
                  results.construction + results.interior
                )}
              />
            </Card>
          </div>
          <Card className="w-full lg:w-2/3 bord">
            <BarGraph
              days={results.days}
              totalValue={results.construction + results.interior}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
