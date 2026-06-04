import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const TimeModal = ({
  isOpen,
  onClose,
  place,
  timeData,
  handleTimeChange,
  handleSaveTime,
}) => {
  if (!place) return null;

  // 현재 입력된 시작, 종료시간을 읽어옵니다.
  const currentStartTime =
    timeData[place.placeId]?.startTime || place.startTime || '';
  const currentEndTime =
    timeData[place.placeId]?.endTime || place.endTime || '';

  // 문자열 "HH:MM"을 분 단위 숫자로 변환하는 함수
  const convertTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 완료 버튼 클릭 핸들러
  const onSave = () => {
    if (
      currentStartTime &&
      currentEndTime &&
      convertTimeToMinutes(currentEndTime) <=
        convertTimeToMinutes(currentStartTime)
    ) {
      Swal.fire({
        icon: 'warning',
        title: '시간 오류',
        text: '종료시간은 시작시간보다 늦은 시간이 되어야 합니다.',
        confirmButtonText: '확인',
      });
      return;
    }
    handleSaveTime(place.placeId, place.dayNumber);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // 배경 오버레이
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* 모달 컨텐츠 */}
          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 차단
          >
            <h3 className="mb-4 text-lg font-bold">
              {place.scheduleName} 시간 설정
            </h3>
            <div className="flex items-center mb-4">
              <input
                type="time"
                step="300" // 5분 단위 (300초)
                placeholder="시작 시간 (HH:MM)"
                value={currentStartTime}
                onChange={(e) =>
                  handleTimeChange(place.placeId, 'startTime', e.target.value)
                }
                className="p-1 mr-4 border rounded"
              />
              <span className="mr-4">~</span>
              <input
                type="time"
                step="300" // 5분 단위
                placeholder="종료 시간 (HH:MM)"
                min={currentStartTime} // 시작시간보다 늦은 값만 선택 가능
                value={currentEndTime}
                onChange={(e) =>
                  handleTimeChange(place.placeId, 'endTime', e.target.value)
                }
                className="p-1 mr-4 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={onSave}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                완료
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimeModal;
