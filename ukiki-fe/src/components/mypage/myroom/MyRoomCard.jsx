import React from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../../../api/customAxios';
import { STATUS_MAP, THEME_COLORS } from '../../../constants';

const MyRoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleCardClick = async () => {
    try {
      const response = await publicRequest.get(
        `/api/v1/travel-plans/${room.travelPlanId}`,
      );
      navigate(`/user-room/${response.data.data.travelPlan.travelPlanId}`, {
        state: { selectedCard: response.data.data.travelPlan },
      });
    } catch (error) {
      console.error('여행방 입장 실패:', error);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col justify-between h-full p-3 bg-white rounded-md cursor-pointer"
    >
      {/* 이미지 + 상태 배지 */}
      <div className="relative overflow-hidden rounded-lg">
        <span
          className={`absolute top-2 left-2 z-10 px-2 py-1 rounded-full text-xs font-semibold ${
            STATUS_MAP[room.planningStatus]
              ? 'bg-gray-500 text-white'
              : 'bg-gray-400 text-white'
          }`}
        >
          {STATUS_MAP[room.planningStatus] || '상태 없음'}
        </span>
        <img
          src={`https://ukkikki-bucket.s3.ap-northeast-2.amazonaws.com/city/${room.arrivalCity.cityId}.jpg`}
          alt={room.arrivalCity?.name}
          className="object-cover w-full h-48 transition-transform duration-200 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null; // 무한 반복 방지
            e.target.src =
              'https://ukkikki-bucket.s3.ap-northeast-2.amazonaws.com/placeholder.jpg';
          }}
        />
      </div>

      {/* 본문 영역 */}
      <div className="flex flex-col flex-grow mt-2 space-y-2 text-sm text-gray-700">
        <p className="text-gray-500">
          {room.departureCity?.name} → {room.arrivalCity?.name}
        </p>

        {/* 제목 */}
        <h3 className="text-base font-semibold truncate no-margin">
          {room.name}
        </h3>
        {/* 인원 정보 및 여행 날짜 */}
        <div className="space-y-1">
          <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
            <div
              className="h-full bg-yellow"
              style={{
                width: `${
                  room.minPeople > 0 && room.currentParticipants
                    ? Math.min(
                        (room.currentParticipants / room.minPeople) * 100,
                        100,
                      )
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <p className="text-gray-500 m-0">
              {room.startDate} ~ {room.endDate}
            </p>
            <span className="text-gray-600">{room.currentParticipants}명</span>
          </div>
        </div>

        {/* 키워드(테마) */}
        <div className="flex flex-wrap gap-1">
          {room.keywords && room.keywords.length > 0 ? (
            room.keywords.map((keyword, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  THEME_COLORS[keyword.name] || 'bg-gray-500 text-white'
                }`}
              >
                {keyword.name}
              </span>
            ))
          ) : (
            <span className="px-2 py-1 text-xs font-semibold text-gray-500 rounded-full">
              테마 없음
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRoomCard;
