import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import CardList from '../components/searchroom/CardList';
import Sidebar from '../components/searchroom/SideBar';
import { publicRequest } from '../api/customAxios';
import Swal from 'sweetalert2';

const SearchRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log('🔍 location.state:', location.state);

  // travelPlans 프로퍼티 없이 바로 rooms 배열 사용
  const initialRooms = location.state?.rooms?.travelPlans || [];

  console.log('✅ rooms 데이터 확인:', initialRooms);
  const [rooms, setRooms] = useState(initialRooms);
  // Sidebar 필터링 결과를 관리하는 상태
  const [filteredRooms, setFilteredRooms] = useState(initialRooms);
  // 추가: 도착 도시 필터 상태 (기본: 전체보기)
  const [selectedArrivalCity, setSelectedArrivalCity] = useState('전체보기');

  // state가 없는 경우 API 호출하여 데이터 불러오기 (limit 파라미터를 추가)
  useEffect(() => {
    if (rooms.length === 0) {
      const fetchTravelPlans = async () => {
        try {
          const response = await publicRequest.get('/api/v1/travel-plans');
          if (response.status === 200 && response.data?.data?.travelPlans) {
            console.log('📦 여행방 데이터:', response.data.data.travelPlans);
            setRooms(response.data.data.travelPlans);
            setFilteredRooms(response.data.data.travelPlans);
          } else {
            console.error('🚨 여행방 데이터 형식 오류:', response.data);
          }
        } catch (error) {
          console.error('🚨 여행방 전체 조회 실패:', error);
          Swal.fire(
            '알림',
            '🚨 여행방 데이터를 불러오는 중 오류가 발생했습니다.',
            'error',
          );
        }
      };
      fetchTravelPlans();
    }
  }, [rooms]);

  const statusMap = {
    IN_PROGRESS: '진행중',
    BIDDING: '요청중',
    BOOKING: '예약중',
    CONFIRMED: '여행확정',
  };

  // Sidebar에서 받은 필터 조건(여행 테마, 방 상태)에 따른 필터링
  const handleFilter = (themes, states) => {
    let filtered = [...rooms];

    // 여행 테마 필터링 (undefined 체크 추가)
    if (!themes.includes('전체보기')) {
      filtered = filtered.filter(
        (room) =>
          Array.isArray(room.keywords) &&
          room.keywords.some((keyword) => themes.includes(keyword.name)),
      );
    }

    // 방 상태 필터링 (statusMap을 활용하여 비교)
    if (!states.includes('전체보기')) {
      filtered = filtered.filter((room) =>
        states.includes(statusMap[room.planningStatus] || '기타'),
      );
    }

    setFilteredRooms(filtered);
  };

  // 최종 필터링: 기존 필터링 결과(filteredRooms)에서 도착 도시 필터 적용
  const finalFilteredRooms = filteredRooms.filter((room) =>
    selectedArrivalCity === '전체보기'
      ? true
      : room.arrivalCity?.name === selectedArrivalCity,
  );

  // 도착 도시 옵션 생성 (rooms 배열에서 유니크한 도착 도시 이름 추출)
  const uniqueArrivalCities = Array.from(
    new Set(rooms.map((room) => room.arrivalCity?.name).filter(Boolean)),
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar onFilter={handleFilter} />
        <div className="flex-1 p-4">
          {/* 오른쪽 상단에 도착 도시 필터 선택창 추가 */}
          <div className="flex justify-end mb-4">
            <select
              value={selectedArrivalCity}
              onChange={(e) => setSelectedArrivalCity(e.target.value)}
              className="p-2 mr-6 border rounded"
            >
              <option value="전체보기">전체보기</option>
              {uniqueArrivalCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          {/* 필터링된 결과를 CardList에 전달 */}
          <CardList cards={finalFilteredRooms} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchRoom;
