import { TextField } from "@mui/material";
import React from "react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { motion } from "framer-motion";

interface PropsFrom {
  inputSearchProps: string;
  setInputSearchProps: React.Dispatch<React.SetStateAction<string>>;
  refInputProps: React.RefObject<HTMLDivElement>;
}

export default function From({
  inputSearchProps,
  setInputSearchProps,
  refInputProps,
}: PropsFrom) {
  const changeValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputSearchProps(e.currentTarget.value);
  };
  return (
    <motion.div initial={{opacity: 0, x: -100}} animate={{opacity: 1, x: 0}} transition={{duration: 0.3}} className="flex max-w-xl m-auto items-center gap-4 w-full">
      <h1 className={inter.className}>Откуда</h1>
      <TextField
        ref={refInputProps}
        fullWidth
        id="outlined-basic"
        label="Введите адрес"
        variant="outlined"
        onChange={(e) => changeValue(e)}
        value={inputSearchProps}
      />
    </motion.div>
  );
}
