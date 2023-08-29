"use client";

import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Taxi from "./Taxi";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { motion } from "framer-motion";

interface PropsMapComponent {
  inputSearchProps: string;
  setInputSearchProps: React.Dispatch<React.SetStateAction<string>>;
  coodinatsProps: number[];
  findAddressProps: boolean;
  latProps: number[];
  lonProps: number[];
  setFindAddressProps: React.Dispatch<React.SetStateAction<boolean>>;
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
  setInputSearchProps,
  coodinatsProps,
  findAddressProps,
  latProps,
  lonProps,
  setFindAddressProps,
}: PropsMapComponent) {
  const [coordinats, setCoordinats] = useState<number[]>([55.751574, 37.43856]);

  // использовал any, так как нет поддержки typescript со стороны разработчиков "React Yandex Maps"
  const handleClickMap = (e: any) => {
    let tempCoordinats: number[] = e.get("coords");
    setCoordinats(tempCoordinats);

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
      });

    setFindAddressProps(false);
  };

  useEffect(() => {
    // Обновление координат в useEffect

    setCoordinats(coodinatsProps);
  }, [coodinatsProps]);

  return (
    <Box
      className="mt-10 justify-center max-md:flex-col-reverse max-md:w-full max-md:items-center md:h-[500px] overflow-hidden"
      sx={{ display: "flex", gap: 2 }}
    >
      <YMaps query={{ apikey: "af0b612c-3347-499e-8a03-56e935f7da01" }}>
        <motion.div
          initial={{ opacity: 0, x: -100, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:w-[65%]"
        >
          <Map
            onClick={(e: any) => handleClickMap(e)}
            className="w-full h-full"
            defaultState={{ center: coordinats, zoom: 9 }}
            state={{ center: coordinats, zoom: 9 }}
          >
            {findAddressProps && (
              <>
                <Placemark
                  options={{ iconColor: "green" }}
                  geometry={[
                    coordinats[0] + latProps[0],
                    coordinats[1] + lonProps[0],
                  ]}
                  defaultGeometry={[
                    coordinats[0] + latProps[0],
                    coordinats[1] + lonProps[0],
                  ]}
                />
                <Placemark
                  options={{ iconColor: "green" }}
                  geometry={[
                    coordinats[0] - latProps[1],
                    coordinats[1] - lonProps[1],
                  ]}
                  defaultGeometry={[
                    coordinats[0] - latProps[1],
                    coordinats[1] - lonProps[1],
                  ]}
                />
                <Placemark
                  options={{ iconColor: "green" }}
                  geometry={[
                    coordinats[0] + latProps[2],
                    coordinats[1] - lonProps[2],
                  ]}
                  defaultGeometry={[
                    coordinats[0] + 0.023,
                    coordinats[1] - 0.02,
                  ]}
                />
              </>
            )}
            <Placemark
              options={{ iconColor: "yellow" }}
              geometry={coordinats}
              defaultGeometry={coordinats}
            />
          </Map>
        </motion.div>
      </YMaps>
      {findAddressProps && (
        <motion.aside
          initial={{ opacity: 0, x: 100, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:w-[35%]  h-full"
        >
          <div className="border-b p-2 flex  justify-between">
            <Taxi nameCar="Toyota Camry" colorCar="черный" distance={100} />
          </div>
          <div className="border-b p-2 flex  justify-between">
            <Taxi nameCar="Hyundai Solaris" colorCar="белый" distance={200} />
          </div>
          <div className="border-b p-2 flex justify-between">
            <Taxi nameCar="Chevrolet Lacetti" colorCar="синий" distance={300} />
          </div>
        </motion.aside>
      )}
    </Box>
  );
}
