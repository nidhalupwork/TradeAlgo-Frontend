import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tutorial } from '@/lib/types';
import tutorialImage from '@/assets/back2.jpg';
import { Link } from 'react-router-dom';

const TutorialItem = ({ tutorial }: { tutorial: Tutorial }) => {
  return (
    <Card className="rounded-2xl">
      <div className="flex flex-col sm:flex-row w-full h-full">
        <div className="w-full sm:w-56 h-36 sm:h-auto p-0.5">
          <div
            className="bg-cover bg-center bg-no-repeat w-full h-full sm:rounded-2xl rounded-tr-2xl rounded-tl-2xl"
            style={{
              backgroundImage: `url(${tutorialImage})`,
            }}
          >
            <div className="bg-black/30 w-full h-full sm:rounded-2xl" />
          </div>
        </div>
        <div className="flex flex-col flex-1 p-6 justify-between">
          <div className="flex flex-col gap-1">
            <h5 className="text-lg  font-semibold">{tutorial.title}</h5>
            <p className="text-sm">{tutorial.description}</p>
          </div>
          <Link
            to={`/tutorials/${tutorial._id}`}
            className="w-full flex justify-center items-center gap-2 md:gap-4 mt-3"
          >
            <Button variant="outline" className="w-full rounded-full border border-muted-foreground">
              Start Course
              <ChevronRight className="" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default TutorialItem;
