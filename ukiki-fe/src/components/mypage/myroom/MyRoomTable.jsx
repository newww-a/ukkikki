
import MyRoomRow from './MyRoomRow';

// Mock 데이터 (추후 API 연동 시 이 부분을 API 호출 결과로 대체)
const mockTravelPlans = [
  {
    travelPlanId: 1,
    name: 'Korea to Japan Trip',
    departureCity: { cityId: 1, name: '서울' },
    arrivalCity: { cityId: 2, name: '도쿄' },
    startDate: '2025-05-01',
    endDate: '2025-05-07',
    planningStatus: 'BIDDING',
    currentParticipants: 224,
  },
  {
    travelPlanId: 2,
    name: 'Europe Adventure',
    departureCity: { cityId: 3, name: '파리' },
    arrivalCity: { cityId: 4, name: '로마' },
    startDate: '2025-06-15',
    endDate: '2025-06-30',
    planningStatus: 'CONFIRMED',
    currentParticipants: 150,
  },
];

const MyRoomTable = () => {
  return (
    <div className="flex flex-wrap -mx-3">
      <div className="flex-none w-full max-w-full px-3">
        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="p-6 pb-0 mb-0 bg-white rounded-t-2xl border-b-0">
            <h6 className="text-xl font-bold">참여 중인 여행</h6>
          </div>
          <div className="flex-auto px-0 pt-0 pb-2">
            <div className="p-0 overflow-x-auto">
              <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
                <thead className="align-bottom">
                  <tr>
                    <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 text-xs tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      여행 제목
                    </th>
                    <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 text-xs tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      경로
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 text-xs tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      기간
                    </th>
                    <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 text-xs tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      상태
                    </th>
                    <th className="px-6 py-3 font-semibold text-center capitalize align-middle bg-transparent border-b border-gray-200 text-xs tracking-none whitespace-nowrap text-slate-400 opacity-70">
                      참여자 수
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockTravelPlans.length > 0 ? (
                    mockTravelPlans.map((plan) => (
                      <MyRoomRow key={plan.travelPlanId} plan={plan} />
                    ))
                  ) : (
                    <tr>
                      <td className="p-2 text-center" colSpan="5">
                        참여 중인 여행이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRoomTable;
