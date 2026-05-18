import AgencyCard from './AgencyCard';

const AgencyList = ({ agencies, onVote, onDetail, onJoinMeeting }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {agencies.map((agency) => (
        <AgencyCard
          key={agency.proposalId} // proposalId를 key로 사용
          agency={agency}
          onVote={onVote}
          onDetail={onDetail}
          onJoinMeeting={onJoinMeeting} // 회의 참여 prop 전달
        />
      ))}
    </div>
  );
};

export default AgencyList;
