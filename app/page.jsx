'use client';

import React from "react";
import Home from "../src/containers/home/Home";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Page() {
  return <Home />;
}
