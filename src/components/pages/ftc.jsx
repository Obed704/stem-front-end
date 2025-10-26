import Navbar from "../Header";
import Footer from "../Footer";
import FTCLanding from "../ftc-welcome";
function FtcPage() {
  return (
    <div className="bg-gray-400">
      <Navbar bg="bg-black" />
      <FTCLanding/>
      <Footer />
    </div>
  );
}

export default FtcPage;
