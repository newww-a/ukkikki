import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../../api/customAxios';
import Swal from 'sweetalert2';

// 화살표 커스터마이징 컴포넌트
const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-brown text-white p-3 rounded-full shadow-lg focus:outline-none"
    onClick={onClick}
  >
    &#9664;
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-brown text-white p-3 rounded-full shadow-lg focus:outline-none"
    onClick={onClick}
  >
    &#9654;
  </button>
);

const TravelPackageCarousel = () => {
  const navigate = useNavigate();
  const [travelPlans, setTravelPlans] = useState([]);

  // ✅ API 호출하여 여행방 데이터를 가져오기
  useEffect(() => {
    const fetchTravelPlans = async () => {
      try {
        const response = await publicRequest.get('/api/v1/travel-plans/all');
        if (response.status === 200 && response.data?.data?.travelPlans) {
          setTravelPlans(response.data.data.travelPlans);
        } else {
          console.error('🚨 여행방 데이터 형식 오류:', response.data);
        }
      } catch (error) {
        console.error('🚨 여행방 전체 조회 실패:', error);
      }
    };
    fetchTravelPlans();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleViewDetails = async () => {
    try {
      const response = await publicRequest.get('/api/v1/travel-plans');
      if (!response.data || !Array.isArray(response.data.data.travelPlans)) {
        throw new Error('🚨 API 응답이 올바르지 않습니다.');
      }

      navigate('/search-room', {
        state: { rooms: { travelPlans: response.data.data.travelPlans } },
      });
    } catch (error) {
      console.error('🚨 여행방 전체 조회 실패:', error);
      Swal.fire(
        '알림',
        '🚨 여행방 데이터를 불러오는 중 오류가 발생했습니다.',
        'error',
      );
    }
  };

  return (
    <div className="relative w-full">
      {/* ✅ 배경 레이어 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D9D9D9] via-[#C5C3B1] to-[#412B2B] opacity-50"></div>

      {/* ✅ 컨텐츠 영역 */}
      <div className="relative flex flex-col items-center justify-between w-full px-8 py-16 md:flex-row">
        {/* 왼쪽 텍스트 */}
        <div className="w-full pl-16 text-center md:w-1/3 md:text-left text-brown">
          <h2 className="text-3xl font-bold leading-snug">
            색다른 여행을 떠날
            <br /> 우랑이를 모집합니다
          </h2>
          <button
            className="px-6 py-3 mt-6 text-lg font-semibold text-white rounded-full shadow-md bg-brown"
            onClick={handleViewDetails}
          >
            자세히 알아보기 →
          </button>
        </div>

        {/* 오른쪽 캐러셀 */}
        <div className="w-full mt-10 md:w-2/3 md:mt-0">
          <div data-aos="fade-left" data-aos-delay="300">
            <Slider {...settings}>
              {travelPlans.map((plan) => {
                const cityId = plan.arrivalCity?.cityId;
                // S3에서 이미지 URL 생성
                const imageUrl = `https://ukkikki-bucket.s3.ap-northeast-2.amazonaws.com/city/${cityId}.jpg`;
                return (
                  <div key={plan.travelPlanId} className="p-4">
                    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                      <img
                        src={imageUrl}
                        alt={plan.name}
                        className="object-cover w-full h-48"
                        onError={(e) => {
                          e.target.onerror = null; // 무한 반복 방지
                          e.target.src =
                            'https://ukkikki-bucket.s3.ap-northeast-2.amazonaws.com/placeholder.jpg';
                        }}
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {plan.departureCity?.name} → {plan.arrivalCity?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPackageCarousel;
