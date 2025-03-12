import React from "react";
import { PulseLoader } from "react-spinners";

const BtnLoader = () => {
  return (
    <PulseLoader
      color="#ffffff"
      size={5}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default BtnLoader;
