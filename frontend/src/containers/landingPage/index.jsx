import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/hero/hero';
import Footer from './components/footer/footer';
import ToolIntegration from './components/toolIntegration/toolIntegration';
import RackInsights from './components/rackInsights/rackInsights';
import Co2Overview from './components/co2Overview/co2Overview';
import Newsletter from './components/newsletter/newsLetter';
import './index.css';
import Faqs from './components/faqs/faqs';
import { Outlet } from 'react-router-dom';
import AboutUsHero from './components/hero/aboutUsHero';
import DCIM from './components/dcim/dcim';
import TwoMinDrill from './components/2minDrill/2minDrill';
import WhyGreenX from './components/whyGrennX/whyGreenX';
import ComprehensiveSolution from './components/comprehensiveSolution/comprehensiveSolution';
import AutomateGuide from './components/automateGuide/automateGuide';
import DataManagement from './components/dataManagment/dataManagment';
import GreenXAutomation from './components/greenXAutomation/greenXAutomation';
import dataSheetIcon from './assets/nextStepGreenX/data-sheet-icon.svg'
import interactiveIcon from './assets/nextStepGreenX/interative-icon.svg'
import scrrenshotIcon from './assets/nextStepGreenX/screenshots-icon.svg'
import testDriveIcon from './assets/nextStepGreenX/test-drive-login.svg'





const LandingPageLayout = () => {
  const maxWidth = '2000px';
  return (
    <div style={{ maxWidth, width: 'calc(100vw - 5px)' }}>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default LandingPageLayout;

export const HomePage = () => (
  <>
    <Hero />
    <ToolIntegration />
    <RackInsights />
    <Co2Overview />
    <Faqs />
    <Newsletter />
  </>
);

export const AboutUsPage = () => (
  <>
    <AboutUsHero />
    <DCIM />
    <TwoMinDrill />
    <WhyGreenX />
    <ComprehensiveSolution />
    <AutomateGuide />
    <DataManagement />
    <GreenXAutomation />
  </>
);

const features =[
  {
    title: 'Get a test drive login',
    description: 'Explore a full-featured GreenX DCS demo system. ',
    icon: testDriveIcon,
  },
  {
    title: 'Download data sheet',
    description: 'Get an overview of our modern DCS solution.',
    icon: dataSheetIcon,
  },
  {
    title: 'Browse screenshots',
    description: 'See real product screenshots of capacity management and more.',
    icon: scrrenshotIcon,
  },
  {
    title: 'Try an interactive tour',
    description: 'Get a self-guided demo of popular capacity management features.',
    icon: interactiveIcon,
  },
];

export const SolutionPage = () => (
  <>
    <AboutUsHero
      header="Capacity"
      para="Know the capacity of all infrastructure resources at a<br/> click."
    />
    <TwoMinDrill
      header="Provisioning is now 1000x easier"
      para="Quickly find the ideal cabinet by model, size, type, or function, and view precise RU<br/> placements for seamless deployment."
    />
    <WhyGreenX
      header="Take the next step with<br/> GreenX. Try it free."
      para ='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod<br/> tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, '
      features={features}
    />
  </>
);
