import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ukiki from '../../assets/logo.png';
import partner1 from '../../assets/partner1.png';
import partner2 from '../../assets/partner2.png';
import partner3 from '../../assets/partner3.png';
import partner4 from '../../assets/partner4.png';
import partner5 from '../../assets/partner5.png';
import partner6 from '../../assets/partner6.png';
import partner7 from '../../assets/partner7.png';
import partner8 from '../../assets/partner8.png';
const brands = [
  { id: 1, name: 'Brand A', logo: partner1 },
  { id: 2, name: 'Brand B', logo: partner2 },
  { id: 3, name: 'Brand C', logo: partner3 },
  { id: 4, name: 'Brand D', logo: partner4 },
  { id: 5, name: 'Brand E', logo: partner5 },
  { id: 6, name: 'Brand F', logo: partner6 },
  { id: 7, name: 'Brand G', logo: partner7 },
  { id: 8, name: 'Brand H', logo: partner8 },
];

const PartnerBrandSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 5000, // 슬라이드가 한 번 이동하는데 걸리는 시간
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // 대기 시간 없이 바로 슬라이드 전환
    cssEase: 'linear', // 선형 애니메이션
    responsive: [
      {
        breakpoint: 768, // 태블릿 크기 이하
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  return (
    <div className="px-6 py-8 text-center partner-slider">
      {/* ✅ 제휴업체 소개 제목 (둥근 직사각형을 중앙에 배치) */}
      <div className="inline-block px-6 py-3 mx-auto mt-16 text-lg font-bold text-white shadow-md bg-brown rounded-3xl">
        제휴업체 소개
      </div>

      {/* ✅ 추가 문구 */}
      <h1 className="flex items-center justify-center my-16 text-2xl font-bold text-gray-700">
        <img src={ukiki} /> 와 함께하는 사육사를 소개합니다.
      </h1>

      {/* ✅ 브랜드 슬라이더 */}
      <Slider {...settings} className="my-16">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex items-center justify-center w-40 h-40 p-4 rounded-lg"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PartnerBrandSlider;
