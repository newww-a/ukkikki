import React, { useEffect, useState } from 'react';
import { AgencyProposalslist } from '../../../api/agency';
import { useNavigate, useLocation } from 'react-router';
import ReactPaginate from 'react-paginate'; // react-paginate import
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
  Status,
  PaginationWrapper, // styled-component로 정의된 페이지네이션 래퍼
} from './style/OngoingProposalsStyle';
import { STATUS_PROPOSAL } from '../../../constants';

// 필터 옵션 배열 정의
const FILTER_OPTIONS = [
  { label: '전체보기', status: '' },
  { label: STATUS_PROPOSAL.W, status: 'W' },
  { label: STATUS_PROPOSAL.V, status: 'V' },
  { label: STATUS_PROPOSAL.D, status: 'D' },
];

const OngoingProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 필터 상태 (기본값은 "전체보기")
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0]);
  // 페이지네이션 상태 (0부터 시작)
  const [currentPage, setCurrentPage] = useState(0);
  const [proposalsPerPage] = useState(10);

  // location.state에 필터 옵션이 있으면 사용할 수 있음 (선택사항)
  // const filterOption = location.state?.filter || null;

  useEffect(() => {
    const getAgencyProposals = async () => {
      setError(null);
      try {
        const data = await AgencyProposalslist();
        console.log('진행중인 목록 API 응답 데이터:', data);
        // 데이터가 배열이 아니면 빈 배열로 처리
        setProposals(Array.isArray(data) ? data : []);
      } catch (error) {
        setError('제안서를 불러오는 데 실패했습니다.');
        console.log('Error:', error);
      }
    };
    getAgencyProposals();
  }, []);

  const onhandleDetail = (proposal) => {
    navigate(
      `/agency-proposal-detail/${proposal.travelPlanId}/${proposal.proposalId}`,
    );
  };

  const statusMapping = {
    D: '거절',
    A: '수락',
    W: '투표전',
    V: '투표중',
  };

  const handleFilterChange = (option) => {
    setSelectedFilter(option);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 리셋
  };

  // 선택한 필터에 따라 제안 목록 필터링 (전체보기이면 전체 목록)
  const filteredProposals = selectedFilter.status
    ? proposals.filter(
        (proposal) => proposal.proposalStatus === selectedFilter.status,
      )
    : proposals;

  // 페이지네이션을 위한 데이터 분할 (필터된 결과에서)
  const indexOfLastProposal = (currentPage + 1) * proposalsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - proposalsPerPage;
  const currentProposals = Array.isArray(filteredProposals)
    ? filteredProposals.slice(indexOfFirstProposal, indexOfLastProposal)
    : []; // filteredProposals가 배열이 아니면 빈 배열로 처리

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <Container>
      <CardWrapper>
        <Card>
          <TitleWrapper>
            <div className="flex items-center justify-center mb-8 space-x-8">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleFilterChange(option)}
                  className={`relative py-2 text-sm font-medium transition-colors ${
                    selectedFilter.label === option.label
                      ? 'text-brown'
                      : 'text-gray-500 hover:text-brown'
                  }`}
                >
                  {option.label}
                  {selectedFilter.label === option.label && (
                    <div className="absolute left-0 bottom-0 w-full h-0.5 bg-brown"></div>
                  )}
                </button>
              ))}
            </div>
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
                {currentProposals.length > 0 ? (
                  currentProposals.map((proposal) => (
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
                        {proposal.departureAirportName} ➡{' '}
                        {proposal.arrivalAirportName}
                      </TableCell>
                      <TableCell>{proposal.airline}</TableCell>
                      <TableCell>
                        {proposal.startDate} ~ {proposal.endDate}
                      </TableCell>
                      <TableCell>
                        <Status status={proposal.proposalStatus}>
                          {statusMapping[proposal.proposalStatus] ||
                            proposal.proposalStatus}
                        </Status>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5">
                      {selectedFilter.status
                        ? '해당 상태의 제안이 없습니다.'
                        : '참여 중인 여행이 없습니다.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <PaginationWrapper>
              <ReactPaginate
                previousLabel={'← 이전'}
                nextLabel={'다음 →'}
                breakLabel={'...'}
                pageCount={Math.ceil(
                  filteredProposals.length / proposalsPerPage,
                )}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                previousClassName={'previous-item'}
                nextClassName={'next-item'}
              />
            </PaginationWrapper>
          </TableWrapper>
        </Card>
      </CardWrapper>
    </Container>
  );
};

export default OngoingProposals;
