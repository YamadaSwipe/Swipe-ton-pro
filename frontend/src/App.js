import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Components } from "./components";

const {
  Header,
  Hero,
  HowItWorks,
  WhyChooseUs,
  ProfessionalCategories,
  PricingPlans,
  Testimonials,
  MobileApp,
  Footer,
  OnSwipeForYou
} = Components;

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <Hero />
      <HowItWorks />
      <WhyChooseUs />
      <ProfessionalCategories />
      <PricingPlans />
      <OnSwipeForYou />
      <Testimonials />
      <MobileApp />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;