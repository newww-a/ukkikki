import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { publicRequest } from '../api/customAxios';
import ProposalDetailTimeline from '../components/ProposalDetailForUser/ProposalDetailTimeline';
import ProposalDetailInfo from '../components/ProposalDetailForUser/ProposalDetailInfo';
import ProposalDetailContact from '../components/ProposalDetailForUser/ProposalDetailContact';

const ProposalDetailForUser = () => {
  const { travelPlanId, proposalId } = useParams();
  const navigate = useNavigate();
  // const location = useLocation();
  // const { selectedCard } = location.state || {};

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 기본 탭은 '상세보기'로 설정
  const [activeTab, setActiveTab] = useState('detail');

  // 제안서 상세 정보 API 호출
  useEffect(() => {
    const fetchProposalDetail = async () => {
      setLoading(true);
      try {
        const response = await publicRequest.get(
          `/api/v1/travel-plans/${travelPlanId}/proposals/${proposalId}`,
        );
        if (response.status === 200) {
          console.log('✅ 제안서 정보:', response.data.data);
          setProposal(response.data.data);
        }
      } catch (error) {
        console.error('API 호출 실패:', error);
        setError('제안서 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchProposalDetail();
  }, [travelPlanId, proposalId]);

  // 날짜/시간 포맷 함수
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 상태 배지 렌더링 함수
  const getStatusBadge = (status) => {
    const statusMap = {
      W: { text: '투표 전', className: 'bg-green-100 text-green-800' },
      V: { text: '투표 중', className: 'bg-yellow-100 text-yellow-800' },
      A: { text: '수락', className: 'bg-blue-100 text-blue-800' },
      D: { text: '거절', className: 'bg-red-100 text-red-800' },
    };
    return (
      statusMap[status] || {
        text: '상태 없음',
        className: 'bg-gray-100 text-gray-800',
      }
    );
  };

  if (loading) return <div className="mt-10 text-center">로딩 중...</div>;
  if (error)
    return <div className="mt-10 text-center text-red-500">{error}</div>;
  if (!proposal)
    return (
      <div className="mt-10 text-center">제안서 정보를 찾을 수 없습니다.</div>
    );

  const status = getStatusBadge(proposal.confirmStatus);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 max-w-screen-xl px-4 py-6 mx-auto">
        {/* 상단 섹션 */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <div className="flex gap-6">
            <div>
              <h1 className="mb-4 text-2xl font-bold">
                {proposal.companyName}
              </h1>
              <p className="mb-2">
                여행날짜: {proposal.startDate} ~ {proposal.endDate}
              </p>
              <p className="mb-2">최소 인원: {proposal.minPeople}명</p>
              <p className="mb-2">
                예약금: {proposal.deposit.toLocaleString()}원
              </p>
              <div className="flex gap-2 mt-4">
                진행 상태:{' '}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${status.className}`}
                >
                  {status.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 전환 버튼들 */}
        <div className="mb-4 border-b border-gray-300">
          <div className="flex">
            <button
              onClick={() => setActiveTab('detail')}
              className={`w-1/3 py-2 -mb-px transition-all duration-300 border-b-4 ${
                activeTab === 'detail'
                  ? 'bg-white text-blue-500 border-blue-500'
                  : 'bg-gray-200 text-gray-700 border-transparent hover:bg-gray-300'
              }`}
            >
              상세보기
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`w-1/3 py-2 -mb-px transition-all duration-300 border-b-4 ${
                activeTab === 'timeline'
                  ? 'bg-white text-blue-500 border-blue-500'
                  : 'bg-gray-200 text-gray-700 border-transparent hover:bg-gray-300'
              }`}
            >
              일정
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`w-1/3 py-2 -mb-px transition-all duration-300 border-b-4 ${
                activeTab === 'contact'
                  ? 'bg-white text-blue-500 border-blue-500'
                  : 'bg-gray-200 text-gray-700 border-transparent hover:bg-gray-300'
              }`}
            >
              문의하기
            </button>
          </div>
        </div>

        {/* 탭 내용 렌더링 */}
        {activeTab === 'detail' && (
          <ProposalDetailInfo
            proposal={proposal}
            formatDateTime={formatDateTime}
          />
        )}
        {activeTab === 'timeline' && (
          <ProposalDetailTimeline
            proposal={proposal}
            formatDateTime={formatDateTime}
          />
        )}
        {activeTab === 'contact' && (
          <ProposalDetailContact
            travelPlanId={travelPlanId}
            proposalId={proposalId}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProposalDetailForUser;
