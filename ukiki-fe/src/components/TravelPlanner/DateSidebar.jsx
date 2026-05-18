import { useContext, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TravelPlanDetailContext from '../../contexts/TravelPlanDetailContext';
import ProposalDetailContext from '../../contexts/ProposalDetailContext';
import {
  SidebarContainer,
  ButtonList,
  ScheduleButton,
  DetailButton,
  SubmitButton,
} from './style/DateSidebarStyle';

const DateSidebar = ({ onToggleDetailForm, onDaySelect, onSubmit }) => {
  const travelPlanContext = useContext(TravelPlanDetailContext);
  const proposalDetailContext = useContext(ProposalDetailContext);
  const navigate = useNavigate();

  const contextSelectedDayId =
    proposalDetailContext?.selectedDayId !== undefined
      ? proposalDetailContext.selectedDayId
      : travelPlanContext?.selectedDayId;
  const contextSetSelectedDay =
    proposalDetailContext?.setSelectedDay || travelPlanContext?.setSelectedDay;

  const [localSelectedDayId, setLocalSelectedDayId] = useState(1);
  const selectedDayId =
    contextSelectedDayId !== undefined
      ? contextSelectedDayId
      : localSelectedDayId;
  const setSelectedDay = contextSetSelectedDay || setLocalSelectedDayId;

  const proposal =
    proposalDetailContext?.proposal || travelPlanContext?.proposal;

  const travelPlan =
    proposal && proposal.data && proposal.data.travelPlan
      ? proposal.data.travelPlan
      : proposal;

  const travelDays = useMemo(() => {
    if (!proposal) return [];
    const { startDate, endDate } = travelPlan;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return Array.from({ length: diffDays }, (_, i) => ({
      id: i + 1,
      label: `${i + 1}일차`,
      date: new Date(start.getTime() + i * 86400000)
        .toISOString()
        .split('T')[0],
    }));
  }, [proposal, travelPlan]);

  useEffect(() => {
    if (
      proposal &&
      (selectedDayId == null || selectedDayId === 0) &&
      travelDays.length > 0
    ) {
      setSelectedDay(travelDays[0].id);
    }
  }, [proposal, selectedDayId, travelDays, setSelectedDay]);

  if (!proposal) {
    return <div>Loading...</div>;
  }

  const handleDaySelect = (dayId) => {
    setSelectedDay(dayId);
    if (onDaySelect) onDaySelect(dayId);
  };

  const handleDetailClick = () => {
    if (onToggleDetailForm) onToggleDetailForm();
  };

  const handleSubmitClick = async () => {
    if (onSubmit) {
      if (proposal.proposalId) {
        const response = await onSubmit();
        console.log('수정 API 응답:', response);
        if (response && response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '수정이 완료되었습니다.',
            confirmButtonText: '확인',
          }).then(() => {
            navigate(
              `/agency-proposal-detail/${
                travelPlan.travelPlanId || travelPlan.id
              }/${proposal.proposalId}`,
            );
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '제출 오류',
            text: '수정에 실패했습니다.',
          });
        }
      } else {
        Swal.fire({
          icon: 'question',
          title: '제안을 보내시겠습니까?',
          showCancelButton: true,
          confirmButtonText: '보내기',
          cancelButtonText: '취소',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await onSubmit();
            console.log('생성 API 응답:', response);
            const createdProposal =
              response?.proposal || response?.data?.proposal;
            if (createdProposal && createdProposal.proposalId) {
              Swal.fire({
                icon: 'success',
                title: '제안서를 전달했습니다.',
                confirmButtonText: '확인',
              }).then(() => {
                navigate(
                  `/agency-proposal-detail/${
                    travelPlan.travelPlanId || travelPlan.id
                  }/${createdProposal.proposalId}`,
                );
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: '제출 오류',
                text: '제안 제출에 실패했습니다.',
              });
            }
          }
        });
      }
    }
  };

  return (
    <SidebarContainer>
      {/* 날짜 버튼 리스트 */}
      <ButtonList>
        {travelDays.map((day) => (
          <ScheduleButton
            key={day.id}
            active={day.id === selectedDayId}
            onClick={() => handleDaySelect(day.id)}
          >
            {day.label}
          </ScheduleButton>
        ))}
        <DetailButton onClick={handleDetailClick} active={false}>
          상세내용
        </DetailButton>
      </ButtonList>

      {/* 제출 버튼 */}
      <SubmitButton onClick={handleSubmitClick}>
        {proposal && proposal.proposalId ? '수정' : '제출'}
      </SubmitButton>
    </SidebarContainer>
  );
};

export default DateSidebar;
