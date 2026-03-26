import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/Home/Home";
import PublishEditorial from "./components/Services/PublishEditorial";
import Footer from "./components/footer/Footer";
import AcademicEdu from "./components/Services/AcademicEdu";
import PremiumPackaging from "./components/Services/PremiumPackaging";
import SaddleBooklet from "./components/Services/SaddleBooklet";



const App = () => {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/"element={<Home />} />
        <Route path="/services/publish-editorial" element={<PublishEditorial />} />
        <Route path="/services/academic-educational" element={<AcademicEdu/>}/>
        <Route path="/services/premium-packaging" element={<PremiumPackaging/>}/>
        <Route path="/services/publish-editorial/saddle-booklet" element={<SaddleBooklet/>}/>
        {/* <Route path="/services/publish-editorial/coffee-table-book" element={<div>Coffee Table Book Page</div>} />
        <Route path="/services/publish-editorial/perfect-bound-booklet" element={<div>Perfect Bound Booklet Page</div>} />
        <Route path="/services/publish-editorial/spiral-comb-coil-booklet" element={<div>Spiral / Wire-o Booklet Page</div>} />
        <Route path="/services/publish-editorial/hard-cover-booklet" element={<div>Hard Cover Booklet Page</div>} /> */}

      </Routes>
      <Footer/>
    </BrowserRouter>
  );
};

export default App;