import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAlbums, useTracks, useEvents, useVideos, usePress, usePhotos, useMessages,
  useCreateAlbum, useCreateTrack, useCreateEvent, useCreateVideo, useCreatePress, useCreatePhoto,
  useUpdateAlbum, useUpdateTrack, useUpdateEvent, useUpdateVideo, useUpdatePress, useUpdatePhoto,
  useDeleteAlbum, useDeleteTrack, useDeleteEvent, useDeleteVideo, useDeletePress, useDeletePhoto
} from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, LogOut, Edit2, Eye, EyeOff, Share2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertAlbumSchema, insertTrackSchema, insertEventSchema, insertVideoSchema, insertPressSchema, insertPhotoSchema,
  type InsertAlbum, type InsertTrack, type InsertEvent, type InsertVideo, type InsertPress, type InsertPhoto
} from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadButton } from "@/components/FileUploadButton";
import { useToast } from "@/hooks/use-toast";

// Social sharing helper function
function shareToSocial(platform: string, content: { title: string; url?: string; description?: string }) {
  // Use the provided URL or default to site URL only if no URL is provided
  const shareUrl = content.url || window.location.origin;
  const text = content.description || content.title;
  
  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
    instagram: 'https://www.instagram.com/damodamsool?igsh=cDd6dG93MjNkcHZu', // Instagram doesn't support direct sharing, redirect to profile
    youtube: 'https://youtube.com/@damofama5246?si=0488M76i0AEFvVjD',
    tiktok: 'https://www.tiktok.com/@damofama',
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };
  
  const url = urls[platform as keyof typeof urls];
  if (url) {
    window.open(url, '_blank', 'width=600,height=400');
  }
}

