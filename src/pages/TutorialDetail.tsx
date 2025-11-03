import Navbar from '@/components/Navbar';
import { ModuleItem } from '@/components/tutorials/ModuleItem';
import { Tutorial } from '@/lib/types';
import Api from '@/services/Api';
import { useEffect, useState, useRef, createRef } from 'react';
import { useParams } from 'react-router-dom';

const TutorialDetail = () => {
  const params = useParams();
  const [tutorial, setTutorial] = useState<Tutorial>();
  const [isLoading, setIsLoading] = useState(false);
  const moduleRefs = useRef<Array<React.RefObject<{ openModule: () => void }>>>([]);

  useEffect(() => {
    fetchTutorial();
  }, []);

  const fetchTutorial = async () => {
    setIsLoading(true);
    try {
      const data = await Api.get(`/tutorial/${params.tutorialId}`);
      console.log('data to fetch tutorial by id:', data);
      if (data.success) {
        setTutorial(data.tutorial);
      }
    } catch (error) {
      console.error('Error while fetching tutorial:', error);
    }
    setIsLoading(false);
  };

  // Initialize refs when tutorial is loaded
  useEffect(() => {
    if (tutorial?.modules) {
      moduleRefs.current = tutorial.modules.map((_, i) => moduleRefs.current[i] || createRef());
    }
  }, [tutorial]);

  const handleRequestNextModule = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < (tutorial?.modules.length || 0)) {
      // Open the next module
      moduleRefs.current[nextIndex]?.current?.openModule();
      
      // Scroll to the next module
      setTimeout(() => {
        const nextModuleElement = document.getElementById(`module-${nextIndex}`);
        if (nextModuleElement) {
          nextModuleElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background main">
      <Navbar />
      <div className="pt-16">
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold">{tutorial?.title}</h3>

          <div className="flex flex-col gap-4">
            {tutorial?.modules.map((mod, index) => (
              <div key={index} id={`module-${index}`}>
                <ModuleItem 
                  ref={moduleRefs.current[index]} 
                  module={mod} 
                  index={index + 1}
                  onRequestNextModule={() => handleRequestNextModule(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialDetail;
