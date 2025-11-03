import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import Api from '@/services/Api';
import { Tutorial } from '@/lib/types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export const TutorialsManager = ({
  tutorials,
  setTutorials,
}: {
  tutorials: Tutorial[];
  setTutorials: React.Dispatch<React.SetStateAction<Tutorial[]>>;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadedTutorialImages, setUploadedTutorialImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Fetch uploaded tutorial images when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      fetchUploadedImages();
    }
  }, [dialogOpen]);

  const fetchUploadedImages = async () => {
    setIsLoadingImages(true);
    try {
      const data = await Api.get('/images');
      if (data?.success) {
        // Filter only tutorial type images
        const tutorialImages = data.images.filter((img: any) => img.type === 'tutorial');
        setUploadedTutorialImages(tutorialImages);
      }
    } catch (error) {
      console.error('Error fetching tutorial images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form data:', formData);
    e.preventDefault();
    if (
      editingTutorial &&
      formData.title === editingTutorial.title &&
      formData.description === editingTutorial.description &&
      formData.imageUrl === (editingTutorial.image || '')
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
          setFormData({ title: '', description: '', imageUrl: '' });
          setEditingTutorial(null);
        }
      } else {
        const data = await Api.post('/tutorial/create-tutorial', formData);
        console.log('Data to create tutorial:', data);
        if (data.success) {
          toast.success(editingTutorial ? 'Tutorial updated successfully' : 'Tutorial created successfully');
          setTutorials([...tutorials, data.tutorial]);
          setDialogOpen(false);
          setFormData({ title: '', description: '', imageUrl: '' });
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
    console.log('Editing tutorial:', tutorial);
    console.log('Tutorial imageUrl:', tutorial.image);
    setEditingTutorial(tutorial);
    const formDataToSet = {
      title: tutorial.title,
      description: tutorial.description || '',
      imageUrl: tutorial.image || '',
    };
    console.log('Setting formData to:', formDataToSet);
    setFormData(formDataToSet);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTutorialToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tutorialToDelete) return;

    setIsDeleting(true);
    try {
      const data = await Api.delete(`/tutorial/tutorial/${tutorialToDelete}`);
      console.log('Data to delete tutorial:', data);

      if (data?.success) {
        setTutorials((prev) => prev.filter((t) => t._id !== tutorialToDelete));
        toast.success('Tutorial deleted successfully');
        setDeleteModalOpen(false);
        setTutorialToDelete(null);
      }
    } catch (error) {
      console.error('Error while deleting tutorial:', error);
      toast.error(error?.response?.data?.message ?? 'Failed to delete tutorial');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDialogClose = () => {
    if (isLoading) return;
    setDialogOpen(false);
    setEditingTutorial(null);
    setFormData({ title: '', description: '', imageUrl: '' });
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Courses Management</CardTitle>
          <Button
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
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
              <TableHead>Image</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tutorials.map((tutorial) => (
              <TableRow key={tutorial._id}>
                <TableCell className='font-medium'>{tutorial.title}</TableCell>
                <TableCell className='text-muted-foreground'>{tutorial.description || '—'}</TableCell>
                <TableCell>
                  {tutorial.image ? (
                    <img src={tutorial.image} alt={tutorial.title} className='w-12 h-12 object-cover rounded' />
                  ) : (
                    <span className='text-muted-foreground text-xs'>No image</span>
                  )}
                </TableCell>
                <TableCell className='text-muted-foreground'>{tutorial.modules.length}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button variant='outline' size='sm' onClick={() => handleEdit(tutorial)}>
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button variant='destructive' size='sm' onClick={() => handleDeleteClick(tutorial._id)}>
                      <Trash2 className='h-4 w-4' />
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
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Title */}
            <div className='space-y-2'>
              <Label htmlFor='title'>Title *</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label htmlFor='description'>Description *</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Image Selection */}
            <div className='space-y-2'>
              <Label>Tutorial Image (Optional)</Label>
              {isLoadingImages ? (
                <div className='flex items-center justify-center py-12 border rounded-lg'>
                  <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                </div>
              ) : uploadedTutorialImages.length === 0 ? (
                <div className='text-center py-12 border rounded-lg'>
                  <ImageIcon className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
                  <p className='text-sm text-muted-foreground'>No tutorial images uploaded yet</p>
                  <p className='text-xs text-muted-foreground mt-2'>Go to Image Management to upload tutorial images</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto border rounded-lg p-3'>
                    {uploadedTutorialImages.map((img) => {
                      const isSelected = formData.imageUrl === img.ipfsUrl;
                      return (
                        <div
                          key={img._id}
                          onClick={() => {
                            if (isSelected) {
                              setFormData({ ...formData, imageUrl: '' });
                            } else {
                              setFormData({ ...formData, imageUrl: img.ipfsUrl });
                            }
                          }}
                          className={`cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-primary relative ${
                            isSelected ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          {isSelected && (
                            <div className='absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg'>
                              ✓
                            </div>
                          )}
                          <img src={img.ipfsUrl} alt={img.alt} className='w-full h-24 object-cover rounded' />
                          <p className='text-[10px] text-center mt-1 text-muted-foreground truncate'>{img.fileName}</p>
                        </div>
                      );
                    })}
                  </div>
                  {formData.imageUrl && (
                    <div className='flex items-center justify-between p-2 bg-muted/50 rounded'>
                      <span className='text-sm'>Image selected</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        type='button'
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {editingTutorial ? 'Update' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title='Delete Tutorial'
        description='Are you sure you want to delete this tutorial? This will also delete all associated modules and lessons. This action cannot be undone.'
        isLoading={isDeleting}
      />
    </Card>
  );
};
