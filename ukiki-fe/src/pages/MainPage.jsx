import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import HeroSection from '../components/main/HeroSection';
import PartnerBrandSlider from '../components/main/PartnerBrandSlider';
import TravelPackageCarousel from '../components/main/TravelPackageCarousel';
import axios from 'axios';

const Home = () => {
  return (
    <div>
      <Header />

      <HeroSection />
      <TravelPackageCarousel />
      <PartnerBrandSlider />
      <Footer />
    </div>
  );
};

export default Home;
