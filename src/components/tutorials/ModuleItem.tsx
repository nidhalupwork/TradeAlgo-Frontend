import { Lesson, Module } from '@/lib/types';
import { ArrowRight, ChevronDown, ChevronUp, Lock, X } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';

export const ModuleItem = ({ module, index }: { module: Module; index: number }) => {
  const [opened, setOpened] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>();
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
                onClick={() => {
                  setSelectedLesson(lesson);
                  setOpenDialog(true);
                }}
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
                <div className="w-36 h-24 bg-white mt-1"></div>
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
              <Button variant="default" className="w-full md:w-auto rounded-full">
                Next lesson
                <ArrowRight />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
