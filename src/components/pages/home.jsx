import Navbar from "../Header";
import HeroSection from "../welcome";
import MissionVision from "../visionMission";
import ChampionsSection from "../champions";
import StatsSection from "../counter";
import TestimonialsSlider from "../comments";
import GetInvolved from "../getInvolved";
import SponsorsSection from "../sponsorSection";
import SupportComponent from "../pages/supportComponent"
import Footer from "../Footer";

function App() {
  return (
    <>
      <Navbar/>
      <HeroSection />
      <MissionVision />
      <ChampionsSection />
      <StatsSection />
      <TestimonialsSlider />
      <GetInvolved />
      <SupportComponent />
      <SponsorsSection />
      <Footer />
    </>
  );
}

export default App;
