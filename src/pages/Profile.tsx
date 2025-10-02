import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PersonalInfo } from '@/components/profile/PersonalInfo';
import { ConnectedAccounts } from '@/components/profile/ConnectedAccounts';
import { APISettings } from '@/components/profile/APISettings';
import { TradingPreferences } from '@/components/profile/TradingPreferences';
import Navbar from '@/components/Navbar';
import { TwoStep } from '@/components/profile/TwoStep';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle main">
      <div className="mx-auto px-4 py-8 space-y-8">
        <Navbar />
        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <PersonalInfo />
            <TwoStep />
            {/* <TradingPreferences /> */}
          </div>

          <div className="space-y-8">
            <ConnectedAccounts />
            {/* <APISettings /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
