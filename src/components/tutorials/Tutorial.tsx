import Api from '@/services/Api';
import { PageDescription, PageHeader } from '../components/PageHeader';
import TutorialItem from './TutorialItem';
import { useEffect, useState } from 'react';
import { Tutorial } from '@/lib/types';

// const tutorials = [
//   {
//     id: 0,
//     title: 'ICT price action crash course',
//     description: 'One stop shop for all you need to become profitable as a manual trader.',
//     image: tutorialImage,
//   },
//   {
//     id: 1,
//     title: 'Profitability plan',
//     description:
//       "You'll learn exactly how to become a profitable trader FAST and as soon as today using our automated trading software — whether you're starting with personal capital or a prop firm account.",
//     image: tutorialImage,
//   },
// ];

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
