"use client";

import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Taxi from "./Taxi";
import Script from "next/script";
import {
  YMaps,
  Map,
  SearchControl,
  ObjectManager,
  Placemark,
  RoutePanel,
} from "@pbe/react-yandex-maps";
import { MapEvents } from "@yandex/ymaps3-types";
import {motion} from "framer-motion"

interface PropsMapComponent {
  inputSearchProps: string;
  setInputSearchProps: React.Dispatch<React.SetStateAction<string>>;
  PropsCoodinats: number[];
}

interface ResultRequest {
  response: {
    GeoObjectCollection: {
      featureMember: [
        {
          GeoObject: {
            name: string;
            Point: {
              pos: string;
            };
          };
        }
      ];
    };
  };
}

export default function MapComponent({
  inputSearchProps,
  setInputSearchProps,
  PropsCoodinats,
}: PropsMapComponent) {
  const [coordinats, setCoordinats] = useState<number[]>([55.751574, 37.43856]);

  // использовал any, так как нет поддержки typescript со стороны разработчиков "React Yandex Maps"
  const handleClickMap = (e: any) => {
    let tempCoordinats: number[] = e.get("coords");
    setCoordinats(tempCoordinats);
    console.log(
      `https://geocode-maps.yandex.ru/1.x/?apikey=af0b612c-3347-499e-8a03-56e935f7da01&geocode=${
        tempCoordinats[1] + "," + tempCoordinats[0]
      }&format=json`
    );

    fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=af0b612c-3347-499e-8a03-56e935f7da01&geocode=${
        tempCoordinats[1] + "," + tempCoordinats[0]
      }&format=json`
    )
      .then((response) => response.json())
      .then((data: ResultRequest) => {
        setInputSearchProps(
          data.response.GeoObjectCollection.featureMember[0].GeoObject.name
        );

        console.log(
          data.response.GeoObjectCollection.featureMember[0].GeoObject.name
        );
        console.log(
          data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
        );
      });
  };

  useEffect(() => {
    console.log("Обновление координат в useEffect");

    setCoordinats(PropsCoodinats);
  }, [PropsCoodinats]);

  console.log(coordinats);

  return (
    <Box sx={{ display: "flex", height: "500px", gap: 2 }}>
      <YMaps query={{ apikey: "af0b612c-3347-499e-8a03-56e935f7da01" }}>
        <motion.div initial={{opacity: 0, x: -100, y: 50}} animate={{opacity: 1, x: 0, y: 0}} transition={{duration: 0.3}} className=" w-[65%]">
          <Map
            onClick={(e: any) => handleClickMap(e)}
            className="w-full h-full"
            defaultState={{ center: coordinats, zoom: 9 }}
            state={{ center: coordinats, zoom: 9 }}
          >
            <Placemark
              options={{ iconColor: "yellow" }}
              geometry={coordinats}
              defaultGeometry={coordinats}
            />
          </Map>
        </motion.div>
      </YMaps>
      <motion.aside initial={{opacity: 0, x: 100, y: 50}} animate={{opacity: 1, x: 0, y: 0}} transition={{duration: 0.3}} className=" w-[35%]  h-full">
        <div className="border-b p-2 flex  justify-between">
          <Taxi nameCar="Chevrolet Lacetti" colorCar="синий" distance={100} />
        </div>
        <div className="border-b p-2 flex  justify-between">
          <Taxi nameCar="Chevrolet Lacetti" colorCar="синий" distance={200} />
        </div>
        <div className="border-b p-2 flex justify-between">
          <Taxi nameCar="Chevrolet Lacetti" colorCar="синий" distance={300} />
        </div>
      </motion.aside>
    </Box>
  );
}
