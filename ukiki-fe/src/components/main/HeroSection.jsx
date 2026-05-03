import React from 'react';
import background from '../../assets/home_image.png';
import SearchBar from './SearchBar';
import SloganText from '../common/SloganText';

const HeroSection = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col md:flex-row items-center md:px-28 py-10"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* 왼쪽 텍스트 */}
      <SloganText textColor="text-white" />

      {/* 오른쪽 검색바 */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end fade-in-right">
        <SearchBar className="w-full max-w-lg" />
      </div>
    </div>
  );
};

export default HeroSection;
