import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import Api from '@/services/Api';
import { Tutorial } from '@/lib/types';

export const TutorialsManager = ({
  tutorials,
  setTutorials,
}: {
  tutorials: Tutorial[];
  setTutorials: React.Dispatch<React.SetStateAction<Tutorial[]>>;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      editingTutorial &&
      formData.title === editingTutorial.title &&
      formData.description === editingTutorial.description
    ) {
      toast.warning('No changed detected.');
      return;
    }
    setIsLoading(true);
    try {
      if (editingTutorial) {
        const data = await Api.post('/tutorial/update-tutorial', { ...formData, tutorialId: editingTutorial._id });
        console.log('Data to update tutorial:', data);
        if (data?.success) {
          setTutorials((prev) =>
            prev.map((t) => {
              if (t._id === data.tutorial._id) {
                return data.tutorial;
              } else {
                return t;
              }
            })
          );
          setDialogOpen(false);
          setFormData({ title: '', description: '' });
          setEditingTutorial(null);
        }
      } else {
        const data = await Api.post('/tutorial/create-tutorial', formData);
        console.log('Data to create tutorial:', data);
        if (data.success) {
          toast.success(editingTutorial ? 'Tutorial updated successfully' : 'Tutorial created successfully');
          setTutorials([...tutorials, data.tutorial]);
          setDialogOpen(false);
          setFormData({ title: '', description: '' });
          setEditingTutorial(null);
        }
      }
    } catch (error) {
      console.error('Error while creating tutorial');
      toast.error(error?.response?.data?.message ?? 'Unexpected error');
    }
    setIsLoading(false);
  };

  const handleEdit = (tutorial: Tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({ title: tutorial.title, description: tutorial.description || '' });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this tutorial? This will also delete all associated modules and lessons.'
      )
    ) {
      return;
    }
    // Logic will be implemented later
    toast.success('Tutorial deleted successfully');
  };

  const handleDialogClose = () => {
    if (isLoading) return;
    setDialogOpen(false);
    setEditingTutorial(null);
    setFormData({ title: '', description: '' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Courses Management</CardTitle>
          <Button
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tutorials.map((tutorial) => (
              <TableRow key={tutorial._id}>
                <TableCell className="font-medium">{tutorial.title}</TableCell>
                <TableCell className="text-muted-foreground">{tutorial.description || '—'}</TableCell>
                <TableCell className="text-muted-foreground">{tutorial.modules.length}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tutorial)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(tutorial._id)}>
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
            <DialogTitle>{editingTutorial ? 'Edit Tutorial' : 'Create Tutorial'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                rows={4}
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingTutorial ? 'Update' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
