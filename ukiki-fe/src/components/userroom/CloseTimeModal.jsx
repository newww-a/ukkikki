import { useState } from 'react';
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';

const CloseTimeModal = ({
  initialCloseTime,
  minDateTime,
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const [closeTime, setCloseTime] = useState(initialCloseTime || '');

  const handleDateTimeChange = (e) => {
    setCloseTime(e.target.value);
  };

  const handleSubmit = () => {
    if (!closeTime) {
      Swal.fire({
        title: '⚠️ 입력 필요!',
        text: '날짜와 시간을 입력해주세요.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }
    onSubmit(closeTime);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-center">마감일자 설정</h2>
        <p className="mb-4 text-center text-gray-600">
          현재로부터 최소 24시간 이후의 날짜와 시간을 선택해주세요.
        </p>
        <input
          type="datetime-local"
          value={closeTime}
          onChange={handleDateTimeChange}
          min={minDateTime}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {isSubmitting ? '설정 중...' : '설정'}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') 
  );
};

export default CloseTimeModal;
