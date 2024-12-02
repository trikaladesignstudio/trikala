import { motion } from "framer-motion";
import React from "react";
import { Button } from "../ui/button";

function PriceForm() {
  return (
    <div>
      <motion.form
        initial={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex items-center gap-2">
          <input
            className="w-full rounded-full text-black p-3 font-semibold"
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            // onChange={(e) => setName(e.target.value)}
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
            // onChange={(e) => setEmail(e.target.value)}
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
            // onChange={(e) => setPhone(e.target.value)}
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
    </div>
  );
}

export default PriceForm;
