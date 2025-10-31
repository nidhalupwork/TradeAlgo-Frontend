import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Copy, Trash2, Image as ImageIcon, Loader2, DollarSign, BookOpenText, Megaphone } from "lucide-react";
import { uploadToIPFS } from "@/utils/utils";
import { AxiosProgressEvent } from "axios";
import Api from "@/services/Api";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UploadedImage {
  _id: string;
  ipfsUrl: string;
  fileName: string;
  alt: string;
  type: "currency" | "tutorial" | "announcement" | "general";
  currency?: string;
  description: string;
  uploadedBy: string;
  createdAt: string;
}

interface ImageMetadata {
  file: File | null;
  preview: string;
  alt: string;
  type: "currency" | "tutorial" | "announcement" | "general";
  currency: string;
  description: string;
}

const ImageManagement = () => {
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata>({
    file: null,
    preview: "",
    alt: "",
    type: "general",
    currency: "",
    description: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [gallery, setGallery] = useState<UploadedImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "currency" | "tutorial" | "announcement" | "general">("all");
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setImageMetadata((prev) => ({
        ...prev,
        file,
        preview: URL.createObjectURL(file),
      }));
    },
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setIsLoadingGallery(true);
    try {
      const data = await Api.get("/images");
      if (data?.success) {
        setGallery(data.images);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast({
        title: "Error",
        description: "Failed to load image gallery",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const updateMetadata = (field: keyof ImageMetadata, value: string) => {
    setImageMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async () => {
    if (!imageMetadata.file) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Validate metadata
    if (!imageMetadata.alt || !imageMetadata.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in alt text and description",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (imageMetadata.type === "currency" && !imageMetadata.currency) {
      toast({
        title: "Missing Currency",
        description: "Please specify the currency",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to IPFS
      const ipfsUrl = await uploadToIPFS(imageMetadata.file, (event: AxiosProgressEvent) => {
        if (event.total) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      }).catch((err) => {
        console.log(err);
        throw new Error("Image upload failed to IPFS. Please retry.");
      });

      // Save to backend with metadata
      const data = await Api.post("/images/upload", {
        ipfsUrl,
        fileName: imageMetadata.file.name,
        alt: imageMetadata.alt,
        type: imageMetadata.type,
        currency: imageMetadata.type === "currency" ? imageMetadata.currency : undefined,
        description: imageMetadata.description,
      });

      if (data?.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
          duration: 3000,
        });

        // Refresh gallery
        fetchGallery();

        // Reset form
        setImageMetadata({
          file: null,
          preview: "",
          alt: "",
          type: "general",
          currency: "",
          description: "",
        });
        setUploadProgress(0);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error?.message || "Failed to upload image",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageMetadata({
      file: null,
      preview: "",
      alt: "",
      type: "general",
      currency: "",
      description: "",
    });
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Image URL copied to clipboard",
      duration: 2000,
    });
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      const data = await Api.delete(`/images/${imageToDelete}`);
      if (data?.success) {
        toast({
          title: "Success",
          description: "Image deleted successfully",
          duration: 2000,
        });
        setGallery((prev) => prev.filter((img) => img._id !== imageToDelete));
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setImageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "currency":
        return <DollarSign className="h-4 w-4" />;
      case "tutorial":
        return <BookOpenText className="h-4 w-4" />;
      case "announcement":
        return <Megaphone className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "currency":
        return "default";
      case "tutorial":
        return "secondary";
      case "announcement":
        return "destructive";
      default:
        return "outline";
    }
  };

  const filteredGallery = filterType === "all" ? gallery : gallery.filter((img) => img.type === filterType);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Image Management</h1>
          <p className="text-muted-foreground">Upload and manage images for your platform</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <ImageIcon className="h-4 w-4 mr-2" />
          {gallery.length} Images
        </Badge>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Upload one image at a time to IPFS with metadata for permanent storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dropzone or Preview */}
          {!imageMetadata.preview ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg font-medium">Drop the image here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">Drag & drop an image here</p>
                  <p className="text-sm text-muted-foreground">or click to select a file</p>
                  <p className="text-xs text-muted-foreground mt-2">Supports: PNG, JPG, JPEG, GIF, WEBP, SVG</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-[300px_1fr] gap-4">
                    {/* Preview */}
                    <div className="relative">
                      <img
                        src={imageMetadata.preview}
                        alt={imageMetadata.alt || "Preview"}
                        className="w-full h-48 object-cover rounded-lg border border-border"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Metadata Form */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs">File Name</Label>
                        <p className="text-sm text-muted-foreground truncate">{imageMetadata.file?.name}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Type Selection */}
                        <div>
                          <Label htmlFor="type" className="text-xs">
                            Type <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={imageMetadata.type}
                            onValueChange={(value) => updateMetadata("type", value as "currency" | "tutorial" | "announcement" | "general")}
                          >
                            <SelectTrigger id="type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="currency">Currency</SelectItem>
                              <SelectItem value="tutorial">Tutorial</SelectItem>
                              <SelectItem value="announcement">Announcement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Currency Field (conditional) */}
                        {imageMetadata.type === "currency" && (
                          <div>
                            <Label htmlFor="currency" className="text-xs">
                              Currency <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="currency"
                              placeholder="e.g., BTC, ETH, USD"
                              value={imageMetadata.currency}
                              onChange={(e) => updateMetadata("currency", e.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      {/* Alt Text */}
                      <div>
                        <Label htmlFor="alt" className="text-xs">
                          Alt Text (for accessibility) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="alt"
                          placeholder="Brief description of the image"
                          value={imageMetadata.alt}
                          onChange={(e) => updateMetadata("alt", e.target.value)}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Label htmlFor="description" className="text-xs">
                          Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Detailed description of the image, its purpose, and usage"
                          value={imageMetadata.description}
                          onChange={(e) => updateMetadata("description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading to IPFS...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!imageMetadata.file || isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Gallery Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Image Gallery</CardTitle>
              <CardDescription>Previously uploaded images</CardDescription>
            </div>
            {/* Filter Tabs */}
            <Tabs value={filterType} onValueChange={(value) => setFilterType(value as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="currency">Currency</TabsTrigger>
                <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
                <TabsTrigger value="announcement">Announcement</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingGallery ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {filterType === "all" ? "No images uploaded yet" : `No ${filterType} images found`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGallery.map((image) => (
                <Card key={image._id} className="overflow-hidden">
                  <img src={image.ipfsUrl} alt={image.alt} className="w-full h-48 object-cover" />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium truncate">{image.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getTypeBadgeVariant(image.type)} className="flex items-center gap-1">
                        {getTypeIcon(image.type)}
                        {image.type}
                      </Badge>
                    </div>

                    {/* Alt Text */}
                    <div className="text-xs">
                      <span className="font-medium">Alt: </span>
                      <span className="text-muted-foreground">{image.alt || "N/A"}</span>
                    </div>

                    {/* Currency (if applicable) */}
                    {image.type === "currency" && image.currency && (
                      <div className="text-xs">
                        <span className="font-medium">Currency: </span>
                        <Badge variant="outline" className="ml-1">
                          {image.currency}
                        </Badge>
                      </div>
                    )}

                    {/* Description */}
                    {image.description && (
                      <div className="text-xs">
                        <span className="font-medium">Description: </span>
                        <p className="text-muted-foreground mt-1 line-clamp-2">{image.description}</p>
                      </div>
                    )}

                    {/* URL */}
                    <Input value={image.ipfsUrl} readOnly className="text-xs" />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => copyToClipboard(image.ipfsUrl)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy URL
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => confirmDelete(image._id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteImage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageManagement;
