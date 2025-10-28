import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Module, Tutorial } from '@/lib/types';
import Api from '@/services/Api';

export const ModulesManager = ({
  modules,
  tutorials,
  setTutorials,
}: {
  modules: Module[];
  tutorials: Tutorial[];
  setTutorials: React.Dispatch<React.SetStateAction<Tutorial[]>>;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState({ tutorialId: '', title: '', order: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let data;
      if (editingModule) {
        data = await Api.post(`/tutorial/update-module/${editingModule._id}`, {
          ...formData,
          lessons: editingModule.lessons,
        });
        console.log('data to update module:', data);
      } else {
        data = await Api.post('/tutorial/create-module', formData);
        console.log('data to create module:', data);
      }
      if (data.success) {
        setTutorials((prev) => {
          return prev.map((t) => {
            if (editingModule && editingModule.tutorialId !== formData.tutorialId) {
              if (t._id === editingModule.tutorialId) {
                t.modules = t.modules.filter((m) => m._id !== editingModule._id);
                return t;
              } else if (t._id === data.tutorial._id) {
                return data.tutorial;
              } else {
                return t;
              }
            } else {
              if (t._id === data.tutorial._id) {
                return data.tutorial;
              } else {
                return t;
              }
            }
          });
        });
        toast.success(editingModule ? 'Module updated successfully' : 'Module created successfully');
        setDialogOpen(false);
        setFormData({ tutorialId: '', title: '', order: 0 });
        setEditingModule(null);
      }
    } catch (error) {
      console.error('Error while submitting for module:', error);
    }
    setIsLoading(false);
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      tutorialId: module.tutorialId,
      title: module.title,
      order: module.order,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure? This will delete all lessons in this module.')) return;
    // Logic will be implemented later
    toast.success('Module deleted successfully');
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingModule(null);
    setFormData({ tutorialId: '', title: '', order: 0 });
  };

  const getColor = (module: Module) => {
    const index = tutorials.findIndex((t) => t._id === module.tutorialId);
    if (index % 2 === 0) {
      return 'bg-muted/30';
    }
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Modules Management</CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules
              .sort((a, b) => {
                // Compare by tutorialTitle first
                const titleComparison = a.tutorialTitle.localeCompare(b.tutorialTitle);
                if (titleComparison !== 0) {
                  return titleComparison; // If titles differ, sort by tutorialTitle
                }
                // If titles are same, compare by order
                return a.order - b.order;
              })
              .map((module, index) => (
                <TableRow key={index} className={getColor(module)}>
                  <TableCell className="text-muted-foreground">{module.tutorialTitle}</TableCell>
                  <TableCell className="font-medium">{module.title}</TableCell>
                  <TableCell>{module.order}</TableCell>
                  <TableCell>{module.lessons.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="h-8 w-8" onClick={() => handleEdit(module)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" className="h-8 w-8" onClick={() => handleDelete(module._id)}>
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
            <DialogTitle>{editingModule ? 'Edit Module' : 'Create Module'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tutorial */}
            <div className="space-y-2">
              <Label htmlFor="tutorial">Tutorial *</Label>
              <Select
                value={formData.tutorialId}
                onValueChange={(value) => setFormData({ ...formData, tutorialId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tutorial" />
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

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order_index">Order *</Label>
              <Input
                id="order_index"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                required
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingModule ? 'Update' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
