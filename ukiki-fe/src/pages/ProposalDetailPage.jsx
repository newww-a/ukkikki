import { useParams } from 'react-router';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import 'tailwindcss/tailwind.css';
import { ProposalDetailProvider } from '../contexts/ProposalDetailContext.jsx';
import ProposalDetailContent from '../components/detailProposal/ProposalDetailContent.jsx';

const ProposalDetail = () => {
  const { proposalId, travelPlanId } = useParams();

  return(
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <ProposalDetailProvider proposalId={proposalId} travelPlanId={travelPlanId}>
        <ProposalDetailContent />
      </ProposalDetailProvider>
      <Footer />
    </div>
  );
};
export default ProposalDetail;