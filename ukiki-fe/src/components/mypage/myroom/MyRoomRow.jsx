
const MyRoomRow = ({ plan }) => {
  const {
    name,
    departureCity,
    arrivalCity,
    startDate,
    endDate,
    planningStatus,
    currentParticipants,
  } = plan;

  // 상태에 따라 배경 색상 조정 (추후 필요에 따라 조건 추가)
  const statusClass =
    planningStatus === 'BIDDING' ? 'bg-green-500' : 'bg-gray-500';

  return (
    <tr>
      {/* 여행 제목 */}
      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm font-semibold">{name}</span>
        </div>
      </td>
      {/* 경로 */}
      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap">
        <div className="text-sm">
          {departureCity.name} ➡ {arrivalCity.name}
        </div>
      </td>
      {/* 기간 */}
      <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap">
        <span className="text-xs font-semibold">
          {startDate} ~ {endDate}
        </span>
      </td>
      {/* 상태 */}
      <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-bold uppercase rounded ${statusClass} text-white`}
        >
          {planningStatus}
        </span>
      </td>
      {/* 참여자 수 */}
      <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap">
        <span className="text-xs font-semibold">{currentParticipants}</span>
      </td>
    </tr>
  );
};

export default MyRoomRow;
