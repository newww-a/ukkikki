import { useContext } from "react";
import TravelPlanContext from "../../../contexts/travelPlanContext";
import { useNavigate } from "react-router";

// 스타일 import
import { 
  Container, 
  CardWrapper, 
  Card, 
  TitleWrapper, 
  Title, 
  TableWrapper, 
  Table, 
  TableHead, 
  TableHeadRow, 
  TableHeadCell, 
  TableBody, 
  TableRow, 
  TableCell, 
  Status 
} from "./style/OngoingProposalsStyle";

const ReceivedProposals = () => {
  const { proposals, error } = useContext(TravelPlanContext) || {};
  const navigate = useNavigate();
  console.log('제안 목록:', proposals);

  if (error) {
    return <div>{error}</div>;
  }
  if (!proposals || proposals.length === 0) {
    return <div>여행 제안서가 없습니다.</div>;
  }

  // 여행 제안 클릭 시 상세 페이지로 이동
  const onhandleDetail = (travelPlanId) => {
    navigate(`/agency-detail/${travelPlanId}`);
  };

  return (
    <Container>
      <CardWrapper>
        <Card>
          <TitleWrapper>
            <Title>패키지 의뢰</Title>
          </TitleWrapper>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableHeadRow>
                  <TableHeadCell>상품명</TableHeadCell>
                  <TableHeadCell>여행 경로</TableHeadCell>
                  <TableHeadCell>여행 기간</TableHeadCell>
                  <TableHeadCell>참여자 수</TableHeadCell>
                </TableHeadRow>
              </TableHead>
              <TableBody>
                {proposals && proposals.length > 0 ? (
                  proposals.map((proposal) => {
                    return (
                      <TableRow key={proposal.travelPlanId} onClick={() => onhandleDetail(proposal.travelPlanId)}>
                        {/* 여행 제목 */}
                        <TableCell>
                          <div className="flex items-center">
                            <span className="text-[18px] font-semibold">{proposal.name}</span>
                          </div>
                        </TableCell>
                        {/* 경로 */}
                        <TableCell>{proposal.departureCity.name} ➡ {proposal.arrivalCity.name}</TableCell>
                        {/* 기간 */}
                        <TableCell>{proposal.startDate} ~ {proposal.endDate}</TableCell>
                        {/* 참여자 수 */}
                        <TableCell>{proposal.currentParticipants}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan="5">참여 중인 여행이 없습니다.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableWrapper>
        </Card>
      </CardWrapper>
    </Container>
  );
};

export default ReceivedProposals;
