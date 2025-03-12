import React from "react";
import { ClipLoader } from "react-spinners";

const PageLoader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-vio">
      <ClipLoader
        color="#7f22fe"
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default PageLoader;
