"use client";

import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-select";
import { PieChartComponent } from "@/components/custom/PieChart";
import { BarGraph } from "@/components/custom/BarGraph";

export default function PriceEstimator() {
  const [unit, setUnit] = useState<"sqft" | "sqm">("sqft");
  const [buildingClass, setBuildingClass] = useState("regular");
  const [structureType, setStructureType] = useState("framed");
  const [isFormFilled, setIsFormFilled] = useState(false);

  const resultSectionRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    setIsFormFilled(true);

    // Wait for the result section to render, then scroll into view
    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="min-h-screen bg-muted/10 w-[60%] mx-auto">
      <div className=" mx-auto py-6 px-4 flex flex-col items-center">
        <div className="container mx-auto py-6 px-4 space-y-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="text-center space-y-2">
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="state1">State 1</SelectItem>
                      <SelectItem value="state2">State 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">City</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="city1">City 1</SelectItem>
                      <SelectItem value="city2">City 2</SelectItem>
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

          {/* <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Structure Type
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className={`${
                      structureType === "framed"
                        ? "bg-gray-500 text-white"
                        : " text-gray-700"
                    }`}
                    onClick={() => setStructureType("framed")}
                  >
                    Framed
                  </Button>
                  <Button
                    size="sm"
                    className={`${
                      structureType === "load"
                        ? "bg-gray-500 text-white"
                        : " text-gray-700"
                    }`}
                    onClick={() => setStructureType("load")}
                  >
                    Load
                  </Button>
                </div>
              </CardContent>
            </Card> */}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Structural
                  </Label>
                  <Input
                    type="text"
                    value="₹3,60,000"
                    className="text-right"
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Finishing
                  </Label>
                  <Input
                    type="text"
                    value="₹2,40,000"
                    className="text-right"
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Total</Label>
                  <Input
                    type="text"
                    value="₹6,00,000"
                    className="text-right font-medium"
                    readOnly
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <div className="text-sm font-medium">Timeline & Summary</div>
                <p className="text-sm text-muted-foreground">
                  Total Duration: 247 Days • Estimated Cost: ₹29,26,500
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <Button
              variant="outline"
              className="w-full bg-gray-200"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Card>
        </div>
      </div>
      {isFormFilled && (
        <div
          ref={resultSectionRef}
          className="flex flex-col lg:flex-row justify-between items-center"
        >
          <div className="w-full lg:w-1/3">
            <PieChartComponent />
          </div>
          <div className="w-full lg:w-2/3">
            <BarGraph />
          </div>
        </div>
      )}
    </div>
  );
}
