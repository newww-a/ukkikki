import { useState, useEffect, useRef } from 'react';
import ProposalButton from './ProposalButton';
import { STATUS_MAP, THEME_COLORS, STATUS_STYLES } from '../../constants';
import { useNavigate } from 'react-router';
const apiKey = import.meta.env.VITE_APP_UNSPLASH_API_KEY;

const getThemeColor = (theme) => THEME_COLORS[theme] || 'bg-gray-500 text-white';

const OverviewBar = ({ selectedCard = {} }) => {
  const {
    planningStatus = 'unknown',
    name = '기본 이름',
    arrivalCity = {},
    keywords = [],
    startDate = '',
    endDate = '',
    travelPlanId,
    currentParticipants,
    minPeople,
  } = selectedCard;

  const [imageUrl, setImageUrl] = useState('');
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  if (!selectedCard) {
    return <p>로딩 중입니다...</p>;
  }
  useEffect(() => {
    console.log('---selectedCard:', selectedCard); // selectedCard 객체 출력
    console.log('selectedCard.closeTime:', selectedCard?.closeTime); // closeTime 값 확인
  }, [selectedCard]); // selectedCard가 변경될 때마다 실행

  useEffect(() => {
    if (!arrivalCity.name) return;

    const fetchImage = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${arrivalCity.name}&client_id=${apiKey}`
        );
        const data = await response.json();
        setImageUrl(data?.urls?.regular || '');
      } catch (error) {
        console.error('이미지 불러오기 실패:', error);
      }
    };

    fetchImage();
  }, [arrivalCity.name]);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md pointer-events-auto">
      {/* 왼쪽: 여행 정보 */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">{name}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-gray-700">
            {startDate} ~ {endDate}
          </p>
          {arrivalCity.name && <p className="text-gray-700">{arrivalCity.name}</p>}
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              STATUS_STYLES[planningStatus] || 'bg-gray-400 text-white'
            }`}
          >
            {STATUS_MAP[planningStatus] || '알 수 없음'}
          </span>
          {keywords.length > 0 &&
            keywords.map((keyword, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getThemeColor(
                  keyword.name
                )}`}
              >
                {keyword.name}
              </span>
            ))}
        </div>
      </div>

      {/* 오른쪽: 여행사 제안 버튼 */}
      <ProposalButton
        selectedCard={selectedCard}
        travelPlanId={travelPlanId}
        currentParticipants={currentParticipants}
        minPeople={minPeople}
      />
    </div>
  );
};

export default OverviewBar;
