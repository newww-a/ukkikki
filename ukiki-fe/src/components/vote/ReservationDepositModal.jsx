// ReservationDepositModal.jsx
import React, { useState } from 'react';
import { publicRequest } from '../../api/customAxios';
import Swal from 'sweetalert2';
import KakaoPayTest from './KakaoPayTest';
import { IoIosCloseCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const ReservationDepositModal = ({ travelPlanId, proposalId, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [travelers, setTravelers] = useState([
    {
      koreanName: '',
      englishName: '',
      passportNumber: '',
      expirationDate: '',
      birthDate: '',
      phoneNumber: '',
    },
  ]);
  const [loading, setLoading] = useState(false);

  // 여행자 정보 변경 핸들러
  const handleTravelerChange = (index, field, value) => {
    const newTravelers = [...travelers];
    newTravelers[index][field] = value;
    setTravelers(newTravelers);
  };

  const addTraveler = () => {
    setTravelers([
      ...travelers,
      {
        koreanName: '',
        englishName: '',
        passportNumber: '',
        expirationDate: '',
        birthDate: '',
        phoneNumber: '',
      },
    ]);
  };

  const removeTraveler = (index) => {
    setTravelers(travelers.filter((_, i) => i !== index));
  };

  // 1단계: 모든 여행자 정보가 올바르게 입력되었는지 확인한 후 결제 단계로 진행
  const handleNext = () => {
    for (let traveler of travelers) {
      if (traveler.phoneNumber.length !== 11) {
        Swal.fire(
          '유효성 오류',
          '전화번호는 11자리 숫자로 입력해주세요',
          'warning',
        );
        return;
      }
      if (
        !traveler.koreanName.trim() ||
        !traveler.englishName.trim() ||
        !traveler.passportNumber.trim() ||
        !traveler.expirationDate.trim() ||
        !traveler.birthDate.trim() ||
        !traveler.phoneNumber.trim()
      ) {
        Swal.fire('알림', '모든 여행자 정보를 입력해주세요.', 'warning');
        return;
      }
    }
    setStep(2);
  };

  // 2단계: 결제 완료 후, 여행자 등록 API를 호출한 뒤 유저룸으로 이동
  const handlePaymentComplete = async () => {
    setLoading(true);
    try {
      // 여행자 등록 API 호출
      const response = await publicRequest.post(
        `/api/v1/travel-plans/${travelPlanId}/proposals/${proposalId}/travelers`,
        travelers,
      );
      if (response.status === 200) {
        // 여행자 등록이 완료되면 방 상태를 CONFIRMED로 업데이트
        const statusResponse = await publicRequest.put(
          `/api/v1/travel-plans/${travelPlanId}`,
          { planningStatus: 'CONFIRMED' },
        );
        if (statusResponse.status === 200) {
          Swal.fire({
            title: '예약금 결제 완료',
            html: '10초 후에 유저룸으로 이동합니다.',
            icon: 'success',
            showConfirmButton: true,
            confirmButtonText: '지금 이동',
            allowOutsideClick: false,
            allowEscapeKey: false,
            timer: 10000,
            timerProgressBar: true,
          }).then(() => {
            navigate(`/user-room/${travelPlanId}`);
          });
        } else {
          Swal.fire('오류', '방 상태 업데이트에 실패했습니다.', 'error');
        }
      } else {
        Swal.fire('오류', '여행자 등록에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('여행자 등록 및 방 상태 업데이트 실패:', error);
      Swal.fire(
        '오류',
        '여행자 등록 및 방 상태 업데이트에 실패했습니다.',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl p-6 bg-white rounded-lg">
        {/* 오른쪽 상단에 닫기 아이콘 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-brown">
          <IoIosCloseCircle size={40} />
        </button>
        <h2 className="mb-4 text-2xl font-bold">예약금 결제</h2>
        {step === 1 && (
          <div>
            <h3 className="mb-4 text-xl font-semibold">여행자 등록</h3>
            {/* 스크롤 영역 적용: 내용이 길어지면 스크롤 */}
            <div className="pr-2 overflow-y-auto max-h-96">
              {travelers.map((traveler, index) => (
                <div key={index} className="p-4 mb-4 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">여행자 {index + 1}</span>
                    {travelers.length > 1 && (
                      <button
                        onClick={() => removeTraveler(index)}
                        className="text-red-500"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  {/* 한글 이름 */}
                  <div className="mb-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      한글 이름
                    </label>
                    <input
                      type="text"
                      placeholder="한글 이름"
                      value={traveler.koreanName}
                      onChange={(e) =>
                        handleTravelerChange(
                          index,
                          'koreanName',
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {/* 영문 이름 */}
                  <div className="mb-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      영문 이름
                    </label>
                    <input
                      type="text"
                      placeholder="영문 이름"
                      value={traveler.englishName}
                      onChange={(e) =>
                        handleTravelerChange(
                          index,
                          'englishName',
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {/* 여권번호 */}
                  <div className="mb-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      여권번호
                    </label>
                    <input
                      type="text"
                      placeholder="여권번호"
                      value={traveler.passportNumber}
                      onChange={(e) =>
                        handleTravelerChange(
                          index,
                          'passportNumber',
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {/* 여권 만료일 */}
                  <div className="mb-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      여권 만료일
                    </label>
                    <input
                      type="date"
                      value={traveler.expirationDate}
                      onChange={(e) =>
                        handleTravelerChange(
                          index,
                          'expirationDate',
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {/* 생년월일 */}
                  <div className="mb-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      생년월일
                    </label>
                    <input
                      type="date"
                      value={traveler.birthDate}
                      onChange={(e) =>
                        handleTravelerChange(index, 'birthDate', e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {/* 전화번호 */}
                  <div className="mb-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      전화번호
                    </label>
                    <input
                      type="text"
                      placeholder="전화번호"
                      value={traveler.phoneNumber}
                      onChange={(e) => {
                        // 숫자만 허용하고 11자리로 제한
                        const value = e.target.value
                          .replace(/[^0-9]/g, '')
                          .slice(0, 11);
                        handleTravelerChange(index, 'phoneNumber', value);
                      }}
                      className="w-full p-2 border rounded"
                      maxLength="11"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addTraveler}
              className="px-4 py-2 mb-4 text-black bg-white border border-gray-300 rounded hover:bg-gray-100"
            >
              여행자 추가
            </button>
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-4 py-2 text-white rounded bg-airbnb"
                disabled={loading}
              >
                {loading ? '처리 중...' : '다음'}
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="min-h-[500px] flex flex-col items-center justify-center">
            <KakaoPayTest onPaymentComplete={handlePaymentComplete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDepositModal;
