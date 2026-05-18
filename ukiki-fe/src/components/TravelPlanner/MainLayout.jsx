import { useContext, useState, useEffect } from 'react';
import TravelPlanDetailContext from '../../contexts/TravelPlanDetailContext';
import ProposalDetailContext from '../../contexts/ProposalDetailContext';
import DateSidebar from './DateSidebar';
import MapDisplay from './MapDisplay';
import ScheduleByDate from './ScheduleByDate';
import PlaceSelection from './PlaceSelection';
import DetailForm from './DetailForm';
import { CreateTravelProposal, UpdateTravelProposal } from '../../api/agency';
import {
  StyledMainLayout,
  StyledDateSidebar,
  StyledMapDisplay,
  StyleScheduleByDate,
  StyleMapContainer,
  StylePlaceSelection,
  DetailFormWrapper,
  ContentArea,
} from './style/MainLayoutStyle';
import Swal from 'sweetalert2';

// 간단한 고유 ID 생성 함수
const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const MainLayout = () => {
  const travelPlanContext = useContext(TravelPlanDetailContext);
  const proposalContext = useContext(ProposalDetailContext);

  // 수정 페이지일 경우 ProposalDetailContext, 생성 페이지일 경우 TravelPlanDetailContext 사용
  const proposal = proposalContext?.proposal || travelPlanContext?.proposal;
  const selectedDayId =
    proposalContext?.selectedDayId ?? travelPlanContext?.selectedDayId ?? 1;

  const [selectedPlacesByDay, setSelectedPlacesByDay] = useState({});
  const [showPlaceSelection, setShowPlaceSelection] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);

  const [proposalData, setProposalData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    airline: '',
    departureAirportCode: '',
    departureAirportName: '',
    arrivalAirportCode: '',
    arrivalAirportName: '',
    startDateBoardingTime: '',
    startDateArrivalTime: '',
    endDateBoardingTime: '',
    endDateArrivalTime: '',
    deposit: 0,
    minPeople: 0,
    guideIncluded: '',
    productIntroduction: '',
    refundPolicy: '',
    insuranceIncluded: '',
    proposalStatus: 'W',
  });

  // proposal 데이터 디버깅용 콘솔 출력
  useEffect(() => {
    if (proposal) {
      console.log('최종 proposal 상태:', proposal);
    }
  }, [proposal]);

  // proposalData 초기화 (수정 페이지와 생성 페이지 구분)
  useEffect(() => {
    if (
      proposal &&
      (proposal.proposalId || (proposal.data && proposal.data.travelPlan))
    ) {
      if (proposal.proposalId) {
        // 수정 페이지
        setProposalData({
          name: proposal.name,
          startDate: proposal.startDate,
          endDate: proposal.endDate,
          airline: proposal.airLine,
          departureAirportCode: proposal.departureAirportCode,
          departureAirportName: proposal.departureAirport,
          arrivalAirportCode: proposal.arrivalAirportCode,
          arrivalAirportName: proposal.arrivalAirport,
          startDateBoardingTime: proposal.startDateBoardingTime,
          startDateArrivalTime: proposal.startDateArrivalTime,
          endDateBoardingTime: proposal.endDateBoardingTime,
          endDateArrivalTime: proposal.endDateArrivalTime,
          deposit: proposal.deposit,
          minPeople: proposal.minPeople,
          guideIncluded: proposal.guideIncluded,
          productIntroduction: proposal.productInformation,
          refundPolicy: proposal.refundPolicy,
          insuranceIncluded: proposal.insuranceIncluded,
          proposalStatus: proposal.proposalStatus,
        });
      } else if (proposal.data && proposal.data.travelPlan) {
        // 생성 페이지
        const travelPlan = proposal.data.travelPlan;
        setProposalData({
          name: travelPlan.name,
          startDate: travelPlan.startDate,
          endDate: travelPlan.endDate,
          airline: travelPlan.airline,
          departureAirportCode: travelPlan.departureAirportCode,
          departureAirportName: travelPlan.departureAirportName,
          arrivalAirportCode: travelPlan.arrivalAirportCode,
          arrivalAirportName: travelPlan.arrivalAirportName,
          startDateBoardingTime: travelPlan.startDateBoardingTime,
          startDateArrivalTime: travelPlan.startDateArrivalTime,
          endDateBoardingTime: travelPlan.endDateBoardingTime,
          endDateArrivalTime: travelPlan.endDateArrivalTime,
          deposit: travelPlan.deposit,
          minPeople: travelPlan.minPeople,
          guideIncluded: travelPlan.guideIncluded,
          productIntroduction: travelPlan.productInformation,
          refundPolicy: travelPlan.refundPolicy,
          insuranceIncluded: travelPlan.insuranceIncluded,
          proposalStatus: travelPlan.proposalStatus || 'W',
        });
      }
    }
  }, [proposal]);

  // 수정 페이지: proposal에 기존 스케줄 데이터가 있다면 선택된 날짜에 해당하는 데이터를 초기화합니다.
  useEffect(() => {
    if (proposal) {
      let initialSelectedPlacesByDay = {};
      // 우선 scheduleItems가 존재하면 사용. 수정 페이지의 경우
      const scheduleItems =
        proposal.scheduleItems ||
        (proposal.data &&
          proposal.data.travelPlan &&
          proposal.data.travelPlan.scheduleItems) ||
        [];

      if (scheduleItems.length > 0) {
        scheduleItems.forEach((item) => {
          const day = item.dayNumber;
          if (!initialSelectedPlacesByDay[day]) {
            initialSelectedPlacesByDay[day] = [];
          }
          initialSelectedPlacesByDay[day].push(item);
        });
      } else if (proposal.daySchedules && proposal.daySchedules.length > 0) {
        // scheduleItems가 없으면, daySchedules에서 추출 (수정 페이지의 경우)
        proposal.daySchedules.forEach((ds) => {
          const day = ds.dayNumber;
          if (ds.schedules && ds.schedules.length > 0) {
            initialSelectedPlacesByDay[day] = ds.schedules;
          }
        });
      }
      console.log('초기화된 selectedPlacesByDay:', initialSelectedPlacesByDay);
      setSelectedPlacesByDay(initialSelectedPlacesByDay);
    }
  }, [proposal]);

  if (!proposal) {
    return <div>로딩중...</div>;
  }

  const arrivalCity =
    proposal.data && proposal.data.travelPlan
      ? proposal.data.travelPlan.arrivalCity
      : { name: proposal.arrivalAirport || '도착지 미정' };

  console.log('arrivalCity:', arrivalCity);

  // 장소 추가 버튼 토글 함수
  const togglePlaceSelection = () => {
    setShowPlaceSelection((prev) => !prev);
  };

  // 상세 내용 버튼 토글 함수
  const toggleDetailForm = () => {
    setShowDetailForm((prev) => !prev);
  };

  // PlaceSelection에서 선택한 장소를 현재 날짜(selectedDayId)에 추가
  const handleSelectPlace = (place) => {
    const placeWithId = {
      ...place,
      placeId: place.placeId || generateUniqueId(),
      dayNumber: selectedDayId,
    };
    setSelectedPlacesByDay((prev) => ({
      ...prev,
      [selectedDayId]: [...(prev[selectedDayId] || []), placeWithId],
    }));
    // setShowPlaceSelection(false);
  };

  const currentDayPlaces = selectedPlacesByDay[selectedDayId] || [];

  // 장소 삭제
  const handleDeletePlace = (placeId) => {
    const updatedPlaces = currentDayPlaces.filter(
      (place) => place.placeId !== placeId,
    );
    setSelectedPlacesByDay((prev) => ({
      ...prev,
      [selectedDayId]: updatedPlaces,
    }));
  };

  // 시간 설정 (startTime, endTime 업데이트)
  const handleSetTime = (placeId, startTime, endTime) => {
    setSelectedPlacesByDay((prev) => {
      const updatedPlaces = (prev[selectedDayId] || []).map((place) => {
        if (place.placeId === placeId) {
          return { ...place, startTime, endTime };
        }
        return place;
      });
      return { ...prev, [selectedDayId]: updatedPlaces };
    });
  };

  const handleDaySelectFromSidebar = () => {
    if (showDetailForm) {
      setShowDetailForm(false);
    }
  };

  const handleSubmitProposal = async () => {
    const requireFields = {
      name: '여행 이름',
      startDate: '여행 시작일',
      endDate: '여행 종료일',
      airline: '항공사',
      departureAirportCode: '출발 공항 코드',
      departureAirportName: '출발 공항 이름',
      arrivalAirportCode: '도착 공항 코드',
      arrivalAirportName: '도착 공항 이름',
      startDateBoardingTime: '출발일 비행기 탑승 시간',
      startDateArrivalTime: '여행지 도착 시간',
      endDateBoardingTime: '도착일 비행기 탑승 시간',
      endDateArrivalTime: '한국 도착 시간',
      deposit: '예약금',
      minPeople: '최소인원',
      guideIncluded: '가이드 포함 여부',
      productIntroduction: '상품 소개',
      refundPolicy: '취소/환불 정책',
      insuranceIncluded: '여행자 보험 포함 여부',
    };

    const MissingFields = Object.keys(requireFields).filter((field) => {
      const value = proposalData[field];
      if (typeof value === 'string') {
        return value.trim() === '';
      }
      if (typeof value === 'number') {
        return value === 0;
      }
      return !value;
    });

    if (MissingFields.length > 0) {
      const MissingFielsNames = MissingFields.map(
        (field) => requireFields[field],
      );
      Swal.fire({
        icon: 'warning',
        title: '필수 항목이 누락되었습니다.',
        text: `다음 항목을 채워주세요 => ${MissingFielsNames.join(',')}`,
        confirmButtonText: '확인',
        confirmButtonColor: '#412B2B',
      });
      return;
    }

    const schedules = Object.values(selectedPlacesByDay)
      .flat()
      .map(({ placeId, ...rest }) => rest);
    console.log('POST 전송할 스케줄 데이터:', schedules);

    const invalidScheduleItem = schedules.find((item) => {
      return (
        !item.startTime ||
        (typeof item.startTime === 'string' && item.startTime.trim() === '') ||
        !item.endTime ||
        (typeof item.endTime === 'string' && item.endTime.trim() === '')
      );
    });

    if (invalidScheduleItem) {
      Swal.fire({
        icon: 'warning',
        title: '모든 일정 항목에 시작 시간과 종료 시간을 입력해주세요,',
        confirmButtonText: '확인',
        confirmButtonColor: '#412B2B',
      });
      return;
    }

    const payload = {
      ...proposalData,
      scheduleItems: schedules,
    };

    console.log('POST할 데이터:', payload);

    try {
      let data;
      // travelPlanId를 조건에 따라 분기 처리
      let travelPlanId;
      if (proposal.data && proposal.data.travelPlan) {
        travelPlanId = proposal.data.travelPlan.travelPlanId;
      } else {
        travelPlanId = proposal.travelPlanId;
      }

      if (proposal.proposalId) {
        data = await UpdateTravelProposal(
          travelPlanId,
          proposal.proposalId,
          payload,
        );
        console.log('수정 성공:', data);
      } else {
        data = await CreateTravelProposal(travelPlanId, payload);
        console.log('제출 성공:', data);
      }
      return data;
    } catch (error) {
      console.error('제출 오류:', error);
    }
  };

  return (
    <StyledMainLayout>
      {/* 사이드바 */}
      <StyledDateSidebar>
        <DateSidebar
          onToggleDetailForm={toggleDetailForm}
          onDaySelect={handleDaySelectFromSidebar}
          onSubmit={handleSubmitProposal}
        />
      </StyledDateSidebar>

      {/* 사이드바 제외 영역 */}
      <ContentArea>
        {showDetailForm ? (
          <DetailFormWrapper>
            <DetailForm
              proposalData={proposalData}
              setProposalData={setProposalData}
            />
          </DetailFormWrapper>
        ) : (
          <>
            <StyleScheduleByDate>
              <ScheduleByDate
                onTogglePlaceSelection={togglePlaceSelection}
                selectedDayNumber={selectedDayId}
                selectedPlaces={currentDayPlaces}
                onDeletePlace={handleDeletePlace}
                onAddTime={handleSetTime}
                arrivalCity={arrivalCity}
              />
            </StyleScheduleByDate>
            <StyledMapDisplay>
              <StyleMapContainer>
                <MapDisplay
                  arrivalCity={arrivalCity.name}
                  selectedPlaces={currentDayPlaces}
                  day={selectedDayId}
                />
                {showPlaceSelection && (
                  <StylePlaceSelection show="true">
                    <PlaceSelection onSelectPlace={handleSelectPlace} />
                  </StylePlaceSelection>
                )}
              </StyleMapContainer>
            </StyledMapDisplay>
          </>
        )}
      </ContentArea>
    </StyledMainLayout>
  );
};

export default MainLayout;
