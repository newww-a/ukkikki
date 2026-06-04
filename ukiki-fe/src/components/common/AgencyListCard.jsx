import { useNavigate } from 'react-router-dom';

const AgencyListCard = ({
  trip_name,
  start_date,
  end_date,
  airline,
  min_people,
  departureAirportName,
  arrivalAirportName,
  deposit,
  proposalStatus,
  createTime,
  proposal,
}) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const onhandleDetail = () => {
    navigate(`/agency-proposal-detail/${proposal.proposalId}`); // travelPlanId를 URL에 추가
  };

  const formatStatus = (proposalStatus) => {
    switch (proposalStatus) {
      case `D`:
        return `거절`;
      case `A`:
        return `수락`;
      case `W`:
        return `투표 전`;
      case `V`:
        return '투표 중';
    }
  };
  return (
    <div className="flex justify-center p-[40px]">
      <div className="flex mb-6 w-[900px] bg-[#f0f0f0] border-[2px] border-[#e5e5e5] rounded-xl overflow-hidden">
        {/* 카드 본문 */}
        <div className="flex flex-col p-4 w-2/3">
          <h2 className="font-bold leading-[1.25] text-xl mb-2">
            제안서 : {trip_name}
          </h2>
          <p className="text-sm mb-1 text-[#6b7280]">
            여행날짜: {start_date} ~ {end_date}
          </p>
          <p className="text-sm mb-1 text-[#6b7280]">항공편: {airline}</p>
          <p className="text-sm mb-1 text-[#6b7280]">
            출발 공항: {departureAirportName}
          </p>
          <p className="text-sm mb-1 text-[#6b7280]">
            도착 공항: {arrivalAirportName}
          </p>
          <p className="text-sm mb-1 text-[#6b7280]">예약금: {deposit}원</p>
          <p className="text-sm mb-1 text-[#6b7280]">최소인원: {min_people}</p>
          <p className="text-sm mb-1 text-[#6b7280]">
            진행 상태: {formatStatus(proposalStatus)}
          </p>
          <p className="text-sm mb-1 text-[#6b7280]">
            작성 시간: {new Date(createTime).toLocaleDateString('ko-KR')}
          </p>

          <button
            className="mt-auto ml-auto bg-[#412b2b] text-white py-2 px-4 rounded-md text-sm cursor-pointer transition-colors duration-300 hover:bg-[#5f3a3a]"
            onClick={onhandleDetail}
          >
            자세히 보기 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyListCard;
