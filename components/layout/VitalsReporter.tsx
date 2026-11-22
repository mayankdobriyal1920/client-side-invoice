"use client";

import { useEffect } from "react";
import { reportWebVitals } from "@/lib/vitals";

export default function VitalsReporter() {
  useEffect(() => {
    reportWebVitals();
  }, []);
  return null;
}