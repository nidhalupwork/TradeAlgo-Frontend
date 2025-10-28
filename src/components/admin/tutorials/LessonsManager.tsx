import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Lesson, Module, Tutorial } from '@/lib/types';
import Api from '@/services/Api';

export const LessonsManager = ({
  tutorials,
  modules,
  lessons,
  setTutorials,
}: {
  tutorials: Tutorial[];
  modules: Module[];
  lessons: Lesson[];
  setTutorials: React.Dispatch<React.SetStateAction<Tutorial[]>>;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    tutorialId: '',
    moduleId: '',
    title: '',
    description: '',
    video: '',
    order: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let data;
      if (editingLesson) {
        data = await Api.post(`/tutorial/update-lesson/${editingLesson._id}`, {
          ...formData,
          oldTutorialId: editingLesson.tutorialId,
          oldModuleId: editingLesson.moduleId,
          newTutorialId: formData.tutorialId,
          newModuleId: formData.moduleId,
        });
        console.log('data to update module:', data);
      } else {
        data = await Api.post('/tutorial/create-lesson', formData);
        console.log('data to create lesson:', data);
      }

      if (data.success) {
        if (editingLesson) {
          setTutorials(data.tutorials);
        } else {
          setTutorials((prev) =>
            prev.map((t) => {
              if (t._id === data.tutorial._id) {
                return data.tutorial;
              } else {
                return t;
              }
            })
          );
        }

        toast.success(editingLesson ? 'Lesson updated successfully' : 'Lesson created successfully');
        setDialogOpen(false);
        setFormData({ tutorialId: '', moduleId: '', title: '', description: '', video: '', order: 0 });
        setEditingLesson(null);
      }
    } catch (error) {
      console.error('Error while submitting more lesson:', error);
    }
    setIsLoading(false);
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      tutorialId: lesson.tutorialId,
      moduleId: lesson.moduleId,
      title: lesson.title,
      description: lesson.description || '',
      video: lesson.video || '',
      order: lesson.order,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    // Logic will be implemented later
    toast.success('Lesson deleted successfully');
  };

  const handleDialogClose = () => {
    if (isLoading) {
      return;
    }
    setDialogOpen(false);
    setEditingLesson(null);
    setFormData({ tutorialId: '', moduleId: '', title: '', description: '', video: '', order: 0 });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lessons Management</CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lesson
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Video</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons
              .sort((a, b) => {
                // Compare tutorialTitle
                const tutorialComparison = a.tutorialTitle.localeCompare(b.tutorialTitle);
                if (tutorialComparison !== 0) return tutorialComparison;

                // Compare moduleTitle
                const moduleComparison = a.moduleTitle.localeCompare(b.moduleTitle);
                if (moduleComparison !== 0) return moduleComparison;

                // Compare order numerically
                return a.order - b.order;
              })
              .map((lesson, index) => (
                <TableRow key={index}>
                  <TableCell className="text-muted-foreground">{lesson.tutorialTitle}</TableCell>
                  <TableCell className="text-muted-foreground">{lesson.moduleTitle}</TableCell>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.order}</TableCell>
                  <TableCell>{lesson.video}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(lesson)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(lesson.moduleId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Create Lesson'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tutorial */}
            <div className="space-y-2">
              <Label htmlFor="module">Tutorial *</Label>
              <Select
                value={formData.tutorialId}
                onValueChange={(value) => setFormData({ ...formData, tutorialId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {tutorials.map((tutorial) => (
                    <SelectItem key={tutorial._id} value={tutorial._id}>
                      {tutorial.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Module */}
            <div className="space-y-2">
              <Label htmlFor="module">Module *</Label>
              <Select
                value={formData.moduleId}
                onValueChange={(value) => setFormData({ ...formData, moduleId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules
                    .filter((m) => m.tutorialId === formData.tutorialId)
                    .map((module) => (
                      <SelectItem key={module._id} value={module._id}>
                        {module.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            {/* Youtube Video Url */}
            <div className="space-y-2">
              <Label htmlFor="video">Video URL</Label>
              <Input
                id="video"
                type="url"
                value={formData.video}
                onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                placeholder="https://youtube.com/embed/..."
              />
            </div>

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order">Order *</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                required
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingLesson ? 'Update' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
