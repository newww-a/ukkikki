import { useContext } from 'react';
import TravelPlanContext from '../../../contexts/travelPlanContext';
import { useNavigate } from 'react-router';

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
    <div className="flex-none w-full max-w-full px-4">
      <div className="flex-none w-full max-w-full px-4">
        <div className="relative flex flex-col min-w-0 bg-white border-0 rounded-[1.25rem] bg-clip-border mb-6">
          <div className="px-6 pt-6 rounded-t-[1.25rem] bg-white mb-0 border-b-0">
            <h6 className="font-bold text-[2.5rem]">패키지 의뢰</h6>
          </div>
          <div className="px-6 pt-6 rounded-t-[1.25rem] bg-white mb-0 border-b-0">
            <div className="w-full mb-0 border-y border-slate-200 text-slate-600 table-fixed">
              <thead className="align-bottom">
                <tr>
                  <th className="p-[15px] whitespace-nowrap font-bold text-center uppercase border-b border-slate-200 text-[1.5625rem] text-slate-300 opacity-70 overflow-hidden text-ellipsis">
                    상품명
                  </th>
                  <th className="p-[15px] whitespace-nowrap font-bold text-center uppercase border-b border-slate-200 text-[1.5625rem] text-slate-300 opacity-70 overflow-hidden text-ellipsis">
                    여행 경로
                  </th>
                  <th className="p-[15px] whitespace-nowrap font-bold text-center uppercase border-b border-slate-200 text-[1.5625rem] text-slate-300 opacity-70 overflow-hidden text-ellipsis">
                    여행 기간
                  </th>
                  <th className="p-[15px] whitespace-nowrap font-bold text-center uppercase border-b border-slate-200 text-[1.5625rem] text-slate-300 opacity-70 overflow-hidden text-ellipsis">
                    참여자 수
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposals && proposals.length > 0 ? (
                  proposals.map((proposal) => {
                    return (
                      <tr className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
                        key={proposal.travelPlanId}
                        onClick={() => onhandleDetail(proposal.travelPlanId)}
                      >
                        {/* 여행 제목 */}
                        <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate">
                          <div className="flex items-center">
                            <span className="text-[18px] font-semibold">
                              {proposal.name}
                            </span>
                          </div>
                        </td>
                        {/* 경로 */}
                        <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate">
                          {proposal.departureCity.name} ➡{' '}
                          {proposal.arrivalCity.name}
                        </td>
                        {/* 기간 */}
                        <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate">
                          {proposal.startDate} ~ {proposal.endDate}
                        </td>
                        {/* 참여자 수 */}
                        <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate">
                          {proposal.currentParticipants}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]">
                    <td className="p-4 text-center bg-transparent border-b border-slate-200 whitespace-nowrap text-[1.2rem] truncate" colSpan="5">
                      참여 중인 여행이 없습니다.
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

export default ReceivedProposals;
