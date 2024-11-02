"use client";
import { cn } from "@/lib/utils";
import { handleSubmit } from "@/utils/util";
import { motion } from "framer-motion";
import React from "react";
import { Button } from "../ui/button";

function Lead() {
  const [showForm, setShowForm] = React.useState(true);
  return (
    <motion.section
      className={cn("snap-always shrink-0 snap-end bg-black h-auto")}
      initial={{ height: "auto" }}
      animate={{ height: showForm ? "auto" : 0 }}
      transition={{ duration: 0.25, delay: 0.25, ease: "easeInOut" }}
      exit={{ height: 0 }}
    >
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: showForm ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        exit={{ opacity: 0 }}
        className={cn(
          showForm ? "flex" : "hidden",
          "px-[2rem] lg:px-[5rem] py-12 lg:py-20 w-full text-white",
          "grid grid-cols-1 lg:grid-cols-4 gap-4"
        )}
        action={handleSubmit}
        onSubmit={() => setShowForm(false)}
      >
        <div className="flex items-center gap-2 ">
          <label htmlFor="name">Name:</label>
          <input
            className="w-2/3 rounded-md"
            type="text"
            id="name"
            name="name"
            defaultValue="Name"
            required
          />
        </div>
        <div className="flex items-center gap-2 ">
          <label htmlFor="email">Email: </label>
          <input
            className="w-2/3 rounded-md"
            type="email"
            id="email"
            name="email"
            defaultValue="trikaladesignstudio@gmail.com"
            required
          />
        </div>
        <div className="flex items-center gap-2 ">
          <label htmlFor="phone">Phone:</label>
          <input
            className="w-2/3 rounded-md"
            type="tel"
            id="phone"
            name="phone"
            defaultValue="04850"
            required
          />
        </div>
        <Button
          className="flex items-center gap-2"
          type="submit"
          variant={"outline"}
        >
          <input className="btn " type="submit" />
        </Button>
      </motion.form>
    </motion.section>
  );
}

export default Lead;
