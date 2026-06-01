import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";
import Footer from "@/components/Footer";

export default function SiteLayout() {
  return (
    <>
      <TopBar />
      <Header />
      <BreakingTicker />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
