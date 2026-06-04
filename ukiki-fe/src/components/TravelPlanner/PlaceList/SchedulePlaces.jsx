import { useEffect, useRef, useState } from 'react';
import clock from '../../../assets/clock.png'; // 상대 경로로 수정
import trashCan from '../../../assets/trash_can.png'; // 상대 경로로 수정
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
    <div ref={containerRef} className="my-4 flex flex-col gap-5 rounded-[10px]">
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
          <div key={place.placeId} className="w-[270px] h-[80px] p-2.5 ml-2.5 rounded-[10px] bg-white flex items-center gap-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.2)] relative">
            <span className="flex items-center text-[20px]">{index + 1}</span>
            <div hasDuration={hasDuration} className="ml-2.5 max-w-[270px] h-[90px] items-center justify-start relative">
              <p className={`text-[16px] flex-shrink-1 whitespace-nowrap overflow-hidden text-ellipsis mr-2.5 ${hasDuration ? 'max-w-[115px]' : 'max-w-[160px]'}`}>{place.scheduleName}</p>
              <span className="absolute right-2.5 flex gap-2.5 justify-end">
                <button onClick={() => setOpenTimeModalId(place.placeId)}>
                  {hasTimeInput ? (
                    <span className="bg-[#FFD21C] text-black rounded-[5px] text-[15px] p-[5px] whitespace-nowrap">{duration}</span>
                  ) : (
                    <img src={clock} alt="clock icon" className="w-6 h-6" />
                  )}
                </button>
                <button onClick={() => onDeletePlace(place.placeId)}>
                  <img src={trashCan} alt="trashCan icon" className="w-6 h-6" />
                </button>
              </span>
              {/* 기존 인라인 시간 입력 폼은 제거 */}
            </div>
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
    </div>
  );
};

export default Schedule;
