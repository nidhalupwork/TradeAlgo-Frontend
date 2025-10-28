import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TutorialsManager } from './TutorialsManager';
import { ModulesManager } from './ModulesManager';
import { LessonsManager } from './LessonsManager';
import { toast } from 'sonner';
import { PageDescription, PageHeader } from '@/components/components/PageHeader';
import { useEffect, useMemo, useState } from 'react';
import { Lesson, Module, Tutorial } from '@/lib/types';
import Api from '@/services/Api';
import { Spinner } from '@/components/ui/Spinner';

const AdminTutorial = () => {
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const [modules, lessons] = useMemo(() => {
    const tempModules = [];
    const tempLessons = [];
    tutorials.map((tutorial) => {
      tutorial.modules.map((module) => {
        tempModules.push({ ...module, tutorialTitle: tutorial.title, tutorialId: tutorial._id.toString() });
        module.lessons.map((lesson) => {
          tempLessons.push({
            ...lesson,
            moduleTitle: module.title,
            moduleId: module?._id?.toString() ?? '',
            tutorialTitle: tutorial.title,
            tutorialId: tutorial._id,
          });
        });
      });
    });
    return [tempModules, tempLessons];
  }, [tutorials]);

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

  if (isLoading)
    return (
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
        <Spinner className="w-12 h-12" />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <div>
        <PageHeader>Tutorials Management</PageHeader>
        <PageDescription>Your journey to smarter, sharper trading starts here.</PageDescription>
      </div>

      <div className="mx-auto">
        <Tabs defaultValue="tutorials" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tutorials">Courses</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
          </TabsList>

          <TabsContent value="tutorials">
            <TutorialsManager tutorials={tutorials} setTutorials={setTutorials} />
          </TabsContent>

          <TabsContent value="modules">
            <ModulesManager tutorials={tutorials} modules={modules} setTutorials={setTutorials} />
          </TabsContent>

          <TabsContent value="lessons">
            <LessonsManager tutorials={tutorials} modules={modules} lessons={lessons} setTutorials={setTutorials} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminTutorial;
