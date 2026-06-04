import { FaCheckCircle } from 'react-icons/fa';

const AgencyCard = ({ agency, onVote, onDetail, onJoinMeeting }) => {
  return (
    <div className="flex flex-col items-center w-64 p-6 bg-white border rounded-lg shadow-md">
      <p className="mb-1 text-xl font-semibold">{agency.companyName}</p>
      <p className="mb-2 text-gray-700">금액: {agency.deposit}원</p>
      <p className="mb-2">투표수: {agency.voteCount}</p>

      <div>
        {/* 투표 버튼: 이미 투표한 경우에는 비활성화 */}
        <button
          onClick={() => onVote(agency)}
          disabled={agency.votedYn}
          className="flex items-center justify-center w-10 h-10 mb-3 transition-all focus:outline-none active:outline-none ring-0"
        >
          <FaCheckCircle
            className={agency.votedYn ? 'text-blue-500' : 'text-gray-400'}
            size={30}
          />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {/* 상세보기 버튼 */}
        <button
          onClick={() => onDetail(agency)}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          상세보기
        </button>
        {/* 세션 참여 버튼 */}
        {/* 세션 참여 버튼 */}
        <button
          onClick={() => onJoinMeeting(agency)}
          disabled={!agency.hostConnected}
          className={`px-3 py-1 rounded ${
            agency.hostConnected
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Live
        </button>

      </div>
    </div>
  );
};

export default AgencyCard;
