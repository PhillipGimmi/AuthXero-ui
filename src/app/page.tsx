import DashboardSection from '../components/frontendsections/dashboardSection';
import HeroSection from '../components/frontendsections/herosection';
import ComplianceSection from '../components/frontendsections/ComplianceSection';
import FloatingNav from '@/components/FloatingNav';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div>
        <div>
          <FloatingNav />
          <HeroSection />
          <DashboardSection />
          <ComplianceSection />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
