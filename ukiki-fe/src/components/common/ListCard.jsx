import { useNavigate } from "react-router-dom";
import { 
  CardContainer, 
  CardWrapper, 
  CardContent, 
  CardTitle, 
  CardText, 
  DetailButton 
} from './style/ListCardStyle';

const ListCard = ({trip_name, start_date, end_date, location, min_people, max_people, proposal }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const onhandleDetail = () => {
    navigate(`/agency-detail/${proposal.travelPlanId}`); // travelPlanId를 URL에 추가
  };

  return (
    <CardContainer>
      <CardWrapper>
        {/* 카드 본문 */}
        <CardContent>
          <CardTitle>title: {trip_name}</CardTitle>
          <CardText>여행날짜: {start_date} ~ {end_date}</CardText>
          <CardText>여행지: {location}</CardText>
          <CardText>최소인원: {min_people}</CardText>
          <CardText>최대인원: {max_people}</CardText>

          <DetailButton onClick={onhandleDetail}>
            자세히 보기 →
          </DetailButton>
        </CardContent>
      </CardWrapper>
    </CardContainer>
  );
};

export default ListCard;
