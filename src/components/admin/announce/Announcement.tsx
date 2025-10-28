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
import { useToast } from '@/hooks/use-toast';
import { Announcement } from '@/lib/types';
import { Megaphone, Calendar, Image as ImageIcon, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';
import { MultiSelect } from '@/components/components/MultiSelect';
import { Checkbox } from '@/components/ui/checkbox';
import Api from '@/services/Api';
import { PageHeader } from '@/components/components/PageHeader';

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
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const { toast } = useToast();
  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'support', label: 'Support' },
    { value: 'user', label: 'User' },
  ];

  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Real-time subscription
  useEffect(() => {}, [toast]);

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
      toast({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Unexpected error',
        variant: 'destructive',
        duration: 2000,
      });
    }
    setIsLoading(false);
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
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (uploadedImage) {
        const fileExt = uploadedImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `announcements/${fileName}`;

        // Note: You'll need to create a storage bucket for this
        // For now, we'll just store the data URL
        imageUrl = imagePreview;
      }

      const data = await Api.post('/announcement/create-announce', { ...newAnnouncement });
      if (data?.success) {
        toast({
          title: 'Success',
          description: 'Announcement created successfully!',
        });
        setAnnouncements([data?.announcement, ...announcements]);
        // Reset form
        setNewAnnouncement({ title: '', message: '', expireTime: '', to: [] });
        setUploadedImage(null);
        setImagePreview('');
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Failed to create announcement',
        variant: 'destructive',
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    // const { error } = await supabase.from('announcements').delete().eq('id', id);
    // if (error) {
    //   toast({
    //     title: 'Error',
    //     description: 'Failed to delete announcement',
    //     variant: 'destructive',
    //   });
    // } else {
    //   toast({
    //     title: 'Success',
    //     description: 'Announcement deleted successfully',
    //   });
    // }
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
    <div className="bg-background p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <PageHeader>Announcement Management</PageHeader>
          <p className="text-muted-foreground">Create and manage announcements for all users</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="lg">
          <Megaphone className="mr-2 h-5 w-5" />
          New Announcement
        </Button>
      </div>

      {isLoading && announcements.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12">
          <Megaphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No announcements yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <Card key={announcement._id} className={isExpired(announcement.expireTime) ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {isExpired(announcement.expireTime) ? (
                    <span className="text-destructive">
                      Expired on {format(new Date(announcement.expireTime), 'PPP')}
                    </span>
                  ) : (
                    <span>Expires {format(new Date(announcement.expireTime), 'PPP')}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {announcement.image_url && (
                  <img
                    src={announcement.image_url}
                    alt={announcement.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{announcement.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Announcement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>
              Send an announcement to all users. It will be delivered via real-time connection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter announcement title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Enter announcement message"
                rows={5}
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
              />
            </div>

            <div className="space-y-2 relative">
              <Label>To *</Label>
              <div className="flex gap-3 items-center">
                {roles.map((role) => (
                  <div key={role.value} className="flex gap-2 items-center">
                    <Checkbox
                      checked={newAnnouncement.to.includes(role.value)}
                      onClick={() => onCheckedChange(role.value)}
                    />
                    <span className="text-muted-foreground text-sm">{role.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="expireTime">Expire Date & Time *</Label>
              <Input
                id="expireTime"
                type="date"
                value={newAnnouncement.expireTime}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expireTime: e.target.value })}
              />
            </div>

            {/* <div className="space-y-2">
                <Label>Image (Optional)</Label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  {isDragActive ? (
                    <p className="text-sm text-muted-foreground">Drop the image here...</p>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag & drop an image here, or click to select
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP up to 10MB</p>
                    </div>
                  )}
                </div>

                {imagePreview && (
                  <div className="relative mt-4">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setUploadedImage(null);
                        setImagePreview('');
                        URL.revokeObjectURL(imagePreview);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div> */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
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
