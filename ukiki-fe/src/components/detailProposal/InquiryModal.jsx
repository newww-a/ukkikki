// InquiryModal.jsx
import { useState, useEffect } from 'react';
import { getInquiries, updateInquiryAnswer } from '../../api/agency';
import { FaReply, FaPaperPlane } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

// 개별 문의 항목 컴포넌트: 제목 클릭 시 상세 내용이 펼쳐지며, 답변이 있는 경우 오른쪽에 표시
const InquiryItem = ({ inquiry, onSubmitAnswer }) => {
  const [expanded, setExpanded] = useState(false);
  const [localAnswer, setLocalAnswer] = useState('');

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!localAnswer.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }
    await onSubmitAnswer(inquiry.inquiryId, localAnswer);
    setLocalAnswer('');
    setExpanded(false);
  };

  return (
    <div className="p-4 mb-2 border rounded bg-gray-50" data-aos="fade-up">
      <div onClick={toggleExpanded} className="cursor-pointer">
        <p className="text-xl text-gray-800">{inquiry.title}</p>
        {expanded && <hr className="mt-2 border-gray-300" />}
      </div>
      {expanded && (
        <div className="mt-2 ml-4">
          <p>{inquiry.content}</p>
          {inquiry.answer ? (
            <div className="flex items-center mt-2">
              <FaReply className="mr-2 rotate-180 text-yellow" />
              <div className="p-2 bg-gray-100 rounded">
                <p>
                  <strong>답변 :</strong> {inquiry.answer}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={localAnswer}
                onChange={(e) => setLocalAnswer(e.target.value)}
                placeholder="여행사 답변을 입력하세요"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleSubmit}
                className="p-2 ml-2 bg-white rounded-full text-yellow"
              >
                <FaReply size={24} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InquiryModal = ({ travelPlanId, proposalId, onClose }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // AOS 초기화
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // 문의 목록 조회
  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const response = await getInquiries(travelPlanId, proposalId);
        if (response?.data) {
          setInquiries(response.data);
        }
      } catch (err) {
        console.error('문의 목록 조회 실패:', err);
        setError('문의 목록을 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [travelPlanId, proposalId]);

  // 문의 답변 제출
  const handleSubmitAnswer = async (inquiryId, answer) => {
    try {
      const payload = { answer };
      const response = await updateInquiryAnswer(
        travelPlanId,
        proposalId,
        inquiryId,
        payload,
      );
      // 응답 상태가 200이 아니면 실패로 간주
      if (response?.status !== 200) {
        alert('답변 제출에 실패했습니다.');
        return;
      }
      alert('답변이 성공적으로 제출되었습니다.');
      // 해당 문의의 답변 업데이트
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.inquiryId === inquiryId ? { ...inq, answer } : inq,
        ),
      );
    } catch (err) {
      console.error('답변 제출 실패:', err);
      alert('답변 제출에 실패했습니다.');
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] h-[600px] overflow-auto">
        <div className="flex justify-between mb-4">
          <h2 className="mb-2 text-xl font-bold">문의 목록</h2>
          <button className="font-bold text-black" onClick={onClose}>
            닫기
          </button>
        </div>
        {loading ? (
          <p className="text-center">로딩 중...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <p className="text-center text-gray-500">문의가 없습니다.</p>
            ) : (
              inquiries.map((inquiry) => (
                <InquiryItem
                  key={inquiry.inquiryId}
                  inquiry={inquiry}
                  onSubmitAnswer={handleSubmitAnswer}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
