import { useEffect, useState } from 'react';
import { AgencyProposalslist } from '../../../api/agency';
import { useNavigate } from 'react-router';

const AcceptedProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAgencyProposals = async () => {
      setError(null);
      try {
        const data = await AgencyProposalslist();
        console.log('진행중인 목록 API 응답 데이터:', data);
        // 데이터가 배열인지 확인하고 배열이 아니면 빈 배열로 처리
        setProposals(Array.isArray(data) ? data : []);
      } catch (error) {
        setError('제안서를 불러오는 데 실패했습니다.');
        console.error('Error:', error);
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
    A: '수락', // 수락 상태만 보여주기 위해 A값만 사용
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
  const baseClass = "px-2 py-1 text-[0.9375rem] font-bold uppercase rounded";
  const statusClass = statusStyles[status] || 'text-white bg-gray-500';
  
  return <span className={`${baseClass} ${statusClass}`}>{children}</span>;
};
  // 'A' 상태인 제안서만 필터링, 필터링된 결과가 배열이 아닐 경우 빈 배열로 처리
  const acceptedProposals = Array.isArray(proposals)
    ? proposals.filter((proposal) => proposal.proposalStatus === 'A')
    : []; // proposals가 배열이 아닌 경우 빈 배열로 처리

  return (
    <div className="flex-none w-full max-w-full px-4">
      <div className="flex-none w-full max-w-full px-4">
        <div className="relative flex flex-col min-w-0 bg-white border-0 rounded-[1.25rem] bg-clip-border mb-6">
          <div className="px-6 pt-6 rounded-t-[1.25rem] bg-white mb-0 border-b-0">
            <h6 className="font-bold text-[2.5rem]">수락된 제안 내역</h6>
          </div>
          <div className="px-6 pt-6 rounded-t-[1.25rem] bg-white mb-0 border-b-0">
            <div className="w-[910px] p-0 overflow-x-hidden">
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
                {acceptedProposals.length > 0 ? (
                  acceptedProposals.map((proposal) => (
                    <tr className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
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
                    <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate" colSpan="5">
                      수락된 제안이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptedProposals;
