"use client";

import { Box, Button, Container, TextField } from "@mui/material";
import CallTaxi from "@/components/CallTaxi";
import From from "@/components/From";
import MapComponent from "@/components/MapComponent";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import driverApiTaxi from "../api/taxiDriver.json";

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

interface DataTaxiSuitable {
  // прикладной код ошибки
  code: number;
  // описание
  descr: "OK";
  data: {
    crews_info: {
      crew_id: number;
      car_mark: string;
      car_model: string;
      car_color: string;
      car_number: string;
      driver_name: string;
      driver_phone: string;
      lat: number;
      lon: number;
      distance: number;
    };
  };
}

interface SearchFunction {
  source_time: string;
  addresses: {
    address: string;
    lat: number;
    lon: number;
  };
}

export default function Home() {
  const [inputSearch, setInputSearch] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Ошибка, поле обязательное");
  const [newCoordinats, setNewCoordinats] = useState<number[]>([
    55.7636, 37.61907,
  ]);
  const [findAddress, setFindAddress] = useState(false);
  const [listDriver, setListDriver] = useState<DataTaxiSuitable[]>([
    driverApiTaxi[0] as DataTaxiSuitable,
    driverApiTaxi[1] as DataTaxiSuitable,
    driverApiTaxi[2] as DataTaxiSuitable,
  ]);

  const refInput = useRef<HTMLDivElement>(null);
  const refButton = useRef<HTMLButtonElement>(null);
  const [lat, setLat] = useState<number[]>([
    Math.random() * -0.5 + Math.random() * 0.5,
    Math.random() * -0.5 + Math.random() * 0.5,
    Math.random() * -0.5 + Math.random() * 0.5,
  ]);
  const [lon, setLon] = useState<number[]>([
    Math.random() * -0.5 + Math.random() * 0.5,
    Math.random() * -0.5 + Math.random() * 0.5,
    Math.random() * -0.5 + Math.random() * 0.5,
  ]);

  const handleClickOrder = async () => {
    let temp = inputSearch.split(" ");

    let addressFind = temp.join("+");

    if (inputSearch.trim().length === 0 && !showError) {
      setShowError(true);
      setErrorMessage("Ошибка, поле обязательное");

      if (refButton !== null && refButton.current !== null) {
        refButton.current.disabled = true;
      }
      setFindAddress(false);
    } else {
      const result = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=af0b612c-3347-499e-8a03-56e935f7da01&geocode=+${addressFind}&format=json`
      )
        .then((response) => response.json())
        .then((data: ResultRequest) => data);

      if (result.response.GeoObjectCollection.featureMember.length >= 1) {
        let tempPos =
          result.response.GeoObjectCollection.featureMember[0].GeoObject.Point
            .pos;

        let q = tempPos.split(" ");

        let nums: number[] = [];

        q.forEach((value) => {
          nums.unshift(Number(value));
        });

        setNewCoordinats(nums);
        setFindAddress(true);

        for (let i = 0; i < listDriver.length; i++) {
          listDriver[i].data.crews_info.lat = nums[0] + lat[i];
          listDriver[i].data.crews_info.lon = nums[1] + lon[i];
        }

        let searchResult: SearchFunction = {
          source_time: GetTime(),
          addresses: {
            address:
              result.response.GeoObjectCollection.featureMember[0].GeoObject
                .name,
            lat: nums[0],
            lon: nums[1],
          },
        };
      } else if (inputSearch.length > 0) {
        setShowError(true);
        setErrorMessage("Адрес не найден!");

        if (refButton !== null && refButton.current !== null) {
          refButton.current.disabled = true;
        }
        setFindAddress(false);
      }
    }

    setLat([
      Math.random() * -0.5 + Math.random() * 0.5,
      Math.random() * -0.5 + Math.random() * 0.5,
      Math.random() * -0.5 + Math.random() * 0.5,
    ]);
    setLon([
      Math.random() * -0.5 + Math.random() * 0.5,
      Math.random() * -0.5 + Math.random() * 0.5,
      Math.random() * -0.5 + Math.random() * 0.5,
    ]);
  };

  useEffect(() => {
    if (refButton.current?.disabled) {
      setShowError(false);
      refButton.current.disabled = false;
      setFindAddress(false);
    }
  }, [inputSearch]);


  return (
    <Container maxWidth="md" className="pt-2">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b pb-1 mb-4"
      >
        Детали заказа
      </motion.h1>

      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <section className="relative">
          <From
            inputSearchProps={inputSearch}
            setInputSearchProps={setInputSearch}
            refInputProps={refInput}
          />
          <AnimatePresence>
            {showError && (
              <motion.h1
                key="error-message"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 60 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, y: -50 }}
                className="text-[red] border border-[red] max-md:bottom-12 md:absolute relative max-md:m-auto md:bottom-0 md:right-[20%] rounded-md px-3 py-2 w-fit"
              >
                {errorMessage}
              </motion.h1>
            )}
          </AnimatePresence>
        </section>

        <CallTaxi />
        <MapComponent
          inputSearchProps={inputSearch}
          setInputSearchProps={setInputSearch}
          coodinatsProps={newCoordinats}
          findAddressProps={findAddress}
          latProps={lat}
          lonProps={lon}
          setFindAddressProps={setFindAddress}
        />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <Button
            ref={refButton}
            onClick={() => handleClickOrder()}
            className="w-[300px] max-md:w-full mb-4"
            color="success"
            variant="outlined"
          >
            Заказать
          </Button>
        </motion.div>
      </Box>
    </Container>
  );
}

function GetTime() {
  let year = new Date().getFullYear().toString();
  let month = (new Date().getMonth() + 1).toString();
  let day = new Date().getDate().toString();
  let hour = new Date().getHours().toString();
  let minutes = new Date().getMinutes().toString();
  let seconds = new Date().getSeconds().toString();

  let newTime =
    year +
    (month.length === 1 ? "0" + month : month) +
    (day.length === 1 ? "0" + day : day) +
    (hour.length === 1 ? "0" + hour : hour) +
    (minutes.length === 1 ? "0" + minutes : minutes) +
    (seconds.length === 1 ? "0" + seconds : seconds);

  return newTime;
}
