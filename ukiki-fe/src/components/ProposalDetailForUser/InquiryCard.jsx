import { useState } from 'react';
import { FaReply } from 'react-icons/fa';

const InquiryCard = ({ inquiry, onSubmitAnswer }) => {
  const [expanded, setExpanded] = useState(false);
  const [localAnswer, setLocalAnswer] = useState('');

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    if (!localAnswer.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }
    await onSubmitAnswer(inquiry.inquiryId, localAnswer);
    setLocalAnswer('');
    setExpanded(false);
  };

  return (
    <div
      data-aos="fade-up"
      className="p-4 mb-2 bg-white border rounded cursor-pointer"
      onClick={toggleExpanded}
    >
      {/* 헤더: 제목과 작성자 */}
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">{inquiry.title}</p>
        <p className="text-sm text-gray-500">작성자: {inquiry.name}</p>
      </div>
      {expanded && (
        <div className="mt-2">
          <hr className="border-gray-300" />
          <div className="mt-2">
            <p>{inquiry.content}</p>
            {inquiry.answer && (
              <div className="flex items-center mt-2">
                <FaReply className="mr-2 rotate-180" />
                <div className="p-2 bg-gray-100 rounded">
                  <p className="text-blue-600">
                    <strong>답변:</strong> {inquiry.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryCard;
