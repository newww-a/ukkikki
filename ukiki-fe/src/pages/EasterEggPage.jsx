import { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import monkey from '../assets/dancing-monkey.gif';
const EasterEgg = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <img src={monkey} />
    </div>
  );
};

export default EasterEgg;
