//제안서 디테일(계획)

import { useContext } from 'react';
import TravelPlanDetailContext from '../../contexts/TravelPlanDetailContext';

const ProposalContent = () => {
  const { proposal } = useContext(TravelPlanDetailContext);

  if (!proposal) {
    return <div>제안서 불러오는 중,,</div>;
  }
  const {
    name,
    departureCity,
    arrivalCity,
    startDate,
    endDate,
    currentParticipants,
    keywords,
  } = proposal.data.travelPlan;
  return (
    <div className="flex items-center justify-center ml-[150px] gap-x-[80px]">
      <span className="flex-[1.5] text-center text-[clamp(80px, 5vw, 90px)] text-[#412b2b] font-extrabold leading-[100px] px-5">
        {name}
      </span>
      <div className="flex-[2.5] text-[20px] font-normal leading-[50px]">
        <p>출발: {departureCity.name}</p>
        <p>도착: {arrivalCity.name}</p>
        <p>
          여행 예상 날짜: {startDate} ~ {endDate}
        </p>
        <div className="flex flex-wrap gap-[5px]">
          <span>테마: </span>
          {Array.isArray(keywords) && keywords.length > 0 ? (
            keywords.map((keyword, index) => (
              <span key={index} className="mr-[3px] text-[14px] text-black">
                {keyword.name}
                {index < keywords.length - 1 && ', '}
              </span>
            ))
          ) : (
            <span>없음</span>
          )}
        </div>

        <p>총 참여인원: {currentParticipants}</p>
      </div>
    </div>
  );
};
export default ProposalContent;
