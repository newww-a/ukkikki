import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicRequest } from '../../api/customAxios';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';
import InquiryCard from './InquiryCard'; // 위에서 작성한 InquiryCard 컴포넌트 import

const ProposalDetailContact = () => {
  const { travelPlanId, proposalId } = useParams();
  const [inquiries, setInquiries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  // 문의 목록 조회 함수
  const fetchInquiries = async () => {
    try {
      const response = await publicRequest.get(
        `/api/v1/travel-plans/${travelPlanId}/proposals/${proposalId}/inquiries`,
      );
      if (response.status === 200) {
        console.log('문의사항 조회 결과:', response.data.data);
        setInquiries(response.data.data);
      }
    } catch (error) {
      console.error('문의사항 조회 실패:', error);
      Swal.fire('오류', '문의사항을 불러오는 데 실패했습니다.', 'error');
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchInquiries();
  }, [travelPlanId, proposalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      Swal.fire('알림', '제목과 내용을 모두 입력해주세요.', 'warning');
      return;
    }
    try {
      const body = { title: title.trim(), content: content.trim() };
      const response = await publicRequest.post(
        `/api/v1/travel-plans/${travelPlanId}/proposals/${proposalId}/inquiries`,
        body,
      );
      if (response.status === 200) {
        Swal.fire('성공', '문의사항이 등록되었습니다.', 'success');
        setTitle('');
        setContent('');
        fetchInquiries(); // 문의 목록 갱신
        setShowInquiryForm(false);
      }
    } catch (error) {
      console.error('문의사항 등록 실패:', error);
      Swal.fire('오류', '문의사항 등록에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="mt-8">
      {/* 상단 헤더 - 문의하기 제목 및 오른쪽 버튼들 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">문의하기</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowInquiryForm(true)}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            문의하기
          </button>
        </div>
      </div>
      {/* 문의 작성 폼 */}
      {showInquiryForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 mb-8 bg-white border rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block mb-1 font-semibold">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="문의 제목을 입력해주세요."
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="문의 내용을 입력해주세요."
              rows={4}
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            disabled={loading}
          >
            등록하기
          </button>
        </form>
      )}
      {/* 문의 목록 */}
      <div>
        {inquiries.length === 0 ? (
          <p className="text-gray-500">등록된 문의사항이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <InquiryCard
                key={inquiry.id}
                inquiry={inquiry}
                onSubmitAnswer={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalDetailContact;
