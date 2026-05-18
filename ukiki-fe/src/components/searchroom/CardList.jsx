
import useRoomModal from './useRoomModal';
import RoomModal from './RoomModal';
import logo from '../../assets/loading-spinner.png';
import { useNavigate } from 'react-router-dom';
import { STATUS_MAP, THEME_COLORS, STATUS_STYLES } from '../../constants';
import Swal from 'sweetalert2';

const CardList = ({ cards }) => {
  const navigate = useNavigate();

  // useRoomModal 커스텀 훅 사용
  const {
    isModalOpen,
    currentStep,
    selectedCard,
    people,
    openModal,
    closeModal,
    nextStep,
    prevStep,
    handlePeopleChange,
    handleIncrement,
    handleDecrement,
    handleComplete,
  } = useRoomModal();

  if (!Array.isArray(cards) || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full mt-16 space-y-4">
        <img src={logo} alt="바나나 로고" className="w-16 h-16" />
        <p className="text-center text-gray-500">
          검색 결과가 없습니다. <br />
          다른 조건으로 검색해보세요.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 mt-4 text-white rounded-md bg-brown hover:bg-yellow hover:text-brown hover:font-bold"
        >
          메인페이지로 가기
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 카드 리스트 */}
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col justify-between h-full p-6 bg-white border border-gray-200 rounded-md shadow-lg"
          >
            <div className="relative">
              <span
                className={`absolute top-6 left-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  STATUS_STYLES[card.planningStatus] || 'bg-gray-400 text-white'
                }`}
              >
                {STATUS_MAP[card.planningStatus] || '상태 없음'}
              </span>

              <img
                src={`https://ukkikki-bucket.s3.ap-northeast-2.amazonaws.com/city/${card.arrivalCity.cityId}.jpg`}
                alt={card.country}
                className="object-cover w-full h-64 mt-4 rounded-lg shadow-md"
                onError={(e) => {
                  e.target.onerror = null; // 무한 반복 방지
                  e.target.src =
                    'https://ukkikki-bucket.s3.ap-northeast-2.amazonaws.com/placeholder.jpg';
                }}
              />
            </div>

            <div className="flex flex-col flex-grow mt-4 space-y-4">
              {/* 방 제목 */}
              <h3 className="text-xl font-bold truncate">{card.name}</h3>

              {/* 모집 진행률 바 */}
              <div className="flex flex-col mt-4 space-y-2">
                <div className="w-full h-4 overflow-hidden bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-yellow"
                    style={{
                      width: `${
                        card.minPeople > 0 && card.currentParticipants
                          ? Math.min(
                              (card.currentParticipants / card.minPeople) * 100,
                              100,
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm font-medium text-gray-600">
                  <span>최소 인원: {card.minPeople}명</span>
                  <span>최대 인원: {card.maxPeople}명</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  현재 인원: {card.currentParticipants}명
                </span>
              </div>

              {/* 여행 도시 */}
              <p className="text-black">
                <strong>여행지:</strong> {card.arrivalCity.name}
              </p>
              {/* 여행 날짜 */}
              <p className="text-black">
                <strong>여행 날짜:</strong> {card.startDate} ~ {card.endDate}
              </p>

              {/* 여행 테마 (키워드) */}
              <div className="flex flex-wrap gap-2 mb-4">
                <strong>여행 테마:</strong>
                {card.keywords && card.keywords.length > 0 ? (
                  card.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        THEME_COLORS[keyword.name] || 'bg-gray-500 text-white'
                      }`}
                    >
                      {keyword.name}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 text-sm font-semibold text-gray-500 rounded-full">
                    테마 없음
                  </span>
                )}
              </div>
            </div>

            {/* 버튼: 자세히 보기 => 모달 열기 */}
            <button
              className="px-4 py-2 mt-4 text-white rounded-md bg-brown hover:bg-yellow hover:text-brown hover:font-bold"
              onClick={() => {
                if (card.hasJoined) {
                  navigate(`/user-room/${card.travelPlanId}`, {
                    state: { selectedCard: card },
                  });
                } else {
                  if (card.currentParticipants >= card.maxPeople) {
                    Swal.fire('알림', '최대 인원을 초과했습니다.', 'warning');
                    return;
                  }
                  openModal(card);
                }
              }}
            >
              자세히 보기
            </button>
          </div>
        ))}
      </div>

      {/* 2단계 모달 */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        step={currentStep}
        totalSteps={2}
        onNext={nextStep}
        onPrev={prevStep}
        selectedCard={selectedCard}
        people={people}
        handlePeopleChange={handlePeopleChange}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onComplete={handleComplete}
      />
    </>
  );
};

export default CardList;
