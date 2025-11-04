import { Lesson, Module } from '@/lib/types';
import { ArrowRight, ChevronDown, ChevronUp, Lock, X } from 'lucide-react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';

interface ModuleItemProps {
  module: Module;
  index: number;
  onRequestNextModule?: () => void;
  moduleRef?: React.Ref<{ openModule: () => void }>;
}

export const ModuleItem = forwardRef<{ openModule: () => void }, ModuleItemProps>(
  ({ module, index, onRequestNextModule }, ref) => {
    const [opened, setOpened] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson>();
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      openModule: () => {
        setOpened(true);
      },
    }));

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url: string): string | null => {
      if (!url) return null;
      
      // Handle various YouTube URL formats
      const patterns = [
        /(?:youtube\.com\/embed\/)([\w-]+)/,           // embed format
        /(?:youtube\.com\/watch\?v=)([\w-]+)/,         // watch format
        /(?:youtu\.be\/)([\w-]+)/,                     // short format
        /(?:youtube\.com\/v\/)([\w-]+)/,               // /v/ format
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }

      return null;
    };

    // Get YouTube thumbnail URL
    const getYouTubeThumbnail = (videoUrl: string): string => {
      const videoId = getYouTubeVideoId(videoUrl);
      if (!videoId) return '';
      
      // Using maxresdefault for highest quality, fallback to hqdefault if needed
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    };

    const handleLessonClick = (lesson: Lesson, lessonIndex: number) => {
      setSelectedLesson(lesson);
      setCurrentLessonIndex(lessonIndex);
      setOpenDialog(true);
    };

    const handleNextLesson = () => {
      const nextIndex = currentLessonIndex + 1;

      // Check if there's a next lesson in the current module
      if (nextIndex < module.lessons.length) {
        // Move to next lesson
        setSelectedLesson(module.lessons[nextIndex]);
        setCurrentLessonIndex(nextIndex);
      } else {
        // Last lesson of the module
        setOpenDialog(false);
        if (onRequestNextModule) {
          onRequestNextModule();
        }
      }
    };

    return (
    <div>
      <div
        className="w-full flex justify-between items-center px-6 py-4 bg-muted-foreground/30 hover:bg-muted-foreground/50 rounded-2xl border border-muted-foreground/40 group transition-all cursor-pointer"
        onClick={() => setOpened(!opened)}
      >
        <p className="font-semibold opacity-80 group-hover:opacity-100 transition-all">
          Module {index}, {module.title}
        </p>
        {opened ? <ChevronUp /> : <ChevronDown />}
      </div>
      {opened && (
        <div className="flex flex-col pl-10 my-6 gap-10">
          {module.lessons.length === 0 ? (
            <div className="relative">
              <div className="absolute top-[6px] left-[-27px] size-[17px] bg-red-500 rounded-full flex items-center justify-center">
                <Lock className="w-3 h-3" />
              </div>
              <div className="flex flex-col flex-1 gap-2">
                <p className="font-semibold text-lg">Coming soon!</p>
              </div>
            </div>
          ) : (
            module.lessons.map((lesson, idx) => (
              <div
                key={idx}
                className="flex gap-4 relative hover:cursor-pointer"
                onClick={() => handleLessonClick(lesson, idx)}
              >
                {module.lessons.length !== idx + 1 && (
                  <div className="absolute top-[6px] bottom-[-48px] left-[-20px] w-[3px] bg-black/10 dark:bg-white/10" />
                )}
                <div className="absolute top-[6px] left-[-27px] size-[17px] bg-gray-400 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <p className="font-semibold text-lg">{lesson.title}</p>
                  <p className="text-sm whitespace-pre-wrap">{lesson.description}</p>
                </div>
                <div className="w-36 h-24 mt-1 flex-shrink-0">
                  {lesson.video && getYouTubeThumbnail(lesson.video) ? (
                    <img
                      src={getYouTubeThumbnail(lesson.video)}
                      alt={`${lesson.title} thumbnail`}
                      className="w-full h-full object-cover rounded-lg border border-border"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg border border-border flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">No thumbnail</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-5xl max-h-screen overflow-y-auto touch-auto">
          <DialogHeader>
            <DialogTitle className="text-center">{selectedLesson?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col p-6 md:p-8 gap-6">
            <div className="flex justify-center">
              <p className="max-w-xl text-center text-sm whitespace-pre-wrap">{selectedLesson?.description}</p>
            </div>
            {/* <video className="w-full" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video> */}
            <iframe className="w-full h-full aspect-video" src={selectedLesson?.video} allowFullScreen />
            <div className="flex flex-col items-center md:items-end">
              <Button 
                variant="default" 
                className="w-full md:w-auto rounded-full"
                onClick={handleNextLesson}
              >
                {currentLessonIndex < module.lessons.length - 1 ? 'Next lesson' : 'Next module'}
                <ArrowRight />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
