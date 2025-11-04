import Api from '@/services/Api';
import { PageDescription, PageHeader } from '../components/PageHeader';
import TutorialItem from './TutorialItem';
import { useEffect, useState } from 'react';
import { Tutorial } from '@/lib/types';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    setIsLoading(true);
    try {
      const data = await Api.get('/tutorial');
      console.log('All tutorials:', data);
      if (data.success) {
        setTutorials(data.tutorials);
      }
    } catch (error) {
      console.error('Error while fetching tutorials:', error);
    }
    setIsLoading(false);
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <PageHeader>Tutorials</PageHeader>
        <PageDescription>Your journey to smarter, sharper trading starts here.</PageDescription>
      </div>

      {/* Tutorials */}
      <div className="grid grid-cols-1 bml:grid-cols-2 gap-4">
        {tutorials.map((tutorial) => (
          <TutorialItem key={tutorial._id} tutorial={tutorial} />
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
