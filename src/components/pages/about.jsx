import Navbar from "../Header";
import SistersCard from "../sisters";
import TeamSection from "../team";
import SponsorsSection from "../sponsorSection";
import Footer from "../Footer";

function About() {
  return (
    <>
      <Navbar bg="bg-black" />
      <SistersCard/>
      <TeamSection/>
      <SponsorsSection/>
      <Footer />
    </>
  );
}

export default About;
