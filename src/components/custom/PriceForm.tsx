"use client";

import { BarGraph } from "@/components/custom/BarGraph";
import {
  PieChartComponent,
  PieChartSlice,
} from "@/components/custom/PieChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScrollContainer } from "@/context/ScrollContainerContext";
import { get_cities, get_data_by_location, getStates } from "@/lib/sheetAccess";
import { cn } from "@/lib/utils";
import {
  BuildingClassType,
  EstimaterDataType,
  locationType,
} from "@/types/actions";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const formatedNumber = (num: number) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
    notation: "compact",
  }).format(num);
};

const formatCurrency = (num: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(num);

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

const panelClass =
  "overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]";

export default function PriceForm({
  handleBack,
  projectType,
}: {
  handleBack: () => void;
  projectType: string;
}) {
  const scrollContainerRef = useScrollContainer();

  const [unit, setUnit] = useState<"sqft" | "sqm">("sqft");
  const [buildingClass, setBuildingClass] =
    useState<BuildingClassType>("regular");

  const [stateData, setStateData] = useState<locationType[]>([]);
  const [cityData, setCityData] = useState<locationType[]>([]);

  const [isFormFilled, setIsFormFilled] = useState(false);
  const [areaSqft, setAreaSqft] = useState(0);
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [valueToCalculator, setValueToCalculator] =
    useState<EstimaterDataType | null>(null);

  const [results, setResults] = useState<EstimaterDataType[BuildingClassType]>({
    interior: 0,
    construction: 0,
    days: 0,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [scrollRequestId, setScrollRequestId] = useState(0);

  const resultSectionRef = useRef<HTMLDivElement>(null);

  const requestResultsScroll = useCallback(() => {
    setScrollRequestId((id) => id + 1);
  }, []);

  const scrollToResults = useCallback(() => {
    const container = scrollContainerRef?.current;
    const target = resultSectionRef.current;
    if (!target) return false;

    const isMobile = window.innerWidth < 768;
    const offset = isMobile ? 88 : 24;

    const applyScroll = () => {
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        container.scrollTo({
          top: Math.max(
            0,
            container.scrollTop + (targetRect.top - containerRect.top) - offset
          ),
          behavior: "smooth",
        });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(applyScroll));
    return true;
  }, [scrollContainerRef]);

  useEffect(() => {
    if (scrollRequestId === 0 || !isFormFilled) return;

    let cancelled = false;
    let observer: ResizeObserver | undefined;
    const retryTimers: ReturnType<typeof setTimeout>[] = [];

    const runScroll = () => {
      if (cancelled) return;
      scrollToResults();
    };

    const startScroll = () => {
      const target = resultSectionRef.current;
      if (!target) {
        retryTimers.push(setTimeout(runScroll, 80));
        return;
      }

      observer = new ResizeObserver(runScroll);
      observer.observe(target);
      runScroll();

      retryTimers.push(setTimeout(runScroll, 200));
      retryTimers.push(setTimeout(runScroll, 500));
    };

    retryTimers.push(setTimeout(startScroll, 50));

    return () => {
      cancelled = true;
      observer?.disconnect();
      retryTimers.forEach(clearTimeout);
    };
  }, [scrollRequestId, isFormFilled, scrollToResults]);

  const displayArea =
    unit === "sqft" ? areaSqft : areaSqft > 0 ? convertToSqM(areaSqft) : 0;

  useEffect(() => {
    getStates().then(setStateData);
  }, []);

  useEffect(() => {
    if (!stateId) return;
    setIsDirty(true);
    setCityId("");
    setCityData([]);
    get_cities(parseInt(stateId)).then(setCityData);
  }, [stateId]);

  useEffect(() => {
    if (valueToCalculator) {
      const data = valueToCalculator[buildingClass];
      setResults({
        interior: data.interior * areaSqft,
        construction: data.construction * areaSqft,
        days: data.days * areaSqft,
      });
    }
  }, [buildingClass, areaSqft, valueToCalculator]);

  const totalCost = results.construction + results.interior;
  const structuralShare =
    totalCost > 0 ? (results.construction / totalCost) * 100 : 0;
  const interiorShare =
    totalCost > 0 ? (results.interior / totalCost) * 100 : 0;

  const costBreakdownSlices = useMemo<PieChartSlice[]>(
    () => [
      {
        category: "structural",
        value: Math.round(structuralShare),
        title: "Structural",
        color: "#1A1A1A",
        fill: "#1A1A1A",
      },
      {
        category: "interior",
        value: Math.round(interiorShare),
        title: "Interior",
        color: "#774931",
        fill: "#774931",
      },
    ],
    [structuralShare, interiorShare]
  );

  const handleAreaChange = (rawValue: string) => {
    const parsed = Number(rawValue);
    if (!rawValue || Number.isNaN(parsed) || parsed <= 0) {
      setAreaSqft(0);
      setIsDirty(true);
      return;
    }

    setAreaSqft(unit === "sqft" ? parsed : convertToSqft(parsed));
    setIsDirty(true);
  };

  const handleUnitChange = (nextUnit: "sqft" | "sqm") => {
    if (nextUnit === unit) return;
    setUnit(nextUnit);
    setIsDirty(true);
  };

  const handleSubmit = async () => {
    if (!stateId || !cityId) {
      toast.error("Please select state and city");
      return;
    }

    if (areaSqft <= 0) {
      toast.error("Please enter a valid area");
      return;
    }

    if (!isDirty && isFormFilled) {
      requestResultsScroll();
      return;
    }

    setIsCalculating(true);

    try {
      const data = await get_data_by_location(
        parseInt(stateId),
        parseInt(cityId)
      );

      if (!data) {
        toast.error("No pricing data found for this location");
        return;
      }

      setValueToCalculator(data);
      setIsFormFilled(true);
      setIsDirty(false);
      requestResultsScroll();
      toast.success("Estimate ready");
    } catch {
      toast.error("Could not fetch pricing data. Try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 border-b border-zinc-200/80 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Estimating
                </p>
                <h2 className="font-silver text-2xl tracking-tight text-black sm:text-3xl md:text-4xl">
                  {projectType}
                </h2>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="shrink-0 rounded-full border-zinc-200 bg-white/90 px-3.5 font-semibold text-zinc-700 shadow-none hover:border-zinc-300 hover:bg-zinc-50 hover:text-black"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </Button>
            </div>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-600 sm:text-base">
              Enter your location and build area for an indicative project cost.
            </p>
          </div>

          <div className={panelClass}>
            <div className="border-b border-zinc-100 bg-zinc-50/60 px-5 py-4 sm:px-6">
              <h3 className="text-sm font-medium tracking-tight text-zinc-900">
                Location & Area
              </h3>
            </div>
            <div className="grid gap-5 px-5 py-5 sm:px-6 sm:py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm text-zinc-700">State</Label>
                  <Select
                    value={stateId}
                    onValueChange={(value) => {
                      setStateId(value);
                    }}
                  >
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
                  <Label className="text-sm text-zinc-700">City</Label>
                  <Select
                    value={cityId}
                    onValueChange={(value) => {
                      setCityId(value);
                      setIsDirty(true);
                    }}
                    disabled={!stateId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {cityData.map(({ title, id }) => (
                        <SelectItem key={id} value={`${id}`}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-zinc-700">Area</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Enter area"
                    className="flex-1"
                    value={displayArea || ""}
                    onChange={(e) => handleAreaChange(e.target.value)}
                  />
                  <div className="flex overflow-hidden rounded-xl border border-zinc-200">
                    <Button
                      type="button"
                      className={cn(
                        "rounded-none px-4",
                        unit === "sqft"
                          ? "bg-custom-db text-white hover:bg-black"
                          : "bg-white text-zinc-600 hover:bg-zinc-50"
                      )}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUnitChange("sqft")}
                    >
                      ft²
                    </Button>
                    <Button
                      type="button"
                      className={cn(
                        "rounded-none border-l border-zinc-200 px-4",
                        unit === "sqm"
                          ? "bg-custom-db text-white hover:bg-black"
                          : "bg-white text-zinc-600 hover:bg-zinc-50"
                      )}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUnitChange("sqm")}
                    >
                      m²
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <div className="border-b border-zinc-100 bg-zinc-50/60 px-5 py-4 sm:px-6">
              <h3 className="text-sm font-medium tracking-tight text-zinc-900">
                Building Class
              </h3>
            </div>
            <div className="p-2 sm:p-3">
              <div
                role="tablist"
                aria-label="Building class"
                className="grid grid-cols-1 gap-2 sm:grid-cols-[1.2fr_1fr_1fr]"
              >
                {buildingClassOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    role="tab"
                    aria-selected={buildingClass === option.id}
                    className={cn(
                      "flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition-all active:scale-[0.98]",
                      buildingClass === option.id
                        ? "border-custom-db bg-custom-db text-white"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-custom-lb/40"
                    )}
                    onClick={() => {
                      setBuildingClass(option.id);
                      setIsDirty(true);
                    }}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                    <span
                      className={cn(
                        "mt-1 text-xs",
                        buildingClass === option.id
                          ? "text-white/75"
                          : "text-zinc-500"
                      )}
                    >
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            className="h-12 w-full rounded-2xl bg-custom-db text-white hover:bg-black active:scale-[0.99]"
            onClick={handleSubmit}
            disabled={isCalculating}
          >
            {isCalculating
              ? "Calculating..."
              : isFormFilled && !isDirty
                ? "View estimate"
                : "Calculate estimate"}
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!isFormFilled ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  panelClass,
                  "flex min-h-[320px] flex-col justify-center px-6 py-10 sm:px-8"
                )}
              >
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Results preview
                </p>
                <h3 className="mt-2 font-silver text-2xl tracking-tight text-zinc-900">
                  Your estimate appears here
                </h3>
                <p className="mt-3 max-w-[45ch] text-sm leading-relaxed text-zinc-600">
                  Fill in location, area, and building class, then calculate to
                  see cost breakdown and construction timeline.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                ref={resultSectionRef}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="flex scroll-mt-24 flex-col gap-6 lg:scroll-mt-6"
              >
                <div className={panelClass}>
                  <div className="border-b border-zinc-100 bg-zinc-50/60 px-5 py-4 sm:px-6">
                    <h3 className="text-sm font-medium tracking-tight text-zinc-900">
                      Cost Breakdown
                    </h3>
                  </div>
                  <div className="grid gap-6 px-5 py-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                            <div className="h-2.5 w-2.5 rounded-full bg-black" />
                            Structural
                          </div>
                          <div className="font-mono text-sm font-semibold tabular-nums text-zinc-900">
                            {formatCurrency(results.construction)}
                          </div>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-black transition-all duration-500"
                            style={{ width: `${structuralShare}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                            <div className="h-2.5 w-2.5 rounded-full bg-custom-lb" />
                            Interior
                          </div>
                          <div className="font-mono text-sm font-semibold tabular-nums text-zinc-900">
                            {formatCurrency(results.interior)}
                          </div>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-custom-lb transition-all duration-500"
                            style={{ width: `${interiorShare}%` }}
                          />
                        </div>
                      </div>
                      <div className="border-t border-zinc-100 pt-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-zinc-600">
                            Total Cost
                          </div>
                          <div className="font-mono text-xl font-semibold tabular-nums tracking-tight text-zinc-900">
                            {formatCurrency(totalCost)}
                          </div>
                        </div>
                        <p className="mt-2 font-mono text-xs tabular-nums text-zinc-500">
                          Estimated duration:{" "}
                          {Math.max(1, Math.round(results.days)).toLocaleString(
                            "en-IN"
                          )}{" "}
                          days
                        </p>
                      </div>
                    </div>
                    <div className="h-[240px] w-full sm:h-[260px]">
                      <PieChartComponent
                        totalValue={formatedNumber(totalCost)}
                        data={costBreakdownSlices}
                        compact
                      />
                    </div>
                  </div>
                </div>

                <div className={panelClass}>
                  <BarGraph days={results.days} totalValue={totalCost} />
                </div>

                <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-500">
                  <span className="font-medium text-zinc-700">Note:</span> This
                  is an indicative estimate. Final costs may vary with site
                  conditions, specifications, and project scope. Contact us for
                  a detailed quote.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
