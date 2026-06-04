import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicRequest } from '../../api/customAxios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateRoomModal = ({ isOpen, onClose, travelData }) => {
  // travelData: { departureCityId, arrivalCityId, startDate, endDate }
  const [step, setStep] = useState(1);
  const [roomData, setRoomData] = useState({
    title: '',
    minPeople: '',
    maxPeople: '',
    selectedKeywords: [], // 선택된 키워드 객체 배열 (예: { id: 1 })
    adults: 0,
    teens: 0,
    kids: 0,
  });
  const [keywordList, setKeywordList] = useState([]); // 전체 키워드 목록
  const navigate = useNavigate();

  // 모달 마운트 시 전체 키워드 조회
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await publicRequest.get(
          '/api/v1/travel-plans/keywords',
        );
        // 응답 구조에 맞춰서, 키워드 배열을 response.data.data.keywords에서 추출
        setKeywordList(response.data.data.keywords || []);
      } catch (error) {
        console.error('키워드 조회 실패:', error);
      }
    };

    fetchKeywords();
  }, []);

  // 1단계 입력 핸들러 (방 제목, 최소/최대 인원)
  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  // 1단계 → 2단계 이동 핸들러
  const handleNextStep = () => {
    // 모든 필수 항목이 입력되었는지 확인
    if (
      !roomData.title ||
      roomData.minPeople === '' ||
      roomData.maxPeople === ''
    ) {
      Swal.fire('알림', '모든 항목을 입력해주세요.', 'warning');
      return;
    }
    // 최소 인원과 최대 인원 비교 (숫자로 변환하여 비교)
    if (parseInt(roomData.maxPeople, 10) < parseInt(roomData.minPeople, 10)) {
      Swal.fire('알림', '최대 인원은 최소 인원 이상이어야 합니다.', 'warning');
      return;
    }
    setStep(2);
  };

  // 2단계 → 1단계 이동
  const handlePreviousStep = () => {
    setStep(1);
  };

  // 인원 조절
  const handleCountChange = (type, value) => {
    setRoomData((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value),
    }));
  };

  // 총 인원 계산
  const totalPeople = roomData.adults + roomData.teens + roomData.kids;

  // 키워드 선택 토글 (API에서 불러온 keyword 객체 사용, 키 이름은 id)
  const handleKeywordToggle = (keyword) => {
    setRoomData((prev) => {
      const exists = prev.selectedKeywords.find(
        (item) => item.keywordId === keyword.keywordId,
      );
      if (exists) {
        return {
          ...prev,
          selectedKeywords: prev.selectedKeywords.filter(
            (item) => item.keywordId !== keyword.keywordId,
          ),
        };
      } else {
        return {
          ...prev,
          selectedKeywords: [
            ...prev.selectedKeywords,
            { keywordId: keyword.keywordId },
          ],
        };
      }
    });
  };

  // 모달 닫기 시 상태 초기화
  const handleModalClose = () => {
    setStep(1);
    setRoomData({
      title: '',
      minPeople: '',
      maxPeople: '',
      selectedKeywords: [],
      adults: 0,
      teens: 0,
      kids: 0,
    });
    onClose();
  };

  // 방 만들기 완료 시: 선택된 키워드를 요청 바디에 포함하여 API 호출 후, 생성된 방으로 이동
  const handleRoomCreation = async () => {
    // 방제목 20자 이하 체크
    if (roomData.title.length > 20) {
      Swal.fire('알림', '방 제목은 20자 이하로 입력해주세요.', 'warning');
      return;
    }

    // 총 인원 체크: 0명일 경우 alert를 띄우고 함수 실행 중단
    if (totalPeople === 0) {
      Swal.fire(
        '알림',
        '총 인원이 0명입니다. 최소 1명 이상의 인원을 추가해주세요.',
        'warning',
      );
      return;
    }

    // 변환: 선택된 키워드 배열을 백엔드가 기대하는 형식으로 변환 (예: { keywordId: 1 })
    const keywordsPayload = roomData.selectedKeywords.map((item) => ({
      keywordId: item.keywordId,
    }));

    const requestBody = {
      travelPlan: {
        departureCityId: travelData.departureCityId,
        arrivalCityId: travelData.arrivalCityId,
        name: roomData.title,
        startDate: travelData.startDate, // "yyyy-MM-dd" 형식이어야 함
        endDate: travelData.endDate,
        keywords: keywordsPayload,
        minPeople: parseInt(roomData.minPeople, 10),
        maxPeople: parseInt(roomData.maxPeople, 10),
        planningStatus: 'IN_PROGRESS',
      },
      host: {
        adultCount: roomData.adults,
        childCount: roomData.teens,
        infantCount: roomData.kids,
      },
    };

    try {
      const response = await publicRequest.post(
        '/api/v1/travel-plans',
        requestBody,
      );
      console.log('여행 플랜 생성 성공:', response.data);
      Swal.fire('알림', '여행 플랜이 성공적으로 생성되었습니다.', 'success');

      // API 응답 구조에 따라 생성된 방 정보 추출 (예: response.data.data.travelPlan)
      const createdRoom = response.data.data.travelPlan;
      // 방 생성 후 /user-room으로 이동하면서 생성된 방 데이터를 state에 담아 전달
      navigate(`/user-room/${createdRoom.travelPlanId}`, {
        state: { selectedCard: createdRoom },
      });
    } catch (error) {
      console.error('여행 플랜 생성 실패:', error);
      Swal.fire('알림', '여행 플랜 생성 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleModalClose}
        />
        <motion.div
          className="relative z-10 w-full max-w-lg p-6 bg-white shadow-lg rounded-xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between pb-2 mb-5 border-b-2">
            <h1 className="pb-2 text-xl font-semibold border-gray-300">
              {step === 1 ? '방 만들기' : '동행인원'}
            </h1>
            <button
              onClick={handleModalClose}
              className="text-xl text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* 1단계: 방 제목, 최소/최대 인원, 키워드 선택 */}
          {step === 1 && (
            <div>
              <div className="mb-5">
                <label className="block text-sm font-medium">방 제목</label>
                <input
                  type="text"
                  name="title"
                  value={roomData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="flex mb-5 space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium">최소 인원</label>
                  <input
                    type="number"
                    name="minPeople"
                    value={roomData.minPeople}
                    onChange={(e) =>
                      setRoomData({ ...roomData, minPeople: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">최대 인원</label>
                  <input
                    type="number"
                    name="maxPeople"
                    value={roomData.maxPeople}
                    onChange={(e) =>
                      setRoomData({ ...roomData, maxPeople: e.target.value })
                    }
                    onBlur={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (value < 1) {
                        Swal.fire(
                          '알림',
                          '최대 인원은 1명 이상이어야 합니다.',
                          'warning',
                        );
                        return;
                      }
                      if (value < roomData.minPeople) {
                        Swal.fire(
                          '알림',
                          '최대 인원은 최소 인원 이상이어야 합니다.',
                          'warning',
                        );
                        setRoomData((prev) => ({
                          ...prev,
                          maxPeople: roomData.minPeople,
                        }));
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
              </div>
              {/* 키워드 선택 영역 */}
              <div className="mb-5">
                <label className="block text-sm font-medium">
                  여행 테마 선택
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {keywordList && keywordList.length > 0 ? (
                    keywordList.map((keyword) => (
                      <button
                        key={keyword.keywordId}
                        onClick={() => handleKeywordToggle(keyword)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          roomData.selectedKeywords.some(
                            (item) => item.keywordId === keyword.keywordId,
                          )
                            ? 'bg-dark-green text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {keyword.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500">키워드를 불러오는 중...</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleNextStep}
                className="w-full py-3 text-white transition rounded-lg bg-dark-green"
              >
                다음 단계
              </button>
            </div>
          )}

          {/* 2단계: 인원 조절 */}
          {step === 2 && (
            <div>
              {['adults', 'teens', 'kids'].map((type, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-5"
                >
                  <span className="text-lg font-semibold">
                    {type === 'adults'
                      ? '성인'
                      : type === 'teens'
                      ? '청소년'
                      : '유아'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCountChange(type, -1)}
                      className="px-3 py-2 text-lg bg-gray-200 border rounded-lg"
                    >
                      -
                    </button>
                    <span className="px-5 py-2 text-lg bg-white border rounded-lg">
                      {roomData[type]}
                    </span>
                    <button
                      onClick={() => handleCountChange(type, 1)}
                      className="px-3 py-2 text-lg bg-gray-200 border rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="mb-5 text-xl font-bold text-center">
                총 인원: {totalPeople}명
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-3 text-white transition bg-gray-400 rounded-lg hover:bg-gray-500"
                >
                  이전
                </button>
                <button
                  onClick={handleRoomCreation}
                  className="px-6 py-3 text-white transition rounded-lg bg-dark-green hover:bg-blue-600"
                >
                  입장하기
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    )
  );
};

export default CreateRoomModal;
