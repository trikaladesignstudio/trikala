"use client";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { handleSubmit } from "@/utils/util";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Section from "./Section";

function Lead() {
  const [showForm, setShowForm] = useState(true);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a name");
      return;
    } else if (!phone && !email) {
      toast.error("Please enter a phone number or email");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    handleSubmit(formData);
    setShowForm(false);
  };

  return (
    <motion.section
      id="lead"
      className={cn("snap-always shrink-0 snap-end bg-custom-lb h-auto")}
      initial={{ height: "auto" }}
      animate={{ height: showForm ? "auto" : 0 }}
      transition={{ duration: 0.25, delay: 0.25, ease: "easeInOut" }}
      exit={{ height: 0 }}
    >
      <Section toSnap={false} className="lg:py-4 min-h-fit">
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: showForm ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          exit={{ opacity: 0 }}
          className={cn(
            showForm ? "flex gap-2" : "hidden",
            " text-white",
            "grid grid-cols-1 lg:grid-cols-4 gap-4"
          )}
          action={handleSubmit}
          onSubmit={handleSubmitForm}
        >
          <div className="flex items-center gap-2">
            <input
              className="w-full rounded-full text-black p-3 font-semibold"
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-full rounded-full text-black p-3 font-semibold"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              // defaultValue=""
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-full rounded-full text-black p-3 font-semibold"
              type="tel"
              id="phone"
              name="phone"
              placeholder="Phone"
              // defaultValue="0485076730"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button
            className="flex items-center gap-2 rounded-full h-full bg-custom-db border-none"
            type="submit"
            variant={"outline"}
          >
            Submit
          </Button>
        </motion.form>
        <Toaster />
      </Section>
    </motion.section>
  );
}

export default Lead;
