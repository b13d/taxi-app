import { Box } from "@mui/material";
import React from "react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

interface PropsTaxi {
  nameCar: string;
  colorCar: string;
  numberCar?: string;
  distance?: number;
}

export default function Taxi({
  nameCar,
  colorCar,
  numberCar,
  distance,
}: PropsTaxi) {
  return (
    <>
      <div className="w-[50px] h-[50px] flex items-center justify-center text-[gray]">
        <DirectionsCarIcon fontSize="large"/>
      </div>
      <div className="text-left">
        <h1 className={inter.className}>{nameCar}</h1>
        <p className={inter.className}>{colorCar}</p>
        {numberCar && (
          <h2
            className={`border border-[#c0b7b7] w-fit px-2 py-1 rounded-md ${inter.className}`}
          >
            {numberCar}
          </h2>
        )}
      </div>
      {distance && <h2 className="flex items-end text-[gray]">{distance} м</h2>}
      {distance && (
        <h2 className="cursor-pointer flex items-center text-[gray]">
          <ArrowForwardIosIcon />
        </h2>
      )}
    </>
  );
}
