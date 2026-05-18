import { useState, useEffect, useContext } from 'react';
import TravelPlanDetailContext from '../../contexts/TravelPlanDetailContext';
import ProposalDetailContext from '../../contexts/ProposalDetailContext';
import {
  Info,
  ScheduleByDateContainer,
  ButtonContainer,
  ScheduleContainer,
} from './style/ScheduleByDateStyle';
import Schedule from './PlaceList/SchedulePlaces';
import banana from '../../assets/loading-spinner.png';
const ScheduleByDate = ({
  onTogglePlaceSelection,
  selectedDayNumber, // sidebar에서 선택한 dayNumber (예: 1, 2, 3 등)
  selectedPlaces, // 상위(MainLayout)에서 관리하는 선택된 장소 목록
  onDeletePlace,
  onAddTime,
  arrivalCity,
}) => {
  const [timeData, setTimeData] = useState({});
  const [showTimeInput, setShowTimeInput] = useState(null);

  const travelPlanContext = useContext(TravelPlanDetailContext);
  const proposalDetailContext = useContext(ProposalDetailContext);

  const proposal =
    travelPlanContext?.proposal || proposalDetailContext?.proposal;

  useEffect(() => {
    console.log('선택된 날짜:', selectedDayNumber);
  }, [selectedDayNumber]);

  if (!proposal) {
    return <div>로딩중</div>;
  }

  // 생성 페이지-> proposal.data.travelPlan, 수정 페이지-> proposal 자체를 사용
  const travelPlan =
    proposal.data && proposal.data.travelPlan
      ? proposal.data.travelPlan
      : proposal;
  const { startDate, endDate, daySchedules = [] } = travelPlan;

  // sidebar에서 선택한 dayNumber에 해당하는 스케줄 필터링
  const existingSchedules = proposal.scheduleItems
    ? proposal.scheduleItems
        .filter((item) => Number(item.dayNumber) === Number(selectedDayNumber))
        .map((item) => ({
          ...item,
          dayNumber: selectedDayNumber,
          // scheduleName, startTime, endTime, imageUrl 등 기존 필드를 그대로 사용
          // 만약 값이 없으면 빈 문자열로 기본값 부여
          startTime: item.startTime || '',
          endTime: item.endTime || '',
        }))
    : daySchedules.length > 0
    ? daySchedules
        .find((ds) => Number(ds.dayNumber) === Number(selectedDayNumber))
        ?.schedules.map((schedule) => ({
          ...schedule,
          dayNumber: selectedDayNumber,
          // 기존 스케줄에 scheduleId 또는 placeId가 있다면 그대로 사용
          placeId: schedule.scheduleId || schedule.placeId,
          startTime: schedule.startTime || '',
          endTime: schedule.endTime || '',
        })) || []
    : [];

  // 생성 페이지 혹은 수정 페이지에서 새로 추가된 장소 배열
  const newSchedules = selectedPlaces || [];

  // 두 배열을 합쳐 최종적으로 화면에 보여줄 배열 구성
  const effectiveSelectedPlaces =
    selectedPlaces && selectedPlaces.length > 0
      ? selectedPlaces
      : existingSchedules;

  // ISO 문자열일 경우 "T" 이후의 시간 부분만 추출하는 헬퍼 함수
  const normalizeTime = (timeStr) => {
    if (timeStr.includes('T')) {
      return timeStr.split('T')[1].slice(0, 5);
    }
    return timeStr;
  };

  // 두 시간의 차이를 계산하여 "X시간 Y분" 형태의 문자열 반환
  const computeDuration = (startTime, endTime) => {
    const normStart = normalizeTime(startTime);
    const normEnd = normalizeTime(endTime);

    const [sHours, sMinutes] = normStart.split(':').map(Number);
    const [eHours, eMinutes] = normEnd.split(':').map(Number);
    let startTotal = sHours * 60 + sMinutes;
    let endTotal = eHours * 60 + eMinutes;
    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }
    const diff = endTotal - startTotal;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
  };

  // ISO 문자열일 경우에도 "HH:mm" 부분만 사용하여 날짜와 결합
  const computeFullTime = (dayNumber, timeStr) => {
    const normTime = normalizeTime(timeStr);
    const baseDate = new Date(startDate);
    baseDate.setDate(baseDate.getDate() + (dayNumber - 1));

    const [hours, minutes] = normTime.split(':');
    baseDate.setHours(Number(hours), Number(minutes), 0, 0);
    return baseDate.toISOString().split('.')[0];
  };

  const handleSaveTime = (placeId, dayNumber, rawDataParam = null) => {
    const rawData = rawDataParam || timeData[placeId];
    if (!rawData || !rawData.startTime || !rawData.endTime) return;
    const fullStartTime = computeFullTime(dayNumber, rawData.startTime);
    const fullEndTime = computeFullTime(dayNumber, rawData.endTime);
    onAddTime(placeId, fullStartTime, fullEndTime);
    console.log('시간 저장 완료:', { placeId, fullStartTime, fullEndTime });
    setShowTimeInput(null);
  };
  const handleTimeInputToggle = (placeId) => {
    setShowTimeInput(showTimeInput === placeId ? null : placeId);
  };

  const handleTimeChange = (placeId, type, value) => {
    setTimeData((prevData) => {
      const newData = {
        ...prevData,
        [placeId]: {
          ...prevData[placeId],
          [type]: value,
        },
      };
      // endTime이 완전하게 입력되었고(startTime이 존재하면) 자동으로 저장 처리
      if (
        type === 'endTime' &&
        value.trim() !== '' &&
        value.length === 5 && // "HH:mm" 형식 검사
        newData[placeId] &&
        newData[placeId].startTime &&
        newData[placeId].startTime.trim() !== ''
      ) {
        handleSaveTime(placeId, selectedDayNumber, newData[placeId]);
      }
      return newData;
    });
  };

  return (
    <ScheduleByDateContainer>
      <Info>
        <h1>{arrivalCity.name}</h1>
        <h3>
          {startDate} ~ {endDate}
        </h3>
      </Info>

      <ScheduleContainer>
        {/* 선택된 장소들을 표시하는 영역 */}
        {effectiveSelectedPlaces.length > 0 ? (
          <Schedule
            selectedPlaces={effectiveSelectedPlaces}
            timeData={timeData}
            onDeletePlace={onDeletePlace}
            handleTimeInputToggle={handleTimeInputToggle}
            showTimeInput={showTimeInput}
            handleTimeChange={handleTimeChange}
            handleSaveTime={handleSaveTime}
            computeDuration={computeDuration}
          />
        ) : (
          <div className="flex flex-col items-center mt-2 mb-2 text-center">
            <img src={banana} alt="banana" className="transform scale-50" />
            <p>해당 일자에 등록된 장소가 없습니다.</p>
          </div>
        )}

        <ButtonContainer>
          <button onClick={onTogglePlaceSelection}>장소 추가</button>
        </ButtonContainer>
      </ScheduleContainer>
    </ScheduleByDateContainer>
  );
};

export default ScheduleByDate;
