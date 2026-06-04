import { useNavigate } from 'react-router-dom'; // React Router 사용
import { publicRequest } from '../../api/customAxios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const ProgressBar = ({ step, totalSteps }) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="mb-4">
      <div className="relative w-full h-4 overflow-hidden bg-gray-200 rounded-full">
        <motion.div
          className="h-full rounded-full bg-yellow"
          initial={{ width: `${((step - 1) / totalSteps) * 100}%` }} // 이전 단계의 진행률로 초기 상태 설정
          animate={{ width: `${progress}%` }} // 현재 단계의 진행률로 애니메이션
          transition={{ duration: 0.5, ease: 'easeInOut' }} // 부드러운 전환 효과
        />
      </div>
      <div className="flex justify-end mt-2 text-sm text-gray-600">
        단계 {step} / {totalSteps}
      </div>
    </div>
  );
};

function RoomModal({
  isOpen,
  onClose,
  step,
  totalSteps,
  onNext,
  onPrev,
  selectedCard,
  people,
  handlePeopleChange,
  onIncrement,
  onDecrement,
  onComplete,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 입장하기 버튼 클릭 시 UserRoom으로 이동
  const handleEnterRoom = async () => {
    if (!selectedCard || !selectedCard.travelPlanId) {
      Swal.fire('알림', '🚨 여행방 정보를 찾을 수 없습니다.', 'error');
      return;
    }

    const totalPeople = people.adult + people.child + people.infant;
    if (totalPeople === 0) {
      Swal.fire(
        '알림',
        '🚨 최소 한 명 이상의 인원을 선택해야 합니다.',
        'warning',
      );
      return;
    }
    // 최대 인원 초과 체크 (selectedCard.maxPeople: 최대 허용 인원)
    if (
      totalPeople + selectedCard.currentParticipants >
      selectedCard.maxPeople
    ) {
      Swal.fire(
        '알림',
        `최대 ${
          selectedCard.maxPeople - selectedCard.currentParticipants
        }명을 초과할 수 없습니다.`,
        'warning',
      );
      return;
    }
    const travelPlanId = selectedCard.travelPlanId;
    const requestBody = {
      adultCount: people.adult,
      childCount: people.child,
      infantCount: people.infant,
    };

    try {
      const response = await publicRequest.post(
        `/api/v1/travel-plans/${travelPlanId}`,
        requestBody,
      );
      console.log('✅ 여행방 입장 성공:', response.data);
      console.log('📌 넘겨지는 selectedCard:', response.data.data.travelPlan);
      // 입장 API 호출 성공 시, 좋아요 수 알림(최대 10명 반영)
      const likeCount = Math.min(totalPeople, 10);

      navigate(`/user-room/${response.data.data.travelPlan.travelPlanId}`, {
        state: { selectedCard: response.data.data.travelPlan, likeCount },
      });
    } catch (error) {
      console.error('🚨 여행방 입장 실패:', error);
      Swal.fire('알림', '🚨 여행방 입장 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-lg p-6 bg-white shadow-lg rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between pb-2 mb-5 border-b-2">
          <h1 className="pb-2 text-xl font-semibold border-gray-300">
            {step === 1 ? '방 정보 확인' : '인원 입력'}
          </h1>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* 1단계: 방 정보 확인 */}
        {step === 1 && selectedCard && (
          <div>
            <p className="mb-2">
              <strong>방 이름:</strong> {selectedCard.name}
            </p>
            <p className="mb-2">
              <strong>출발 도시 :</strong> {selectedCard.departureCity.name}
            </p>
            <p className="mb-2">
              <strong>도착 도시 :</strong> {selectedCard.arrivalCity.name}
            </p>
            <p className="mb-2">
              <strong>여행 날짜:</strong> {selectedCard.startDate} ~{' '}
              {selectedCard.endDate}
            </p>
            <div className="mt-6">
              <ProgressBar step={step} totalSteps={totalSteps} />
              <div className="flex justify-between space-x-2">
                <button
                  className="px-4 py-2 text-white bg-gray-400 rounded-md"
                  onClick={onClose}
                >
                  닫기
                </button>
                <button
                  className="px-4 py-2 text-white rounded-md bg-brown"
                  onClick={onNext}
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2단계: 인원 입력 */}
        {step === 2 && (
          <div>
            <div className="space-y-4">
              {['adult', 'child', 'infant'].map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <label className="font-medium text-gray-700 capitalize">
                    {type === 'adult'
                      ? '성인'
                      : type === 'child'
                      ? '아동'
                      : '유아'}
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => onDecrement(type)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={people[type]}
                      onChange={(e) =>
                        handlePeopleChange(type, Number(e.target.value))
                      }
                      className="w-20 p-2 text-center border border-gray-300 rounded-md"
                      min={0}
                    />
                    <button
                      className="px-3 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => onIncrement(type)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* 총 인원 수 표시 */}
            <div className="mt-4 text-lg font-semibold text-center text-gray-800">
              총 인원: {people.adult + people.child + people.infant}명
            </div>
            <div className="mt-6">
              <ProgressBar step={step} totalSteps={totalSteps} />
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 text-white bg-gray-400 rounded-md"
                  onClick={onPrev}
                >
                  이전
                </button>
                <button
                  className="px-4 py-2 text-white rounded-md bg-brown"
                  onClick={handleEnterRoom}
                >
                  입장하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomModal;
