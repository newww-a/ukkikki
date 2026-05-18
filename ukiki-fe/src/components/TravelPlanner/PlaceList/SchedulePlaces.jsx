import { useEffect, useRef, useState } from 'react';
import clock from '../../../assets/clock.png'; // 상대 경로로 수정
import trashCan from '../../../assets/trash_can.png'; // 상대 경로로 수정
import {
  SelectedPlacesContainer,
  SelectedPlacesContent,
} from './style/SchedulePlacesStyle';
import TimeModal from './TimeModal';

const Schedule = ({
  selectedPlaces,
  timeData,
  onDeletePlace,
  handleTimeChange,
  handleSaveTime,
  computeDuration,
}) => {
  const containerRef = useRef(null);
  const [openTimeModalId, setOpenTimeModalId] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight; // 새로운 항목이 추가될 때마다 가장 아래로 스크롤
    }
  }, [selectedPlaces]);

  // 현재 모달에서 시간 설정 중인 장소 객체
  const currentPlace =
    openTimeModalId &&
    selectedPlaces.find((place) => place.placeId === openTimeModalId);

  return (
    <SelectedPlacesContainer ref={containerRef}>
      {selectedPlaces.map((place, index) => {
        // timeData에 값이 없으면, place에 있는 startTime/endTime을 fallback으로 사용
        const startTime =
          timeData[place.placeId]?.startTime || place.startTime || '';
        const endTime = timeData[place.placeId]?.endTime || place.endTime || '';
        const hasTimeInput = startTime && endTime;

        const duration = hasTimeInput
          ? computeDuration(startTime, endTime)
          : null;
        const hasDuration = duration !== null;

        return (
          <div key={place.placeId} className="selected-place">
            <span className="index">{index + 1}</span>
            <SelectedPlacesContent hasDuration={hasDuration}>
              <p className="place">{place.scheduleName}</p>
              <span className="btns">
                <button onClick={() => setOpenTimeModalId(place.placeId)}>
                  {hasTimeInput ? (
                    <span className="duration-text">{duration}</span>
                  ) : (
                    <img src={clock} alt="clock icon" className="w-6 h-6" />
                  )}
                </button>
                <button onClick={() => onDeletePlace(place.placeId)}>
                  <img src={trashCan} alt="trashCan icon" className="w-6 h-6" />
                </button>
              </span>
              {/* 기존 인라인 시간 입력 폼은 제거 */}
            </SelectedPlacesContent>
          </div>
        );
      })}
      {/* 모달 렌더링 */}
      <TimeModal
        isOpen={Boolean(openTimeModalId)}
        onClose={() => setOpenTimeModalId(null)}
        place={currentPlace}
        timeData={timeData}
        handleTimeChange={handleTimeChange}
        handleSaveTime={handleSaveTime}
      />
    </SelectedPlacesContainer>
  );
};

export default Schedule;
