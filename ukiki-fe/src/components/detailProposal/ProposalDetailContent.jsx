import { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MainContent } from '../../pages/style/AgencyRoomListPageStyle';
import ProposalDetailContext from '../../contexts/ProposalDetailContext';
import 'tailwindcss/tailwind.css';
import { getPassport, getTotalCount } from '../../api/agency';
import { publicRequest } from '../../api/customAxios';
import Swal from 'sweetalert2';
import InquiryModal from './InquiryModal';

const ProposalDetailContent = () => {
  const { proposal } = useContext(ProposalDetailContext);
  const { proposalId, travelPlanId } = useParams();
  const [activeTab, setActiveTab] = useState('상세 내용');
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [reservationList, setReservationList] = useState([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setTotalCount] = useState(null);

  const onhandleUpdatePlan = () => {
    console.log('수정 버튼 클릭:', proposal);
    navigate(`/travel-plans/${travelPlanId}/proposals/${proposalId}`);
  };

  // 홍보 방송 시작
  const handleStartBroadcast = async () => {
    try {
      // API 명세: POST /api/v1/travel-plans/{travelPlanId}/proposals/{proposalId}/meeting/connection
      // Request Body: { "isHost": true }
      const response = await publicRequest.post(
        `/api/v1/travel-plans/${travelPlanId}/proposals/${proposalId}/meeting/connection`,
        { isHost: true },
      );
      if (response.status === 200) {
        const { token } = response.data.data; // { token: '...' }
        // 회의 페이지로 이동, token을 state로 넘겨서 MeetingPage에서 사용
        navigate(
          `/meeting/${proposalId}?token=${encodeURIComponent(
            token,
          )}&isHost=true`,
          {
            state: { travelPlanId },
          },
        );
      }
    } catch (error) {
      console.error('홍보 방송 시작 실패:', error);
      Swal.fire('오류', '홍보 방송 시작에 실패했습니다.', 'error');
    }
  };

  useEffect(() => {
    const fetchTotalCount = async () => {
      const travelPlanIdValue = proposal?.travelPlanId;
      if (!travelPlanIdValue) {
        console.warn('travelPlanId가 존재하지 않습니다.');
        return;
      }
      try {
        const response = await getTotalCount(
          travelPlanIdValue,
          proposal?.proposalId,
        );
        if (response?.data?.count !== undefined) {
          setTotalCount(response.data.count);
        } else {
          setModalMessage('총 인원 수를 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('총 인원 수 가져오기 실패:', error);
        setModalMessage('총 인원 수를 가져오는 중 오류가 발생했습니다.');
      }
    };
    if (proposal?.travelPlanId) {
      fetchTotalCount();
    }
  }, [proposal]);

  const getStatusBadge = (status) => {
    const statusMap = {
      W: { text: '투표 전', className: 'bg-green-100 text-green-800' },
      V: { text: '투표 중', className: 'bg-yellow-100 text-yellow-800' },
      A: { text: '수락', className: 'bg-blue-100 text-blue-800' },
      D: { text: '거절', className: 'bg-red-100 text-red-800' },
    };
    return (
      statusMap[status] || {
        text: '상태 없음',
        className: 'bg-gray-100 text-gray-800',
      }
    );
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShowReservation = async () => {
    setIsLoading(true);
    try {
      const response = await getPassport(proposalId);
      console.log('여권 정보 응답:', response);
      if (response?.data) {
        setReservationList(response.data);
        setShowReservationModal(true);
      } else {
        setModalMessage('여권 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('여권 조회 실패:', error);
      setModalMessage('여권 정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDaySchedule = (dayNumber) => {
    if (!proposal?.daySchedules) return null;
    const daySchedule = proposal.daySchedules.find(
      (schedule) => schedule.dayNumber === parseInt(dayNumber),
    );
    if (!daySchedule) return <p>해당 일자의 일정이 없습니다.</p>;
    console.log('daySchedule', daySchedule);

    return (
      <div className="my-4">
        <h2 className="mb-4 text-2xl font-bold">
          {daySchedule.dayNumber}일차 일정
        </h2>
        <div className="relative pl-8">
          {/* 타임라인 선 */}
          <div className="absolute top-0 left-0 h-full border-l-4 border-blue-500"></div>
          {daySchedule.schedules.map((schedule, index) => (
            <div key={index} className="relative mb-6">
              {/* 타임라인 마커 */}
              <div className="absolute top-0 w-6 h-6 bg-blue-500 rounded-full -left-3"></div>
              <div className="p-4 ml-4 rounded-lg shadow bg-gray-50">
                <h3 className="text-lg font-bold">{schedule.scheduleName}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  시작: {formatDateTime(schedule.startTime)}
                </p>
                <p className="text-sm text-gray-600">
                  종료: {formatDateTime(schedule.endTime)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleButtonClick = async (action) => {
    if (action === 'traveler') {
      await handleShowReservation();
    } else if (action === 'delete') {
      console.log('삭제하기 클릭');
    } else if (action === 'inquire') {
      console.log('문의하기 클릭');
      setShowInquiryModal(true);
    }
  };

  if (!proposal)
    return <p className="text-center">제안서 정보를 찾을 수 없습니다.</p>;

  const status = getStatusBadge(proposal.confirmStatus);
  const dayTabs =
    proposal?.daySchedules?.map((schedule) => `${schedule.dayNumber}일차`) ||
    [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <MainContent className="flex-1">
        {modalMessage && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="p-6 text-center bg-white rounded-lg shadow-lg">
              <p className="mb-4">{modalMessage}</p>
              <button
                className="px-4 py-2 text-black bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setModalMessage('')}
              >
                확인
              </button>
            </div>
          </div>
        )}
        {showReservationModal && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] h-[600px] overflow-auto">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">예약자 여권 정보</h2>
                <button
                  className="font-bold text-black"
                  onClick={() => setShowReservationModal(false)}
                >
                  닫기
                </button>
              </div>
              <hr className="mb-4 border-black" />
              <div className="mb-4 font-semibold">
                전체 인원: {count !== null ? count : '로딩 중...'} / 등록된
                인원: {reservationList.length}
              </div>
              <div className="space-y-2">
                {isLoading ? (
                  <p className="text-center">로딩 중...</p>
                ) : reservationList && reservationList.length > 0 ? (
                  reservationList.map((passport, index) => (
                    <div key={index} className="p-4 mb-2 rounded-lg bg-gray-50">
                      <p>
                        <strong>이름:</strong> {passport.koreanName}
                      </p>
                      <p>
                        <strong>영문이름:</strong> {passport.englishName}
                      </p>
                      <p>
                        <strong>여권 번호:</strong> {passport.passportNumber}
                      </p>
                      <p>
                        <strong>생년월일:</strong> {passport.birthDate}
                      </p>
                      <p>
                        <strong>만료일:</strong>{' '}
                        {formatDateTime(passport.expirationDate)}
                      </p>
                      <p>
                        <strong>전화번호:</strong> {passport.phoneNumber}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    등록된 여권 정보가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {showInquiryModal && (
          <InquiryModal
            travelPlanId={proposal.travelPlanId}
            proposalId={proposal.proposalId}
            onClose={() => setShowInquiryModal(false)}
          />
        )}
        <div className="max-w-6xl px-4 py-6 mx-auto">
          <div className="max-w-6xl py-6 mx-auto px">
            <div className="flex flex-col mb-4">
              <button
                className="w-32 px-4 py-2 mt-2 text-black bg-white border border-gray-200 rounded-lg hover:border-gray-400"
                onClick={() =>
                  navigate('/myprofile', {
                    state: { activeComponent: 'OngoingProposals' },
                  })
                }
              >
                목록으로
              </button>
            </div>
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <div className="relative flex gap-6">
                <div className="w-2/3">
                  <h1 className="mb-4 text-2xl font-bold">{proposal.name}</h1>
                  <p className="mb-2">
                    여행날짜: {proposal.startDate} ~ {proposal.endDate}
                  </p>
                  <p className="mb-2">
                    최소 인원 : {proposal.minPeople}명 / 현재 인원 :{' '}
                    {typeof count === 'number' ? `${count}명` : '로딩 중...'}
                  </p>
                  <p className="mb-2">
                    예약금: {proposal.deposit.toLocaleString()}원
                  </p>
                  <div className="flex gap-2 mt-4">
                    진행 상태 :
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${status.className}`}
                    >
                      {status.text}
                    </span>
                  </div>
                </div>
                <div className="absolute flex gap-2 bottom-4 right-4">
                  {proposal.confirmStatus === 'W' && (
                    <button
                      className="px-4 py-2 text-black bg-white rounded hover:bg-gray-100"
                      onClick={onhandleUpdatePlan}
                    >
                      수정하기
                    </button>
                  )}
                  {proposal.confirmStatus === 'A' && (
                    <>
                      <button
                        className="px-4 py-2 text-black bg-white rounded hover:bg-gray-100"
                        onClick={() => handleButtonClick('traveler')}
                      >
                        예약자 현황
                      </button>
                      <button
                        className="px-4 py-2 text-black bg-white rounded hover:bg-gray-100"
                        onClick={onhandleUpdatePlan}
                      >
                        수정하기
                      </button>
                      <button
                        className="px-4 py-2 text-black bg-white rounded hover:bg-gray-100"
                        onClick={() => handleButtonClick('inquire')}
                      >
                        문의하기
                      </button>
                    </>
                  )}

                  {/* 투표 중 상태(V) → 홍보 방송 시작 버튼 */}
                  {proposal.confirmStatus === 'V' && (
                    <>
                      <button
                        className="px-4 py-2 text-black bg-white rounded hover:bg-gray-100"
                        onClick={handleStartBroadcast}
                      >
                        홍보 라이브 세션 시작
                      </button>
                      <button
                        className="px-4 py-2 text-black bg-white rounded hover:bg-gray-100"
                        onClick={() => handleButtonClick('inquire')}
                      >
                        문의하기
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full md:w-48">
              <div className="flex flex-col space-y-3">
                {['상세 내용', ...dayTabs].map((tab) => (
                  <button
                    key={tab}
                    className={`p-3 text-left rounded-lg border border-gray-200 ${
                      activeTab === tab
                        ? 'bg-white hover:border-gray-400'
                        : 'bg-white hover:border-gray-400'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-md p-6 min-h-[600px] w-[680px] overflow-y-auto overflow-x-hidden custom-scroll">
              <div className="h-[500px]">
                {activeTab === '상세 내용' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">여행 상세 내용</h2>
                    <br />
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-2 font-bold">여행정보</h3>
                      <span>{proposal.productInformation}</span>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-2 font-bold">여행 일정(datetime)</h3>
                      <p>
                        출발: {formatDateTime(proposal.startDateBoardingTime)}
                      </p>
                      <p>
                        도착: {formatDateTime(proposal.startDateArrivalTime)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-2 font-bold">항공사(airLine)</h3>
                      <p>{proposal.airLine}</p>
                    </div>
                    <div className="p-6 rounded-lg bg-gray-50">
                      <h3 className="mb-2 font-bold">
                        탑승 및 도착 시간(datetime)
                      </h3>
                      <br />
                      <div className="flex gap-24">
                        <div className="w-[280px]">
                          <p>출국 공항 : {proposal.departureAirport}</p>
                          <br />
                          <p>탑승 시간 :</p>
                          <p>
                            {formatDateTime(proposal.startDateBoardingTime)}
                          </p>
                          <br />
                          <p>도착 시간 :</p>
                          <p>{formatDateTime(proposal.startDateArrivalTime)}</p>
                        </div>
                        <div className="w-[280px]">
                          <p>귀국 공항 : {proposal.arrivalAirport}</p>
                          <br />
                          <p>탑승 시간 :</p>
                          <p>{formatDateTime(proposal.endDateBoardingTime)}</p>
                          <br />
                          <p>도착 시간 :</p>
                          <p>{formatDateTime(proposal.endDateArrivalTime)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-2 font-bold">가이드</h3>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={proposal.guideIncluded}
                            readOnly
                            className="mr-2"
                          />
                          포함
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={!proposal.guideIncluded}
                            readOnly
                            className="mr-2"
                          />
                          미포함
                        </label>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-2 font-bold">여행자 보험</h3>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={proposal.insuranceIncluded}
                            readOnly
                            className="mr-2"
                          />
                          포함
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={!proposal.insuranceIncluded}
                            readOnly
                            className="mr-2"
                          />
                          미포함
                        </label>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-2 font-bold">취소/환불 정책</h3>
                      <p>{proposal.refundPolicy}</p>
                    </div>
                  </div>
                )}
                {activeTab.includes('일차') && (
                  <div className="space-y-6">
                    {renderDaySchedule(activeTab.replace('일차', ''))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainContent>
    </div>
  );
};

export default ProposalDetailContent;
