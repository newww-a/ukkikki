import { useNavigate } from "react-router-dom";
import { 
  CardContainer, 
  CardWrapper, 
  CardImage, 
  CardContent, 
  CardTitle, 
  CardText, 
  DetailButton 
} from './style/ListCardStyle';

const AgencyListCard = ({trip_name, start_date, end_date,airline , min_people, departureAirportName,arrivalAirportName,
    deposit,proposalStatus,createTime,proposal}) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const onhandleDetail = () => {
    navigate(`/agency-proposal-detail/${proposal.proposalId}`); // travelPlanId를 URL에 추가
  };

  const formatStatus = (proposalStatus)=>{
    switch(proposalStatus){
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
    <CardContainer>
      <CardWrapper>
        {/* 카드 본문 */}
        <CardContent>
          <CardTitle>제안서 : {trip_name}</CardTitle>
          <CardText>여행날짜: {start_date} ~ {end_date}</CardText>
          <CardText>항공편: {airline}</CardText>
          <CardText>출발 공항: {departureAirportName}</CardText>
          <CardText>도착 공항: {arrivalAirportName}</CardText>
          <CardText>예약금: {deposit}원</CardText>
          <CardText>최소인원원: {min_people}</CardText>
          <CardText>진행 상태: {formatStatus(proposalStatus)}</CardText>
          <CardText>작성 시간: {new Date(createTime).toLocaleDateString('ko-KR')}</CardText>
         
          <DetailButton onClick={onhandleDetail}>
            자세히 보기 →
          </DetailButton>
        </CardContent>
      </CardWrapper>
    </CardContainer>
  );
};

export default AgencyListCard;
