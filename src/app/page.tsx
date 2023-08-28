"use client";

import { Box, Button, Container, TextField } from "@mui/material";
import CallTaxi from "@/components/CallTaxi";
import From from "@/components/From";
import MapComponent from "@/components/MapComponent";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function Home() {
  const [inputSearch, setInputSearch] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Ошибка, поле обязательное");
  const [newCoordinats, setNewCoordinats] = useState<number[]>([
    55.7636, 37.61907,
  ]);

  const refInput = useRef<HTMLDivElement>(null);

  const handleClickOrder = async () => {
    let temp = inputSearch.split(" ");

    let addressFind = temp.join("+");

    if (inputSearch.trim().length === 0 && !showError) {
      setShowError(true);
      setErrorMessage("Ошибка, поле обязательное");

      let inputSearch = document.getElementById("outlined-basic");

      if (inputSearch !== null) {
        inputSearch.style.borderColor = "red";
      }

      setTimeout(() => {
        if (inputSearch !== null) {
          inputSearch.style.borderColor = "";
        }

        setShowError(false);
      }, 3000);
    } else {
      const result = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=af0b612c-3347-499e-8a03-56e935f7da01&geocode=+${addressFind}&format=json`
      )
        .then((response) => response.json())
        .then((data: ResultRequest) => data);

      console.log(
        await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=af0b612c-3347-499e-8a03-56e935f7da01&geocode=+${addressFind}&format=json`
        )
      );

      if (result.response.GeoObjectCollection.featureMember.length >= 1) {
        console.log(result);
        console.log(result.response.GeoObjectCollection.featureMember);
        let tempPos =
          result.response.GeoObjectCollection.featureMember[0].GeoObject.Point
            .pos;

        let q = tempPos.split(" ");

        let nums: number[] = [];

        q.forEach((value) => {
          nums.unshift(Number(value));
        });

        setNewCoordinats(nums);
      } else if (inputSearch.length > 0) {
        setShowError(true);
        setErrorMessage("Адрес не найден!");

        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    }
  };
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
                className="text-[red] border border-[red] absolute bottom-0 right-[20%] rounded-md px-3 py-2 w-fit"
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
          PropsCoodinats={newCoordinats}
        />
        <motion.div initial={{opacity: 0, y: 100}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3}} className="text-center">
          <Button
            onClick={() => handleClickOrder()}
            className="w-[300px]"
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
