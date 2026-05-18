import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import logo from '../assets/loading-spinner.png';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../api/customAxios';
import MyRoomCard from '../components/mypage/myroom/MyRoomCard';
import { STATUS_MAP } from '../constants';

// 필터 옵션 정의
const FILTER_OPTIONS = [
  { label: '전체보기', status: null },
  { label: STATUS_MAP.IN_PROGRESS, status: 'IN_PROGRESS' },
  { label: STATUS_MAP.BIDDING, status: 'BIDDING' },
  { label: STATUS_MAP.BOOKING, status: 'BOOKING' },
  { label: STATUS_MAP.CONFIRMED, status: 'CONFIRMED' },
];

const MyRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // status가 존재하면 파라미터로 전달, 없으면 빈 객체
        const params = selectedFilter.status
          ? { status: selectedFilter.status }
          : {};
        const response = await publicRequest.get(
          '/api/v1/travel-plans/my-search',
          { params },
        );

        console.log('📌 API 응답:', response.data.data.travelPlans);

        if (response.status === 200 && response.data?.data?.travelPlans) {
          setRooms(response.data.data.travelPlans);
        } else {
          console.error(
            '❌ 응답 데이터가 배열이 아닙니다.',
            response.data.data.travelPlans,
          );
        }
      } catch (error) {
        console.error('❌ 참여 중인 방 목록 불러오기 실패:', error);
      }
    };

    fetchRooms();
  }, [selectedFilter]);

  const handleFilterChange = (option) => {
    setSelectedFilter(option);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* 메인 컨테이너 */}
      <div className="max-w-screen-xl px-6 py-10 mx-auto">
        <div className="flex items-center justify-center mb-8">
          {/* 가운데: 필터 옵션 */}
          {/* 수정 후 */}
          <div className="flex justify-center mb-8">
            <div className="flex justify-center space-x-8">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleFilterChange(option)}
                  className={`relative py-2 text-sm font-medium transition-colors ${
                    selectedFilter.label === option.label
                      ? 'text-brown'
                      : 'text-gray-500 hover:text-brown'
                  }`}
                >
                  {option.label}
                  {selectedFilter.label === option.label && (
                    <div className="absolute left-0 bottom-0 w-full h-0.5 bg-brown"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 카드 목록 영역 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <MyRoomCard key={room.travelPlanId} room={room} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center mt-16 space-y-4 col-span-full">
              <img src={logo} alt="바나나 로고" className="w-16 h-16" />
              <p className="text-center text-gray-500">
                아직 참여한 방이 없습니다. <br />
                관심있는 방을 찾아보세요!
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 mt-4 text-white rounded-md bg-brown hover:bg-yellow hover:text-brown hover:font-bold"
              >
                여행방 찾으러가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRoomsPage;
