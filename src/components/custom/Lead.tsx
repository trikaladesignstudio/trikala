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
          "px-[2rem] lg:px-[5rem] py-12 lg:py-20 flex flex-col  w-full text-white"
        )}
        action={handleSubmit}
        onSubmit={() => setShowForm(false)}
      >
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" defaultValue="Name" required />
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue="trikaladesignstudio@gmail.com"
          required
        />
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue="04850"
          required
        />
        <Button className="mt-4" type="submit" variant={"outline"}>
          <input className="btn" type="submit" />
        </Button>
      </motion.form>
    </motion.section>
  );
}

export default Lead;
