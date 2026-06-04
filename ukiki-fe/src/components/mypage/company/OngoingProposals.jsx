import { useEffect, useState } from 'react';
import { AgencyProposalslist } from '../../../api/agency';
import { useNavigate, useLocation } from 'react-router';
import ReactPaginate from 'react-paginate'; // react-paginate import
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

  const statusStyles = {
    D: 'text-[#991B33] bg-[#FEE2E2]',
    A: 'text-[#3053B4] bg-[#DBEAFE]',
    W: 'text-[#1C6534] bg-[#DCFCE7]',
    V: 'text-[#995E1B] bg-[#FEEDDB]',
  };

  // styled-components 대신 일반 컴포넌트로 변경
  const StatusBadge = ({ status, children }) => {
    const baseClass = 'px-2 py-1 text-[0.9375rem] font-bold uppercase rounded';
    const statusClass = statusStyles[status] || 'text-white bg-gray-500';

    return <span className={`${baseClass} ${statusClass}`}>{children}</span>;
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
    <div className="flex-none w-full max-w-full px-4">
      <div className="flex-none w-full max-w-full px-4">
        <div className="relative flex flex-col min-w-0 bg-white border-0 rounded-[1.25rem] bg-clip-border mb-6">
          <div className="px-6 pt-6 rounded-t-[1.25rem] bg-white mb-0 border-b-0">
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
          </div>
          <div className="px-6 pt-6 rounded-t-[1.25rem] bg-white mb-0 border-b-0">
            <table className="w-full mb-0 border-y border-slate-200 text-slate-600 table-fixed">
              <thead className="align-bottom">
                <tr>
                  <th className="p-[15px] whitespace-nowrap font-bold text-center uppercase border-b border-slate-200 text-[1.5625rem] text-slate-300 opacity-70 overflow-hidden text-ellipsis">
                    상품명
                  </th>
                  <th className="p-[15px] whitespace-nowrap font-bold text-center uppercase border-b border-slate-200 text-[1.5625rem] text-slate-300 opacity-70 overflow-hidden text-ellipsis">
                    여행 경로
                  </th>
                  <th className="p-[15px] whitespace-nowrap font-bold text-center uppercase border-b border-slate-200 text-[1.5625rem] text-slate-300 opacity-70 overflow-hidden text-ellipsis">
                    항공사
                  </th>
                  <th className="p-[15px] whitespace-nowrap font-bold text-center uppercase border-b border-slate-200 text-[1.5625rem] text-slate-300 opacity-70 overflow-hidden text-ellipsis">
                    기간
                  </th>
                  <th className="p-[15px] whitespace-nowrap font-bold text-center uppercase border-b border-slate-200 text-[1.5625rem] text-slate-300 opacity-70 overflow-hidden text-ellipsis">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProposals.length > 0 ? (
                  currentProposals.map((proposal) => (
                    <tr
                      className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
                      key={proposal.proposalId}
                      onClick={() => onhandleDetail(proposal)}
                    >
                      <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate">
                        <div className="flex items-center">
                          <span className="text-[18px] font-semibold">
                            {proposal.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate">
                        {proposal.departureAirportName} ➡{' '}
                        {proposal.arrivalAirportName}
                      </td>
                      <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate">
                        {proposal.airline}
                      </td>
                      <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate">
                        {proposal.startDate} ~ {proposal.endDate}
                      </td>
                      <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate">
                        <StatusBadge status={proposal.proposalStatus}>
                          {statusMapping[proposal.proposalStatus] ||
                            proposal.proposalStatus}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]">
                    <td
                      className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate"
                      colSpan="5"
                    >
                      {selectedFilter.status
                        ? '해당 상태의 제안이 없습니다.'
                        : '참여 중인 여행이 없습니다.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-10 mb-10">
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
                // Tailwind 클래스를 각 요소에 직접 주입
                containerClassName={'flex items-center gap-1 list-none'}
                pageLinkClassName={
                  'px-4 py-2 border border-slate-200 rounded-md font-bold text-[#412b2b] bg-white hover:bg-[#412b2b] hover:text-[#ffd21c] transition-colors'
                }
                activeLinkClassName={'!bg-[#412b2b] !text-[#ffd21c]'}
                previousLinkClassName={
                  'px-4 py-2 border border-slate-200 rounded-md font-bold text-[#412b2b] bg-white hover:bg-[#412b2b] hover:text-[#ffd21c] transition-colors'
                }
                nextLinkClassName={
                  'px-4 py-2 border border-slate-200 rounded-md font-bold text-[#412b2b] bg-white hover:bg-[#412b2b] hover:text-[#ffd21c] transition-colors'
                }
                disabledLinkClassName={
                  'opacity-50 cursor-not-allowed hover:bg-white hover:text-[#412b2b]'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingProposals;
