import { useNavigate } from 'react-router-dom';

const ListCard = ({
  trip_name,
  start_date,
  end_date,
  location,
  min_people,
  max_people,
  proposal,
}) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const onhandleDetail = () => {
    navigate(`/agency-detail/${proposal.travelPlanId}`); // travelPlanId를 URL에 추가
  };

  return (
    <div className="flex justify-center p-[40px]">
      <div className="flex mb-6 w-[900px] bg-[#f0f0f0] border-[2px] border-[#e5e5e5] rounded-xl overflow-hidden">
        {/* 카드 본문 */}
        <div className="flex flex-col p-4 w-2/3">
          <h2 className="font-bold leading-[1.25] text-xl mb-2">
            title: {trip_name}
          </h2>
          <p className="text-sm mb-1 text-[#6b7280]">
            여행날짜: {start_date} ~ {end_date}
          </p>
          <p className="text-sm mb-1 text-[#6b7280]">여행지: {location}</p>
          <p className="text-sm mb-1 text-[#6b7280]">최소인원: {min_people}</p>
          <p className="text-sm mb-1 text-[#6b7280]">최대인원: {max_people}</p>

          <button
            className="mt-auto ml-auto bg-[#412b2b] text-white py-2 px-4 rounded-md text-sm cursor-pointer transition-colors duration-300 hover:bg-[#5f3a3a]"
            onClick={onhandleDetail}
          >
            자세히 보기 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