// Simple CRUD for Albums
function AlbumsManager() {
  const { data: albums = [] } = useAlbums(true);
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();
  const deleteAlbum = useDeleteAlbum();
  
  const handleToggleHidden = (album: any) => {
    updateAlbum.mutate({ id: album.id, data: { ...album, hidden: !album.hidden } });
  };
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertAlbum>({
    resolver: zodResolver(insertAlbumSchema),
    defaultValues: {
      title: "",
      coverImage: "",
      description: "",
    },
  });

  const onSubmit = (data: InsertAlbum) => {
    if (editingId) {
      updateAlbum.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
          toast({ title: "Album updated successfully" });
        },
        onError: () => toast({ title: "Error updating album", variant: "destructive" }),
      });
    } else {
      createAlbum.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({ title: "Album created successfully" });
        },
        onError: () => toast({ title: "Error creating album", variant: "destructive" }),
      });
    }
  };

  const handleEdit = (album: any) => {
    setEditingId(album.id);
    form.reset({
      title: album.title,
      coverImage: album.coverImage,
      releaseDate: album.releaseDate ? new Date(album.releaseDate) : undefined,
      description: album.description,
    });
    setTimeout(() => setOpen(true), 0);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deleteAlbum.mutate(id, {
        onSuccess: () => toast({ title: "Album deleted" }),
        onError: () => toast({ title: "Error deleting album", variant: "destructive" }),
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h2 className="text-xl md:text-2xl font-bold">Albums</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
          }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-album"><Plus size={16} className="mr-2" /> Add Album</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Album" : "Add New Album"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the album details below" : "Create a new album with the information below"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="album-title">Title</Label>
                <Input id="album-title" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="album-cover">Cover Image</Label>
                <div className="flex gap-2">
                  <Input id="album-cover" {...form.register("coverImage")} placeholder="Or upload..." className="flex-1" />
                  <FileUploadButton
                    accept="image/*"
                    onUploadComplete={(path) => form.setValue("coverImage", path)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="album-description">Description</Label>
                <Textarea id="album-description" {...form.register("description")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="album-release">Release Date</Label>
                <Input id="album-release" type="datetime-local" {...form.register("releaseDate", { valueAsDate: true })} />
              </div>
              <Button type="submit" disabled={createAlbum.isPending || updateAlbum.isPending} data-testid="button-submit-album">
                {editingId ? (updateAlbum.isPending ? "Updating..." : "Update Album") : (createAlbum.isPending ? "Creating..." : "Create Album")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:gap-4">
        {albums.map(album => (
          <div key={album.id} className={`flex items-center justify-between p-3 md:p-4 border rounded bg-card gap-2 flex-wrap ${album.hidden ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img src={album.coverImage} className="w-10 h-10 md:w-12 md:h-12 rounded object-cover flex-shrink-0" alt={album.title} />
              <div className="min-w-0">
                <div className="font-bold text-sm md:text-base truncate">{album.title}</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : 'N/A'}
                  {album.hidden && <span className="ml-2 text-yellow-500">(Masqué)</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  const shareMenu = document.getElementById(`share-menu-album-${album.id}`);
                  if (shareMenu) shareMenu.classList.toggle('hidden');
                }} 
                title="Partager"
                data-testid={`button-share-album-${album.id}`}
              >
                <Share2 size={16} />
              </Button>
              <div id={`share-menu-album-${album.id}`} className="hidden absolute right-0 mt-10 bg-card border rounded-lg shadow-lg p-2 z-50 flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('facebook', { title: album.title, description: album.description || '', url: album.coverImage || undefined })}>Facebook</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('twitter', { title: album.title, description: album.description || '', url: album.coverImage || undefined })}>Twitter</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('whatsapp', { title: album.title, description: album.description || '', url: album.coverImage || undefined })}>WhatsApp</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('instagram', { title: album.title, url: album.coverImage || undefined })}>Instagram</Button>
              </div>
              <Button variant="outline" size="icon" onClick={() => handleToggleHidden(album)} title={album.hidden ? "Afficher" : "Masquer"} data-testid={`button-toggle-album-${album.id}`}>
                {album.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleEdit(album)} data-testid={`button-edit-album-${album.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(album.id)} data-testid={`button-delete-album-${album.id}`}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tracks Manager
function TracksManager() {
  const { data: tracks = [] } = useTracks(true);
  const { data: albums = [] } = useAlbums(true);
  const createTrack = useCreateTrack();
  const updateTrack = useUpdateTrack();
  const deleteTrack = useDeleteTrack();
  const { toast } = useToast();
  
  const handleToggleHidden = (track: any) => {
    updateTrack.mutate({ id: track.id, data: { ...track, hidden: !track.hidden } });
  };
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertTrack>({
    resolver: zodResolver(insertTrackSchema),
    defaultValues: {
      albumId: undefined,
      title: "",
      audioUrl: "",
      duration: "",
      isSingle: false,
    },
  });

  const onSubmit = (data: InsertTrack) => {
    if (editingId) {
      updateTrack.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
          toast({ title: "Track updated successfully" });
        },
        onError: () => toast({ title: "Error updating track", variant: "destructive" }),
      });
    } else {
      createTrack.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({ title: "Track created successfully" });
        },
        onError: () => toast({ title: "Error creating track", variant: "destructive" }),
      });
    }
  };

  const handleEdit = (track: any) => {
    setEditingId(track.id);
    form.reset({
      albumId: track.albumId || undefined,
      title: track.title,
      audioUrl: track.audioUrl,
      photoUrl: track.photoUrl || "",
      duration: track.duration,
      isSingle: track.isSingle,
    });
    // Use a small delay to avoid "Cannot update a component while rendering a different component"
    setTimeout(() => setOpen(true), 0);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deleteTrack.mutate(id, {
        onSuccess: () => toast({ title: "Track deleted" }),
        onError: () => toast({ title: "Error deleting track", variant: "destructive" }),
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h2 className="text-xl md:text-2xl font-bold">Tracks</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
          }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-track"><Plus size={16} className="mr-2" /> Add Track</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Track" : "Add New Track"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the track details below" : "Create a new track with the information below"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="track-title">Title</Label>
                <Input id="track-title" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="track-audio">Audio</Label>
                <div className="flex gap-2">
                  <Input id="track-audio" {...form.register("audioUrl")} placeholder="Or upload..." className="flex-1" />
                  <FileUploadButton
                    accept="audio/*"
                    onUploadComplete={(path) => form.setValue("audioUrl", path)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="track-photo">Photo (Optional)</Label>
                <div className="flex gap-2">
                  <Input id="track-photo" {...form.register("photoUrl")} placeholder="Or upload..." className="flex-1" />
                  <FileUploadButton
                    accept="image/*"
                    onUploadComplete={(path) => form.setValue("photoUrl", path)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="track-duration">Duration (MM:SS)</Label>
                <Input id="track-duration" {...form.register("duration")} placeholder="3:45" />
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <input type="checkbox" {...form.register("isSingle")} id="isSingle" />
                <Label htmlFor="isSingle">Is Single</Label>
              </div>
              <Button type="submit" disabled={createTrack.isPending || updateTrack.isPending} data-testid="button-submit-track">
                {editingId ? (updateTrack.isPending ? "Updating..." : "Update Track") : (createTrack.isPending ? "Creating..." : "Create Track")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:gap-4">
        {tracks.map(track => (
          <div key={track.id} className={`flex items-center justify-between p-3 md:p-4 border rounded bg-card gap-2 flex-wrap ${track.hidden ? 'opacity-50' : ''}`}>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm md:text-base truncate">{track.title}</div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {track.duration} {track.isSingle && '• Single'}
                {track.hidden && <span className="ml-2 text-yellow-500">(Masqué)</span>}
              </div>
            </div>
            <div className="flex gap-1 md:gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  const shareMenu = document.getElementById(`share-menu-track-${track.id}`);
                  if (shareMenu) shareMenu.classList.toggle('hidden');
                }} 
                title="Partager"
                data-testid={`button-share-track-${track.id}`}
              >
                <Share2 size={16} />
              </Button>
              <div id={`share-menu-track-${track.id}`} className="hidden absolute right-0 mt-10 bg-card border rounded-lg shadow-lg p-2 z-50 flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('facebook', { title: track.title, url: track.audioUrl || undefined })}>Facebook</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('twitter', { title: track.title, url: track.audioUrl || undefined })}>Twitter</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('whatsapp', { title: track.title, url: track.audioUrl || undefined })}>WhatsApp</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('youtube', { title: track.title })}>YouTube</Button>
              </div>
              <Button variant="outline" size="icon" onClick={() => handleToggleHidden(track)} title={track.hidden ? "Afficher" : "Masquer"} data-testid={`button-toggle-track-${track.id}`}>
                {track.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleEdit(track)} data-testid={`button-edit-track-${track.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(track.id)} data-testid={`button-delete-track-${track.id}`}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Generate YouTube thumbnail URL from video ID
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Videos Manager
function VideosManager() {
  const { data: videos = [] } = useVideos(true);
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  
  const handleToggleHidden = (video: any) => {
    updateVideo.mutate({ id: video.id, data: { ...video, hidden: !video.hidden } });
  };

  const form = useForm<InsertVideo>({
    resolver: zodResolver(insertVideoSchema),
    defaultValues: {
      title: "",
      youtubeUrl: "",
      thumbnailUrl: "",
      category: "music_video",
      isFeatured: false,
    },
  });

  // Watch YouTube URL and auto-generate thumbnail
  const youtubeUrl = form.watch("youtubeUrl");
  const thumbnailUrl = form.watch("thumbnailUrl");
  
  useEffect(() => {
    const videoId = getYouTubeVideoId(youtubeUrl || "");
    if (videoId && !thumbnailUrl) {
      const ytThumb = getYouTubeThumbnail(videoId);
      form.setValue("thumbnailUrl", ytThumb);
      setThumbnailPreview(ytThumb);
    } else if (thumbnailUrl) {
      setThumbnailPreview(thumbnailUrl);
    }
  }, [youtubeUrl, thumbnailUrl, form]);

  const onSubmit = (data: InsertVideo) => {
    if (editingId) {
      updateVideo.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
          toast({ title: "Video updated successfully" });
        },
        onError: () => toast({ title: "Error updating video", variant: "destructive" }),
      });
    } else {
      createVideo.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({ title: "Video created successfully" });
        },
        onError: () => toast({ title: "Error creating video", variant: "destructive" }),
      });
    }
  };

  const handleEdit = (video: any) => {
    setEditingId(video.id);
    form.reset({
      title: video.title,
      youtubeUrl: video.youtubeUrl,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category,
      isFeatured: video.isFeatured,
    });
    setThumbnailPreview(video.thumbnailUrl || "");
    setTimeout(() => setOpen(true), 0);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deleteVideo.mutate(id, {
        onSuccess: () => toast({ title: "Video deleted" }),
        onError: () => toast({ title: "Error deleting video", variant: "destructive" }),
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h2 className="text-xl md:text-2xl font-bold">Videos</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
            setThumbnailPreview("");
          }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-video"><Plus size={16} className="mr-2" /> Add Video</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Video" : "Add New Video"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the video details below" : "Create a new video with the information below"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="video-title">Title</Label>
                <Input id="video-title" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-youtube">YouTube URL</Label>
                <Input id="video-youtube" {...form.register("youtubeUrl")} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-thumbnail">Thumbnail</Label>
                {thumbnailPreview && (
                  <div className="mb-2">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="w-full max-w-xs h-auto rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Input id="video-thumbnail" {...form.register("thumbnailUrl")} placeholder="Auto-generated from YouTube" className="flex-1 min-w-0" readOnly />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const videoId = getYouTubeVideoId(youtubeUrl || "");
                      if (videoId) {
                        const ytThumb = getYouTubeThumbnail(videoId);
                        form.setValue("thumbnailUrl", ytThumb);
                        setThumbnailPreview(ytThumb);
                        toast({ title: "Thumbnail generated from YouTube" });
                      } else {
                        toast({ title: "Enter a valid YouTube URL first", variant: "destructive" });
                      }
                    }}
                  >
                    Auto
                  </Button>
                  <FileUploadButton
                    accept="image/*"
                    onUploadComplete={(path) => {
                      form.setValue("thumbnailUrl", path);
                      setThumbnailPreview(path);
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Thumbnail is auto-generated from YouTube URL, or upload your own</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-category">Category</Label>
                <select {...form.register("category")} id="video-category" className="w-full px-3 py-2 border rounded">
                  <option value="music_video">Music Video</option>
                  <option value="live">Live</option>
                  <option value="interview">Interview</option>
                </select>
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <input type="checkbox" {...form.register("isFeatured")} id="isFeatured" />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
              <Button type="submit" disabled={createVideo.isPending || updateVideo.isPending} data-testid="button-submit-video">
                {editingId ? (updateVideo.isPending ? "Updating..." : "Update Video") : (createVideo.isPending ? "Creating..." : "Create Video")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:gap-4">
        {videos.map(video => (
          <div key={video.id} className={`flex items-center justify-between p-3 md:p-4 border rounded bg-card gap-2 flex-wrap ${video.hidden ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img src={video.thumbnailUrl || ""} alt={video.title} className="w-14 h-8 md:w-16 md:h-9 object-cover rounded flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-bold text-sm md:text-base truncate">{video.title}</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {video.category} {video.isFeatured && '• Featured'}
                  {video.hidden && <span className="ml-2 text-yellow-500">(Masqué)</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  const shareMenu = document.getElementById(`share-menu-video-${video.id}`);
                  if (shareMenu) shareMenu.classList.toggle('hidden');
                }} 
                title="Partager"
                data-testid={`button-share-video-${video.id}`}
              >
                <Share2 size={16} />
              </Button>
              <div id={`share-menu-video-${video.id}`} className="hidden absolute right-0 mt-10 bg-card border rounded-lg shadow-lg p-2 z-50 flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('facebook', { title: video.title, url: video.youtubeUrl || undefined })}>Facebook</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('twitter', { title: video.title, url: video.youtubeUrl || undefined })}>Twitter</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('whatsapp', { title: video.title, url: video.youtubeUrl || undefined })}>WhatsApp</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('youtube', { title: video.title, url: video.youtubeUrl || undefined })}>YouTube</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('tiktok', { title: video.title, url: video.youtubeUrl || undefined })}>TikTok</Button>
              </div>
              <Button variant="outline" size="icon" onClick={() => handleToggleHidden(video)} title={video.hidden ? "Afficher" : "Masquer"} data-testid={`button-toggle-video-${video.id}`}>
                {video.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleEdit(video)} data-testid={`button-edit-video-${video.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(video.id)} data-testid={`button-delete-video-${video.id}`}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Events Manager
function EventsManager() {
  const { data: events = [] } = useEvents(true);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const { toast } = useToast();
  
  const handleToggleHidden = (event: any) => {
    updateEvent.mutate({ id: event.id, data: { ...event, hidden: !event.hidden } });
  };
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      location: "",
      venue: "",
      type: "concert",
    },
  });

  const onSubmit = (data: InsertEvent) => {
    if (editingId) {
      updateEvent.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
          toast({ title: "Event updated successfully" });
        },
        onError: () => toast({ title: "Error updating event", variant: "destructive" }),
      });
    } else {
      createEvent.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({ title: "Event created successfully" });
        },
        onError: () => toast({ title: "Error creating event", variant: "destructive" }),
      });
    }
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    form.reset({
      title: event.title,
      date: event.date ? new Date(event.date) : undefined,
      location: event.location,
      venue: event.venue || "",
      type: event.type,
      ticketUrl: event.ticketUrl || "",
    });
    setTimeout(() => setOpen(true), 0);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deleteEvent.mutate(id, {
        onSuccess: () => toast({ title: "Event deleted" }),
        onError: () => toast({ title: "Error deleting event", variant: "destructive" }),
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h2 className="text-xl md:text-2xl font-bold">Events</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
          }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-event"><Plus size={16} className="mr-2" /> Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Event" : "Add New Event"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the event details below" : "Create a new event with the information below"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="event-title">Title</Label>
                <Input id="event-title" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-date">Date</Label>
                <Input id="event-date" type="datetime-local" {...form.register("date", { valueAsDate: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">Location</Label>
                <Input id="event-location" {...form.register("location")} placeholder="City, Country" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-venue">Venue</Label>
                <Input id="event-venue" {...form.register("venue")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-type">Type</Label>
                <select {...form.register("type")} id="event-type" className="w-full px-3 py-2 border rounded">
                  <option value="concert">Concert</option>
                  <option value="festival">Festival</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-ticket">Ticket URL</Label>
                <Input id="event-ticket" {...form.register("ticketUrl")} placeholder="https://..." />
              </div>
              <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending} data-testid="button-submit-event">
                {editingId ? (updateEvent.isPending ? "Updating..." : "Update Event") : (createEvent.isPending ? "Creating..." : "Create Event")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map(event => (
          <div key={event.id} className={`flex items-center justify-between p-4 border rounded bg-card ${event.hidden ? 'opacity-50' : ''}`}>
            <div>
              <div className="font-bold">{event.title}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(event.date).toLocaleDateString()} • {event.location}
                {event.hidden && <span className="ml-2 text-yellow-500">(Masqué)</span>}
              </div>
            </div>
            <div className="flex gap-2 relative">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  const shareMenu = document.getElementById(`share-menu-event-${event.id}`);
                  if (shareMenu) shareMenu.classList.toggle('hidden');
                }} 
                title="Partager"
                data-testid={`button-share-event-${event.id}`}
              >
                <Share2 size={16} />
              </Button>
              <div id={`share-menu-event-${event.id}`} className="hidden absolute right-0 mt-10 bg-card border rounded-lg shadow-lg p-2 z-50 flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('facebook', { title: event.title, description: `${event.location} - ${new Date(event.date).toLocaleDateString()}`, url: event.ticketUrl || undefined })}>Facebook</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('twitter', { title: event.title, description: `${event.location} - ${new Date(event.date).toLocaleDateString()}`, url: event.ticketUrl || undefined })}>Twitter</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('whatsapp', { title: event.title, description: `${event.location} - ${new Date(event.date).toLocaleDateString()}`, url: event.ticketUrl || undefined })}>WhatsApp</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('instagram', { title: event.title })}>Instagram</Button>
              </div>
              <Button variant="outline" size="icon" onClick={() => handleToggleHidden(event)} title={event.hidden ? "Afficher" : "Masquer"} data-testid={`button-toggle-event-${event.id}`}>
                {event.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleEdit(event)} data-testid={`button-edit-event-${event.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(event.id)} data-testid={`button-delete-event-${event.id}`}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Press Manager
function PressManager() {
  const { data: press = [] } = usePress(true);
  const createPress = useCreatePress();
  const updatePress = useUpdatePress();
  const deletePress = useDeletePress();
  const { toast } = useToast();
  
  const handleToggleHidden = (item: any) => {
    updatePress.mutate({ id: item.id, data: { ...item, hidden: !item.hidden } });
  };
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertPress>({
    resolver: zodResolver(insertPressSchema),
    defaultValues: {
      title: "",
      source: "",
      url: "",
      snippet: "",
    },
  });

  const onSubmit = (data: InsertPress) => {
    if (editingId) {
      updatePress.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
          toast({ title: "Press item updated successfully" });
        },
        onError: () => toast({ title: "Error updating press item", variant: "destructive" }),
      });
    } else {
      createPress.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({ title: "Press item created successfully" });
        },
        onError: () => toast({ title: "Error creating press item", variant: "destructive" }),
      });
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      title: item.title,
      source: item.source,
      url: item.url,
      snippet: item.snippet || "",
      date: item.date ? new Date(item.date) : undefined,
    });
    setTimeout(() => setOpen(true), 0);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deletePress.mutate(id, {
        onSuccess: () => toast({ title: "Press item deleted" }),
        onError: () => toast({ title: "Error deleting press item", variant: "destructive" }),
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h2 className="text-xl md:text-2xl font-bold">Press & Media</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
          }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-press"><Plus size={16} className="mr-2" /> Add Press Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Press Item" : "Add New Press Item"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the press item details below" : "Create a new press item with the information below"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="press-title">Title</Label>
                <Input id="press-title" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="press-source">Source</Label>
                <Input id="press-source" {...form.register("source")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="press-url">URL</Label>
                <Input id="press-url" {...form.register("url")} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="press-snippet">Snippet</Label>
                <Textarea id="press-snippet" {...form.register("snippet")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="press-date">Date</Label>
                <Input id="press-date" type="datetime-local" {...form.register("date", { valueAsDate: true })} />
              </div>
              <Button type="submit" disabled={createPress.isPending || updatePress.isPending} data-testid="button-submit-press">
                {editingId ? (updatePress.isPending ? "Updating..." : "Update") : (createPress.isPending ? "Creating..." : "Create")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {press.map(item => (
          <div key={item.id} className={`flex items-center justify-between p-4 border rounded bg-card ${item.hidden ? 'opacity-50' : ''}`}>
            <div>
              <div className="font-bold">{item.title}</div>
              <div className="text-sm text-muted-foreground">
                {item.source} • {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                {item.hidden && <span className="ml-2 text-yellow-500">(Masqué)</span>}
              </div>
            </div>
            <div className="flex gap-2 relative">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  const shareMenu = document.getElementById(`share-menu-press-${item.id}`);
                  if (shareMenu) shareMenu.classList.toggle('hidden');
                }} 
                title="Partager"
                data-testid={`button-share-press-${item.id}`}
              >
                <Share2 size={16} />
              </Button>
              <div id={`share-menu-press-${item.id}`} className="hidden absolute right-0 mt-10 bg-card border rounded-lg shadow-lg p-2 z-50 flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('facebook', { title: item.title, description: item.snippet || '', url: item.url })}>Facebook</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('twitter', { title: item.title, description: item.snippet || '', url: item.url })}>Twitter</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('linkedin', { title: item.title, url: item.url })}>LinkedIn</Button>
                <Button variant="ghost" size="sm" onClick={() => shareToSocial('whatsapp', { title: item.title, description: item.snippet || '', url: item.url })}>WhatsApp</Button>
              </div>
              <Button variant="outline" size="icon" onClick={() => handleToggleHidden(item)} title={item.hidden ? "Afficher" : "Masquer"} data-testid={`button-toggle-press-${item.id}`}>
                {item.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleEdit(item)} data-testid={`button-edit-press-${item.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)} data-testid={`button-delete-press-${item.id}`}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Photos Manager
function PhotosManager() {
  const { data: photos = [] } = usePhotos(true);
  const createPhoto = useCreatePhoto();
  const updatePhoto = useUpdatePhoto();
  const deletePhoto = useDeletePhoto();
  const { toast } = useToast();
  
  const handleToggleHidden = (photo: any) => {
    updatePhoto.mutate({ id: photo.id, data: { ...photo, hidden: !photo.hidden } });
  };
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertPhoto>({
    resolver: zodResolver(insertPhotoSchema),
    defaultValues: {
      imageUrl: "",
      title: "",
      category: "concert",
      displayOrder: 0,
    },
  });

  const onSubmit = (data: InsertPhoto) => {
    if (editingId) {
      updatePhoto.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
          toast({ title: "Photo updated" });
        },
        onError: () => toast({ title: "Error updating photo", variant: "destructive" }),
      });
    } else {
      createPhoto.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({ title: "Photo added" });
        },
        onError: () => toast({ title: "Error adding photo", variant: "destructive" }),
      });
    }
  };

  const handleEdit = (photo: any) => {
    setEditingId(photo.id);
    form.reset({
      imageUrl: photo.imageUrl,
      title: photo.title,
      category: photo.category || "concert",
      displayOrder: photo.displayOrder || 0,
    });
    setTimeout(() => setOpen(true), 0);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this photo?")) {
      deletePhoto.mutate(id, {
        onSuccess: () => toast({ title: "Photo deleted" }),
        onError: () => toast({ title: "Error deleting photo", variant: "destructive" }),
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Photos</h2>
        <Dialog open={open} onOpenChange={(o) => {
          setOpen(o);
          if (!o) { setEditingId(null); form.reset(); }
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-photo"><Plus size={16} className="mr-2" /> Add Photo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Photo" : "Add New Photo"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the photo details below" : "Add a new photo to the gallery"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="photo-title">Title / Description</Label>
                <Input id="photo-title" {...form.register("title")} placeholder="Damo Fama en concert" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo-image">Image</Label>
                <div className="flex gap-2">
                  <Input id="photo-image" {...form.register("imageUrl")} placeholder="URL de l'image" className="flex-1" readOnly />
                  <FileUploadButton
                    onUploadComplete={(url) => form.setValue("imageUrl", url)}
                    accept="image/*"
                  />
                </div>
                {form.watch("imageUrl") && (
                  <img src={form.watch("imageUrl")} alt="Preview" className="w-full max-h-48 object-cover rounded mt-2" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo-category">Category</Label>
                <select
                  id="photo-category"
                  {...form.register("category")}
                  className="w-full h-9 px-3 border rounded-md bg-background"
                >
                  <option value="concert">Concert</option>
                  <option value="portrait">Portrait</option>
                  <option value="studio">Studio</option>
                  <option value="backstage">Backstage</option>
                  <option value="event">Event</option>
                  <option value="promo">Promo</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo-order">Display Order</Label>
                <Input id="photo-order" type="number" {...form.register("displayOrder", { valueAsNumber: true })} />
              </div>
              <Button type="submit" disabled={createPhoto.isPending || updatePhoto.isPending} data-testid="button-submit-photo">
                {editingId ? (updatePhoto.isPending ? "Updating..." : "Update") : (createPhoto.isPending ? "Adding..." : "Add Photo")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {photos.map(photo => (
          <div key={photo.id} className={`relative border rounded overflow-hidden bg-card ${photo.hidden ? 'opacity-50' : ''}`}>
            <img src={photo.imageUrl} alt={photo.title} className="w-full h-32 object-cover" />
            <div className="p-2 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{photo.title}</div>
                <div className="text-xs text-muted-foreground">
                  {photo.category}
                  {photo.hidden && <span className="ml-1 text-yellow-500">(Masqué)</span>}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0 relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => {
                    const shareMenu = document.getElementById(`share-menu-photo-${photo.id}`);
                    if (shareMenu) shareMenu.classList.toggle('hidden');
                  }} 
                  title="Partager"
                  data-testid={`button-share-photo-${photo.id}`}
                >
                  <Share2 size={12} />
                </Button>
                <div id={`share-menu-photo-${photo.id}`} className="hidden absolute right-0 top-8 bg-card border rounded-lg shadow-lg p-2 z-50 flex flex-col gap-1 min-w-[120px]">
                  <Button variant="ghost" size="sm" onClick={() => shareToSocial('facebook', { title: photo.title, url: photo.imageUrl })}>Facebook</Button>
                  <Button variant="ghost" size="sm" onClick={() => shareToSocial('instagram', { title: photo.title, url: photo.imageUrl })}>Instagram</Button>
                  <Button variant="ghost" size="sm" onClick={() => shareToSocial('twitter', { title: photo.title, url: photo.imageUrl })}>Twitter</Button>
                </div>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleToggleHidden(photo)} title={photo.hidden ? "Afficher" : "Masquer"} data-testid={`button-toggle-photo-${photo.id}`}>
                  {photo.hidden ? <Eye size={12} /> : <EyeOff size={12} />}
                </Button>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEdit(photo)} data-testid={`button-edit-photo-${photo.id}`}>
                  <Edit2 size={12} />
                </Button>
                <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDelete(photo.id)} data-testid={`button-delete-photo-${photo.id}`}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {photos.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Aucune photo. Ajoutez des photos pour la galerie.</p>
      )}
    </div>
  );
}

// Messages Manager
function MessagesManager() {
  const { data: messages = [] } = useMessages();

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">Contact Messages</h2>
      <div className="grid gap-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground">No messages yet</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="p-4 border rounded bg-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-bold">{msg.name}</div>
                  <div className="text-sm text-muted-foreground">{msg.email}</div>
                  {msg.subject && <div className="text-sm font-semibold mt-1">{msg.subject}</div>}
                  <p className="mt-2 text-sm">{msg.message}</p>
                  <div className="text-xs text-muted-foreground mt-2">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Main Admin Page
export default function Admin() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 gap-2">
          <h1 className="text-lg sm:text-2xl md:text-4xl font-bold truncate">Admin Dashboard</h1>
          <Button variant="outline" size="icon" onClick={() => logout()} data-testid="button-logout" title="Logout" className="flex-shrink-0">
            <LogOut size={16} />
          </Button>
        </div>

        <Tabs defaultValue="albums" className="w-full">
          <div className="overflow-x-auto -mx-2 px-2 pb-2">
            <TabsList className="inline-flex w-auto min-w-full md:w-full md:grid md:grid-cols-7 gap-1 h-auto">
              <TabsTrigger value="albums" className="text-xs sm:text-sm whitespace-nowrap px-3">Albums</TabsTrigger>
              <TabsTrigger value="tracks" className="text-xs sm:text-sm whitespace-nowrap px-3">Tracks</TabsTrigger>
              <TabsTrigger value="videos" className="text-xs sm:text-sm whitespace-nowrap px-3">Videos</TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm whitespace-nowrap px-3">Events</TabsTrigger>
              <TabsTrigger value="press" className="text-xs sm:text-sm whitespace-nowrap px-3">Press</TabsTrigger>
              <TabsTrigger value="photos" className="text-xs sm:text-sm whitespace-nowrap px-3">Photos</TabsTrigger>
              <TabsTrigger value="messages" className="text-xs sm:text-sm whitespace-nowrap px-3">Msgs</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="albums" className="mt-4 md:mt-6"><AlbumsManager /></TabsContent>
          <TabsContent value="tracks" className="mt-4 md:mt-6"><TracksManager /></TabsContent>
          <TabsContent value="videos" className="mt-4 md:mt-6"><VideosManager /></TabsContent>
          <TabsContent value="events" className="mt-4 md:mt-6"><EventsManager /></TabsContent>
          <TabsContent value="press" className="mt-4 md:mt-6"><PressManager /></TabsContent>
          <TabsContent value="photos" className="mt-4 md:mt-6"><PhotosManager /></TabsContent>
          <TabsContent value="messages" className="mt-4 md:mt-6"><MessagesManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}