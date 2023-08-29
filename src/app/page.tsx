"use client";

import { Box, Button, Container, TextField } from "@mui/material";
import CallTaxi from "@/components/CallTaxi";
import From from "@/components/From";
import MapComponent from "@/components/MapComponent";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SendButton from "@/components/SendButton";

export default function Home() {
  const [inputSearch, setInputSearch] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Ошибка, поле обязательное");
  const [newCoordinats, setNewCoordinats] = useState<number[]>([
    55.7636, 37.61907,
  ]);
  const [findAddress, setFindAddress] = useState(false);

  const refInput = useRef<HTMLDivElement>(null);
  const [lat, setLat] = useState<number[]>([
    Math.random() * 0.1,
    Math.random() * 0.1,
    Math.random() * 0.1,
  ]);
  const [lon, setLon] = useState<number[]>([
    Math.random() * 0.1,
    Math.random() * 0.1,
    Math.random() * 0.1,
  ]);

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

        <CallTaxi findAddress={findAddress} />
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
          <SendButton
            inputSearch={inputSearch}
            setErrorMessage={setErrorMessage}
            setFindAddress={setFindAddress}
            setLat={setLat}
            setLon={setLon}
            setNewCoordinats={setNewCoordinats}
            setShowError={setShowError}
            showError={showError}
            lat={lat}
            lon={lon}
          />
        </motion.div>
      </Box>
    </Container>
  );
}
