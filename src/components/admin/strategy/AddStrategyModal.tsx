import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ImageIcon, Loader2, TrendingUp, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StrategyInterface } from '@/lib/types';
import apiClient from '@/services/Api';
import { useAuth } from '@/providers/AuthProvider';
import Api from '@/services/Api';
import { useAdmin } from '@/providers/AdminProvider';
import { useDropzone } from 'react-dropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currencyFlags } from './flags';

interface AddStrategyModalProps {
  selectedStrategy: StrategyInterface;
  open: 'Edit' | 'Add' | 'Delete' | '';
  onOpenChange: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddStrategyModal = ({
  open,
  onOpenChange,
  selectedStrategy,
  isLoading,
  setIsLoading,
}: AddStrategyModalProps) => {
  const { setStrategies, strategies } = useAdmin();
  const [strategy, setStrategy] = useState({
    id: '',
    title: '',
    description: '',
    symbol: '',
    status: 'Live',
    images: [],
  });
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imageSource, setImageSource] = useState<'default' | 'upload'>('default');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 2,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const availableSlots = 2 - uploadedImages.length;
      const newFiles = acceptedFiles.slice(0, availableSlots);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));

      setUploadedImages((prev) => [...prev, ...newFiles]);
      setStrategy((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
      setImageSource('upload');
    },
  });

  useEffect(() => {
    if (selectedStrategy) {
      setStrategy({
        id: selectedStrategy._id,
        title: selectedStrategy.title,
        description: selectedStrategy.description,
        symbol: selectedStrategy.symbol ?? '',
        status: selectedStrategy.status,
        images: selectedStrategy.images,
      });
    } else {
      setStrategy({
        id: '',
        title: '',
        description: '',
        symbol: '',
        status: 'Live',
        images: [],
      });
    }
  }, [selectedStrategy]);

  async function handleSubmit(type: 'Add' | 'Edit' | 'Delete' | '') {
    try {
      if (type === 'Add') {
        setIsLoading(true);
        const data = await Api.post('/strategy/add-strategy', strategy);
        console.log('strategy add:', data);
        if (data?.success) {
          setStrategies([...strategies, data.strategy]);
        }
      } else if (type === 'Edit') {
        // if (
        //   strategy.title == selectedStrategy.title &&
        //   strategy.description == selectedStrategy.description &&
        //   strategy.status == selectedStrategy.status
        // ) {
        //   onOpenChange();
        //   return;
        // }
        setIsLoading(true);
        const data = await Api.post('/strategy/update-strategy', strategy);
        console.log('strategy add:', data);
        if (data?.success) {
          setStrategies((prev) =>
            prev.map((s) => {
              return s._id === data.strategy._id ? data.strategy : s;
            })
          );
        }
      }
      setIsLoading(false);
      onOpenChange();
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Unexpected Error',
      });
    }
  }

  return (
    <Dialog open={open === 'Add' || open === 'Edit'} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="Strategy Management">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            {open} Strategy
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter the title of strategy"
              value={strategy.title}
              onChange={(e) => setStrategy({ ...strategy, title: e.target.value })}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter the description of strategy"
              value={strategy.description}
              onChange={(e) => setStrategy({ ...strategy, description: e.target.value })}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              placeholder="Enter the symbol of strategy"
              value={strategy.symbol}
              onChange={(e) => setStrategy({ ...strategy, symbol: e.target.value })}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="loginNumber">Status</Label>
            <Select value={strategy.status} onValueChange={(value) => setStrategy({ ...strategy, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Strategy Images (Max 2)</Label>
            <Tabs
              value={imageSource}
              onValueChange={(val) => {
                setImageSource(val as 'default' | 'upload');
                // setSelectedImages([]);
                // setUploadedImages([]);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="default">Default Images</TabsTrigger>
                {/* <TabsTrigger value="upload">Upload Images</TabsTrigger> */}
              </TabsList>
              <TabsContent value="default" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Select up to 2 images ({strategy.images.length}/2 selected)
                  </p>
                  {strategy.images.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setStrategy({ ...strategy, images: [] })}>
                      Clear Selection
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto border rounded-lg p-3">
                  {currencyFlags.map((img) => {
                    const isSelected = strategy.images.includes(img.url);
                    const selectionIndex = strategy.images.indexOf(img.url);
                    return (
                      <div
                        key={img.currency}
                        onClick={() => {
                          if (isSelected) {
                            setStrategy({ ...strategy, images: strategy.images.filter((i) => i !== img.url) });
                          } else if (strategy.images.length < 2) {
                            setStrategy({ ...strategy, images: [...strategy.images, img.url] });
                          } else {
                            toast({ description: 'Maximum 2 images allowed' });
                          }
                        }}
                        className={`cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-primary relative flex flex-col items-center ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-border'
                        } ${strategy.images.length >= 2 && !isSelected ? 'opacity-50' : ''}`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                            {selectionIndex + 1}
                          </div>
                        )}
                        <img src={img.url} alt={img.alt} className="h-16 w-16 object-cover rounded" />
                        <p className="text-[10px] text-center mt-1 text-muted-foreground truncate">{img.currency}</p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              {/* <TabsContent value="upload" className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                  } ${strategy.images.length >= 2 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-2">
                    {uploadedImages.length > 0 ? (
                      <>
                        <ImageIcon className="h-12 w-12 text-primary" />
                        <p className="text-sm font-medium">{uploadedImages.length} of 2 images uploaded</p>
                        <p className="text-xs text-muted-foreground">
                          {strategy.images.length < 2 ? 'Click or drag to add more' : 'Maximum images reached'}
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm font-medium">Drag & drop images here, or click to select</p>
                        <p className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF (Max 2 images)</p>
                      </>
                    )}
                  </div>
                </div>
                {uploadedImages.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Uploaded Images</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          strategy.images.forEach((url) => URL.revokeObjectURL(url));
                          setStrategy({ ...strategy, images: [] });
                          setUploadedImages([]);
                        }}
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {strategy.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Upload ${idx + 1}`}
                            className="h-32 w-full object-cover rounded-lg border-2 border-primary"
                          />
                          <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                            {idx + 1}
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              URL.revokeObjectURL(img);
                              setStrategy({ ...strategy, images: strategy.images.filter((_, i) => i !== idx) });
                              setUploadedImages(uploadedImages.filter((_, i) => i !== idx));
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent> */}
            </Tabs>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="flex-1"
              onClick={() => onOpenChange()}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} className="flex-1" onClick={() => handleSubmit(open)}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {open === 'Add' ? 'Add New Strategy' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
