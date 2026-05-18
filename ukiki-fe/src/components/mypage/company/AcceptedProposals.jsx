import { useEffect, useState } from "react";
import { AgencyProposalslist } from "../../../api/agency";
import { useNavigate } from "react-router";
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

const AcceptedProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAgencyProposals = async () => {
      setError(null);
      try {
        const data = await AgencyProposalslist();
        console.log("진행중인 목록 API 응답 데이터:", data);
        // 데이터가 배열인지 확인하고 배열이 아니면 빈 배열로 처리
        setProposals(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("제안서를 불러오는 데 실패했습니다.");
        console.error("Error:", error);
      }
    };

    getAgencyProposals();
  }, []);

  const onhandleDetail = (proposal) => {
    navigate(`/agency-proposal-detail/${proposal.travelPlanId}/${proposal.proposalId}`);
  };

  const statusMapping = {
    D: "거절",
    A: "수락",  // 수락 상태만 보여주기 위해 A값만 사용
    W: "투표전",
    V: "투표중"
  };

  // 'A' 상태인 제안서만 필터링, 필터링된 결과가 배열이 아닐 경우 빈 배열로 처리
  const acceptedProposals = Array.isArray(proposals)
    ? proposals.filter(proposal => proposal.proposalStatus === "A")
    : []; // proposals가 배열이 아닌 경우 빈 배열로 처리

  return (
    <Container>
      <CardWrapper>
        <Card>
          <TitleWrapper>
            <Title>수락된 제안 내역</Title>
          </TitleWrapper>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableHeadRow>
                  <TableHeadCell>상품명</TableHeadCell>
                  <TableHeadCell>여행 경로</TableHeadCell>
                  <TableHeadCell>항공사</TableHeadCell>
                  <TableHeadCell>기간</TableHeadCell>
                  <TableHeadCell>상태</TableHeadCell>
                </TableHeadRow>
              </TableHead>
              <TableBody>
                {acceptedProposals.length > 0 ? (
                  acceptedProposals.map((proposal) => (
                    <TableRow
                      key={proposal.proposalId}
                      onClick={() => onhandleDetail(proposal)}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-[18px] font-semibold">
                            {proposal.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {proposal.departureAirportName} ➡ {proposal.arrivalAirportName}
                      </TableCell>
                      <TableCell>{proposal.airline}</TableCell>
                      <TableCell>
                        {proposal.startDate} ~ {proposal.endDate}
                      </TableCell>
                      <TableCell>
                        <Status status={proposal.proposalStatus}>
                          {statusMapping[proposal.proposalStatus] || proposal.proposalStatus}
                        </Status>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5">수락된 제안이 없습니다.</TableCell>
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

export default AcceptedProposals;
