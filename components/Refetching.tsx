/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KTuY72HiLeT
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState, useEffect } from "react";

export default function Refetching() {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    let interval: any;
    const startProgress = () => {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            return 0;
          }
          return prevProgress + 10;
        });
      }, 500);
    };
    setIsActive(true);
    startProgress();
    return () => {
      clearInterval(interval);
      setIsActive(false);
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-2 overflow-hidden bg-muted">
      <div
        className={`h-full bg-primary transition-all duration-500 ease-in-out ${
          isActive ? "w-[100%]" : "w-[0%]"
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
