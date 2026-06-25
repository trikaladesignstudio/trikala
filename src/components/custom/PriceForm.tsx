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
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

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

const buildingClassOptions: {
  id: BuildingClassType;
  label: string;
  description: string;
}[] = [
  { id: "regular", label: "Regular", description: "Standard finishes" },
  { id: "luxury", label: "Luxury", description: "Premium finishes" },
  { id: "dwelling", label: "Dwelling", description: "Basic finishes" },
];

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

  const [change, setChange] = useState(false);

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
  }, [cityId, stateId, area]);

  // convert area accordingly
  useEffect(() => {
    if (unit === "sqm") {
      setArea(convertToSqM(area));
    }

    if (unit === "sqft") {
      setArea(convertToSqft(area));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [buildingClass, area, ValueToCalculator, unit]);

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
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 lg:gap-8">
        <div className="flex flex-col gap-3 border-b border-zinc-200/80 pb-4 lg:gap-4 lg:pb-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-silver text-2xl tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
              Price Estimator
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBack()}
              className="shrink-0 text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-600 sm:text-base">
            Enter your location and build area for an indicative project cost.
          </p>
        </div>

        <Card className="overflow-hidden rounded-md border-zinc-200/80 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 pb-4">
            <CardTitle className="text-base font-medium tracking-tight text-zinc-900">
              Location & Area
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
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

                  <div className="flex overflow-hidden rounded-md border border-zinc-200">
                    <Button
                      className={cn(
                        "rounded-none px-4",
                        unit === "sqft"
                          ? "bg-zinc-900 text-white hover:bg-zinc-800"
                          : "bg-white text-zinc-600 hover:bg-zinc-50"
                      )}
                      size="sm"
                      variant="ghost"
                      onClick={() => setUnit("sqft")}
                    >
                      ft²
                    </Button>
                    <Button
                      className={cn(
                        "rounded-none border-l border-zinc-200 px-4",
                        unit === "sqm"
                          ? "bg-zinc-900 text-white hover:bg-zinc-800"
                          : "bg-white text-zinc-600 hover:bg-zinc-50"
                      )}
                      size="sm"
                      variant="ghost"
                      onClick={() => setUnit("sqm")}
                    >
                      m²
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-md border-zinc-200/80 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 pb-4">
              <CardTitle className="text-base font-medium tracking-tight text-zinc-900">
                Building Class
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {buildingClassOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={cn(
                      "flex flex-col items-start rounded-md border p-4 text-left transition-all active:scale-[0.98]",
                      buildingClass === option.id
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                    )}
                    onClick={() => setBuildingClass(option.id)}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                    <span
                      className={cn(
                        "mt-1 text-xs",
                        buildingClass === option.id
                          ? "text-zinc-300"
                          : "text-zinc-500"
                      )}
                    >
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {change && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                <Button
                  className="h-12 w-full rounded-md bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.99]"
                  onClick={handleSubmit}
                >
                  Calculate estimate
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
      {isFormFilled && (
        <div className="mx-auto mt-10 w-full max-w-6xl space-y-6">
          <div
            ref={resultSectionRef}
            className="flex flex-col gap-6 lg:flex-row"
          >
            <Card className="h-full w-full overflow-hidden rounded-md border-zinc-200/80 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] lg:w-[35%]">
              <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="text-center text-lg font-medium tracking-tight text-zinc-900">
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 pt-6">
                <div className="grid grid-rows-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
                        Structural
                      </div>
                      <div className="font-semibold text-zinc-900">
                        {new Intl.NumberFormat("en-IN", {
                          maximumFractionDigits: 1,
                          style: "currency",
                          currency: "INR",
                        }).format(results.construction)}
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-zinc-900 transition-all duration-500"
                        style={{
                          width: `${(results.construction / (results.construction + results.interior)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                        Finishing
                      </div>
                      <div className="font-semibold text-zinc-900">
                        {new Intl.NumberFormat("en-IN", {
                          maximumFractionDigits: 1,
                          style: "currency",
                          currency: "INR",
                        }).format(results.interior)}
                      </div>
                    </div>
                    <div className="relative h-1.5 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="absolute right-0 h-full rounded-full bg-zinc-400 transition-all duration-500"
                        style={{
                          width: `${(results.interior / (results.construction + results.interior)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="border-t border-zinc-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-zinc-600">
                        Total Cost
                      </div>
                      <div className="text-xl font-semibold tracking-tight text-zinc-900">
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
                  totalValue={formatedNumber(
                    results.construction + results.interior
                  )}
                />
              </div>
            </Card>
            <Card className="h-full w-full overflow-hidden rounded-md border-zinc-200/80 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] lg:w-[65%]">
              <BarGraph
                days={results.days}
                totalValue={results.construction + results.interior}
              />
            </Card>
          </div>
          <p className="mx-auto max-w-[65ch] text-center text-sm leading-relaxed text-zinc-500">
            <span className="font-medium text-zinc-700">Note:</span> This is an
            indicative estimate. Final costs may vary with site conditions,
            specifications, and project scope. Contact us for a detailed quote.
          </p>
        </div>
      )}
    </div>
  );
}
