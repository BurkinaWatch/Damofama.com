import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAlbums, useTracks, useEvents, useVideos, usePress, useMessages,
  useCreateAlbum, useCreateTrack, useCreateEvent, useCreateVideo, useCreatePress,
  useUpdateAlbum, useUpdateTrack, useUpdateEvent, useUpdateVideo, useUpdatePress,
  useDeleteAlbum, useDeleteTrack, useDeleteEvent, useDeleteVideo, useDeletePress
} from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, LogOut, Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertAlbumSchema, insertTrackSchema, insertEventSchema, insertVideoSchema, insertPressSchema,
  type InsertAlbum, type InsertTrack, type InsertEvent, type InsertVideo, type InsertPress
} from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadButton } from "@/components/FileUploadButton";
import { useToast } from "@/hooks/use-toast";

// Simple CRUD for Albums
function AlbumsManager() {
  const { data: albums = [] } = useAlbums();
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();
  const deleteAlbum = useDeleteAlbum();
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
    setOpen(true);
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
          <div key={album.id} className="flex items-center justify-between p-3 md:p-4 border rounded bg-card gap-2 flex-wrap">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img src={album.coverImage} className="w-10 h-10 md:w-12 md:h-12 rounded object-cover flex-shrink-0" alt={album.title} />
              <div className="min-w-0">
                <div className="font-bold text-sm md:text-base truncate">{album.title}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2 flex-shrink-0">
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
  const { data: tracks = [] } = useTracks();
  const { data: albums = [] } = useAlbums();
  const createTrack = useCreateTrack();
  const updateTrack = useUpdateTrack();
  const deleteTrack = useDeleteTrack();
  const { toast } = useToast();
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
      albumId: track.albumId,
      title: track.title,
      audioUrl: track.audioUrl,
      photoUrl: track.photoUrl,
      duration: track.duration,
      isSingle: track.isSingle,
    });
    setOpen(true);
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
          <div key={track.id} className="flex items-center justify-between p-3 md:p-4 border rounded bg-card gap-2 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm md:text-base truncate">{track.title}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{track.duration} {track.isSingle && '• Single'}</div>
            </div>
            <div className="flex gap-1 md:gap-2 flex-shrink-0">
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
  const { data: videos = [] } = useVideos();
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

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
    setOpen(true);
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

      <div className="grid gap-4">
        {videos.map(video => (
          <div key={video.id} className="flex items-center justify-between p-4 border rounded bg-card">
            <div className="flex items-center gap-4">
              <img src={video.thumbnailUrl || ""} alt={video.title} className="w-16 h-9 object-cover rounded" />
              <div>
                <div className="font-bold">{video.title}</div>
                <div className="text-sm text-muted-foreground">{video.category} {video.isFeatured && '• Featured'}</div>
              </div>
            </div>
            <div className="flex gap-2">
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
  const { data: events = [] } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const { toast } = useToast();
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
      date: event.date,
      location: event.location,
      venue: event.venue,
      type: event.type,
      ticketUrl: event.ticketUrl,
    });
    setOpen(true);
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
          <div key={event.id} className="flex items-center justify-between p-4 border rounded bg-card">
            <div>
              <div className="font-bold">{event.title}</div>
              <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()} • {event.location}</div>
            </div>
            <div className="flex gap-2">
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
  const { data: press = [] } = usePress();
  const createPress = useCreatePress();
  const updatePress = useUpdatePress();
  const deletePress = useDeletePress();
  const { toast } = useToast();
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
      snippet: item.snippet,
      date: item.date,
    });
    setOpen(true);
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
          <div key={item.id} className="flex items-center justify-between p-4 border rounded bg-card">
            <div>
              <div className="font-bold">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.source} • {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div className="flex gap-2">
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
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1 h-auto">
            <TabsTrigger value="albums" className="text-xs sm:text-sm">Albums</TabsTrigger>
            <TabsTrigger value="tracks" className="text-xs sm:text-sm">Tracks</TabsTrigger>
            <TabsTrigger value="videos" className="text-xs sm:text-sm">Videos</TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
            <TabsTrigger value="press" className="text-xs sm:text-sm">Press</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs sm:text-sm">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="albums" className="mt-4 md:mt-6"><AlbumsManager /></TabsContent>
          <TabsContent value="tracks" className="mt-4 md:mt-6"><TracksManager /></TabsContent>
          <TabsContent value="videos" className="mt-4 md:mt-6"><VideosManager /></TabsContent>
          <TabsContent value="events" className="mt-4 md:mt-6"><EventsManager /></TabsContent>
          <TabsContent value="press" className="mt-4 md:mt-6"><PressManager /></TabsContent>
          <TabsContent value="messages" className="mt-4 md:mt-6"><MessagesManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}