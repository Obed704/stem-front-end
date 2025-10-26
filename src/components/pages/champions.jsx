import Navbar from "../Header";
import Banner from "../bannerChampion";
import ChampionsSection from "../championsSection";
import Gallery from "../gallery";
import Footer from "../Footer";

function WomenInStem() {
  return (
    <>
      <Navbar bg="bg-black" />
    <Banner/>
     <ChampionsSection/>
     <Gallery/>
      <Footer />
    </>
  );
}

export default WomenInStem;
