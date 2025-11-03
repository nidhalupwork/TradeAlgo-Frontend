import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Announcement } from '@/lib/types';
import { Megaphone, Calendar, Image as ImageIcon, X, Loader2, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';
import { MultiSelect } from '@/components/components/MultiSelect';
import { Checkbox } from '@/components/ui/checkbox';
import Api from '@/services/Api';
import { PageHeader } from '@/components/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadToIPFS } from '@/utils/utils';
import { AxiosProgressEvent } from 'axios';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    expireTime: '',
    to: [],
    imageUrl: '',
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [imageSource, setImageSource] = useState<'uploaded' | 'new'>('uploaded');
  const [uploadedAnnouncementImages, setUploadedAnnouncementImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'support', label: 'Support' },
    { value: 'user', label: 'User' },
  ];

  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Fetch uploaded announcement images when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      fetchUploadedImages();
    }
  }, [isDialogOpen]);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await Api.get('/announcement');
      console.log('data for fethcing announcements:', data);
      if (data?.success) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Error while fetching all announcements:', error);
      toast.error(error?.response?.data?.message ?? 'Unexpected error');
    }
    setIsLoading(false);
  };

  const fetchUploadedImages = async () => {
    setIsLoadingImages(true);
    try {
      const data = await Api.get('/images');
      if (data?.success) {
        // Filter only announcement type images
        const announcementImages = data.images.filter((img: any) => img.type === 'announcement');
        setUploadedAnnouncementImages(announcementImages);
      }
    } catch (error) {
      console.error('Error fetching announcement images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedImage(file);
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
      }
    },
  });

  const handleCreateAnnouncement = async () => {
    if (
      !newAnnouncement.title ||
      !newAnnouncement.message ||
      !newAnnouncement.expireTime ||
      newAnnouncement.to.length === 0
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = newAnnouncement.imageUrl;

      // Upload new image to IPFS if provided
      if (imageSource === 'new' && uploadedImage) {
        imageUrl = await uploadToIPFS(uploadedImage, (event: AxiosProgressEvent) => {
          if (event.total) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          }
        }).catch((err) => {
          console.log(err);
          throw new Error('Image upload failed to IPFS. Please retry.');
        });
      }

      const data = await Api.post('/announcement/create-announce', {
        ...newAnnouncement,
        imageUrl,
      });
      if (data?.success) {
        toast.success('Announcement created successfully!');
        setAnnouncements([data?.announcement, ...announcements]);
        // Reset form
        setNewAnnouncement({ title: '', message: '', expireTime: '', to: [], imageUrl: '' });
        setUploadedImage(null);
        setImagePreview('');
        setImageSource('uploaded');
        setUploadProgress(0);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error(error?.response?.data?.message ?? 'Failed to create announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const data = await Api.delete(`/announcement/${id}`);
      if (data?.success) {
        toast.success('Announcement deleted successfully');
        // Remove the deleted announcement from state
        setAnnouncements(announcements.filter((announcement) => announcement._id !== id));
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error(error?.response?.data?.message ?? 'Failed to delete announcement');
    }
  };

  const isExpired = (expireTime: string) => {
    return new Date(expireTime) < new Date();
  };

  const onCheckedChange = (value: string) => {
    if (newAnnouncement.to.includes(value)) {
      setNewAnnouncement({ ...newAnnouncement, to: newAnnouncement.to.filter((v) => v !== value) });
    } else {
      setNewAnnouncement({ ...newAnnouncement, to: [...newAnnouncement.to, value] });
    }
  };

  return (
    <div className='bg-background p-6'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <PageHeader>Announcement Management</PageHeader>
          <p className='text-muted-foreground'>Create and manage announcements for all users</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size='lg'>
          <Megaphone className='mr-2 h-5 w-5' />
          New Announcement
        </Button>
      </div>

      {isLoading && announcements.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className='text-center py-12'>
          <Megaphone className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-muted-foreground'>No announcements yet. Create your first one!</p>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {announcements.map((announcement) => (
            <Card key={announcement._id} className={isExpired(announcement.expireTime) ? 'opacity-60' : ''}>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-xl'>{announcement.title}</CardTitle>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                    className='h-8 w-8'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
                <CardDescription className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  {isExpired(announcement.expireTime) ? (
                    <span className='text-destructive'>
                      Expired on {format(new Date(announcement.expireTime), 'PPP')}
                    </span>
                  ) : (
                    <span>Expires {format(new Date(announcement.expireTime), 'PPP')}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {announcement.imageUrl && (
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className='w-full h-48 object-cover rounded-md mb-4'
                  />
                )}
                <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{announcement.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Announcement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto touch-auto'>
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>
              Send an announcement to all users. It will be delivered via real-time connection.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title *</Label>
              <Input
                id='title'
                placeholder='Enter announcement title'
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='message'>Message *</Label>
              <Textarea
                id='message'
                placeholder='Enter announcement message'
                rows={5}
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
              />
            </div>

            <div className='space-y-2 relative'>
              <Label>To *</Label>
              <div className='flex gap-3 items-center'>
                {roles.map((role) => (
                  <div key={role.value} className='flex gap-2 items-center'>
                    <Checkbox
                      checked={newAnnouncement.to.includes(role.value)}
                      onClick={() => onCheckedChange(role.value)}
                    />
                    <span className='text-muted-foreground text-sm'>{role.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-2 relative'>
              <Label htmlFor='expireTime'>Expire Date & Time *</Label>
              <Input
                id='expireTime'
                type='date'
                value={newAnnouncement.expireTime}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expireTime: e.target.value })}
              />
            </div>

            {/* Image Section */}
            <div className='space-y-2'>
              <Label>Image (Optional)</Label>
              <Tabs value={imageSource} onValueChange={(val) => setImageSource(val as 'uploaded' | 'new')}>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='uploaded'>Select Uploaded</TabsTrigger>
                  <TabsTrigger value='new'>Upload New</TabsTrigger>
                </TabsList>

                {/* Select from Uploaded Images */}
                <TabsContent value='uploaded' className='space-y-3'>
                  {isLoadingImages ? (
                    <div className='flex items-center justify-center py-12 border rounded-lg'>
                      <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                    </div>
                  ) : uploadedAnnouncementImages.length === 0 ? (
                    <div className='text-center py-12 border rounded-lg'>
                      <ImageIcon className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
                      <p className='text-sm text-muted-foreground'>No announcement images uploaded yet</p>
                      <p className='text-xs text-muted-foreground mt-2'>
                        Go to Image Management to upload announcement images
                      </p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto border rounded-lg p-3'>
                      {uploadedAnnouncementImages.map((img) => {
                        const isSelected = newAnnouncement.imageUrl === img.ipfsUrl;
                        return (
                          <div
                            key={img._id}
                            onClick={() => {
                              if (isSelected) {
                                setNewAnnouncement({ ...newAnnouncement, imageUrl: '' });
                              } else {
                                setNewAnnouncement({ ...newAnnouncement, imageUrl: img.ipfsUrl });
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
                            <p className='text-[10px] text-center mt-1 text-muted-foreground truncate'>
                              {img.fileName}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {newAnnouncement.imageUrl && imageSource === 'uploaded' && (
                    <div className='flex items-center justify-between p-2 bg-muted/50 rounded'>
                      <span className='text-sm'>Image selected</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setNewAnnouncement({ ...newAnnouncement, imageUrl: '' })}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Upload New Image */}
                <TabsContent value='new' className='space-y-3'>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                    {isDragActive ? (
                      <p className='text-sm text-muted-foreground'>Drop the image here...</p>
                    ) : (
                      <div>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Drag & drop an image here, or click to select
                        </p>
                        <p className='text-xs text-muted-foreground'>PNG, JPG, GIF, WEBP (will be uploaded to IPFS)</p>
                      </div>
                    )}
                  </div>

                  {imagePreview && (
                    <div className='relative'>
                      <img src={imagePreview} alt='Preview' className='w-full h-48 object-cover rounded-lg' />
                      <Button
                        variant='destructive'
                        size='icon'
                        className='absolute top-2 right-2'
                        onClick={() => {
                          setUploadedImage(null);
                          setImagePreview('');
                          URL.revokeObjectURL(imagePreview);
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  )}

                  {isLoading && uploadProgress > 0 && imageSource === 'new' && (
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span>Uploading to IPFS...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className='w-full bg-secondary rounded-full h-2'>
                        <div
                          className='bg-primary h-2 rounded-full transition-all duration-300'
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Announcement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementManagement;
