//제안서 디테일(계획)

import { useContext } from 'react';
import TravelPlanDetailContext from '../../contexts/TravelPlanDetailContext';
import { PorposalContentContainer } from './style/ProposalContentStyle';

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
    <PorposalContentContainer>
      <span className="proposal-title"> {name} </span>
      <div className="proposal-content">
        <p>출발: {departureCity.name}</p>
        <p>도착: {arrivalCity.name}</p>
        <p>
          여행 예상 날짜: {startDate} ~ {endDate}
        </p>
        <div className="keywords-container">
          <span>테마: </span>
          {Array.isArray(keywords) && keywords.length > 0 ? (
            keywords.map((keyword, index) => (
              <span key={index} className="keyword">
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
    </PorposalContentContainer>
  );
};
export default ProposalContent;
