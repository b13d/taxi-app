import { Box } from "@mui/material";
import React from "react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import Taxi from "./Taxi";
import { motion } from "framer-motion";

export default function CallTaxi() {
  return (
    <motion.div initial={{opacity: 0, x: -100}} animate={{opacity: 1, x: 0}} transition={{duration: 0.3}} className="flex items-center gap-4">
      <h1>Подходящий вызов: </h1>
      <Box sx={{ width: "250px" }}>
        <div className="border border-black p-2 flex">
          <Taxi
            nameCar="Toyota Camry"
            colorCar="черный"
            numberCar="К777УУ"
          />
        </div>
      </Box>
    </motion.div>
  );
}
