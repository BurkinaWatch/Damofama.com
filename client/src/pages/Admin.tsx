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
import { Trash2, Plus, LogOut, CheckCircle2, Edit2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  insertAlbumSchema, insertTrackSchema, insertEventSchema, insertVideoSchema, insertPressSchema,
  type InsertAlbum, type InsertTrack, type InsertEvent, type InsertVideo, type InsertPress
} from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useUpload } from "@/hooks/use-upload";

// Simple CRUD for Albums
function AlbumsManager() {
  const { data: albums } = useAlbums();
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();
  const deleteAlbum = useDeleteAlbum();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { getUploadParameters } = useUpload();

  const form = useForm<InsertAlbum>({
    resolver: zodResolver(insertAlbumSchema),
  });

  const onSubmit = (data: InsertAlbum) => {
    if (editingId) {
      updateAlbum.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
        }
      });
    } else {
      createAlbum.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Albums</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
          }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Album</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Album" : "Add New Album"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex gap-2">
                  <Input {...form.register("coverImage")} placeholder="Or upload..." className="flex-1" />
                  <ObjectUploader onGetUploadParameters={getUploadParameters} onComplete={(result) => {
                    const files = result.successful ?? [];
                    if (files.length > 0) {
                      const uploadURL = files[0].meta?.uploadURL as string || "";
                      const fileId = uploadURL.split('/').pop();
                      form.setValue("coverImage", fileId ? `/uploads/${fileId}` : "");
                    }
                  }}>
                    <Upload size={16} />
                  </ObjectUploader>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Release Date</Label>
                <Input type="datetime-local" {...form.register("releaseDate", { valueAsDate: true })} />
              </div>
              <Button type="submit" disabled={createAlbum.isPending || updateAlbum.isPending}>
                {editingId ? (updateAlbum.isPending ? "Updating..." : "Update Album") : (createAlbum.isPending ? "Creating..." : "Create Album")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {albums?.map(album => (
          <div key={album.id} className="flex items-center justify-between p-4 border rounded bg-card">
            <div className="flex items-center gap-4">
              <img src={album.coverImage} className="w-12 h-12 rounded object-cover" alt="" />
              <div>
                <div className="font-bold">{album.title}</div>
                <div className="text-sm text-muted-foreground">{album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(album)} data-testid={`button-edit-album-${album.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteAlbum.mutate(album.id)} data-testid={`button-delete-album-${album.id}`}>
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
  const { data: tracks } = useTracks();
  const { data: albums } = useAlbums();
  const createTrack = useCreateTrack();
  const updateTrack = useUpdateTrack();
  const deleteTrack = useDeleteTrack();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { getUploadParameters } = useUpload();

  const form = useForm<InsertTrack>({
    resolver: zodResolver(insertTrackSchema),
  });

  const onSubmit = (data: InsertTrack) => {
    if (editingId) {
      updateTrack.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
        }
      });
    } else {
      createTrack.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        }
      });
    }
  };

  const handleEdit = (track: any) => {
    setEditingId(track.id);
    form.reset({
      albumId: track.albumId,
      title: track.title,
      audioUrl: track.audioUrl,
      duration: track.duration,
      isSingle: track.isSingle,
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tracks</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
          }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Track</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Track" : "Add New Track"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label>Album</Label>
                <select {...form.register("albumId", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded">
                  <option value="">Select Album</option>
                  {albums?.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Audio</Label>
                <div className="flex gap-2">
                  <Input {...form.register("audioUrl")} placeholder="Or upload..." className="flex-1" />
                  <ObjectUploader onGetUploadParameters={getUploadParameters} onComplete={(result) => {
                    const files = result.successful ?? [];
                    if (files.length > 0) {
                      const uploadURL = files[0].meta?.uploadURL as string || "";
                      const fileId = uploadURL.split('/').pop();
                      form.setValue("audioUrl", fileId ? `/uploads/${fileId}` : "");
                    }
                  }}>
                    <Upload size={16} />
                  </ObjectUploader>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Photo (Optional)</Label>
                <div className="flex gap-2">
                  <Input {...form.register("photoUrl")} placeholder="Or upload..." className="flex-1" />
                  <ObjectUploader onGetUploadParameters={getUploadParameters} onComplete={(result) => {
                    const files = result.successful ?? [];
                    if (files.length > 0) {
                      const uploadURL = files[0].meta?.uploadURL as string || "";
                      const fileId = uploadURL.split('/').pop();
                      form.setValue("photoUrl", fileId ? `/uploads/${fileId}` : "");
                    }
                  }}>
                    <Upload size={16} />
                  </ObjectUploader>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Duration (MM:SS)</Label>
                <Input {...form.register("duration")} placeholder="3:45" />
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <input type="checkbox" {...form.register("isSingle")} id="isSingle" />
                <Label htmlFor="isSingle">Is Single</Label>
              </div>
              <Button type="submit" disabled={createTrack.isPending || updateTrack.isPending}>
                {editingId ? (updateTrack.isPending ? "Updating..." : "Update Track") : (createTrack.isPending ? "Creating..." : "Create Track")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tracks?.map(track => (
          <div key={track.id} className="flex items-center justify-between p-4 border rounded bg-card">
            <div>
              <div className="font-bold">{track.title}</div>
              <div className="text-sm text-muted-foreground">{track.duration} {track.isSingle && '• Single'}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(track)} data-testid={`button-edit-track-${track.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteTrack.mutate(track.id)} data-testid={`button-delete-track-${track.id}`}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Videos Manager
function VideosManager() {
  const { data: videos } = useVideos();
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { getUploadParameters } = useUpload();

  const form = useForm<InsertVideo>({
    resolver: zodResolver(insertVideoSchema),
  });

  const onSubmit = (data: InsertVideo) => {
    if (editingId) {
      updateVideo.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
        }
      });
    } else {
      createVideo.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        }
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
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Videos</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
          }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Video</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Video" : "Add New Video"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input {...form.register("youtubeUrl")} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <div className="flex gap-2">
                  <Input {...form.register("thumbnailUrl")} placeholder="Or upload..." className="flex-1" />
                  <ObjectUploader onGetUploadParameters={getUploadParameters} onComplete={(result) => {
                    const files = result.successful ?? [];
                    if (files.length > 0) {
                      const uploadURL = files[0].meta?.uploadURL as string || "";
                      const fileId = uploadURL.split('/').pop();
                      form.setValue("thumbnailUrl", fileId ? `/uploads/${fileId}` : "");
                    }
                  }}>
                    <Upload size={16} />
                  </ObjectUploader>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select {...form.register("category")} className="w-full px-3 py-2 border rounded">
                  <option value="music_video">Music Video</option>
                  <option value="live">Live</option>
                  <option value="interview">Interview</option>
                </select>
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <input type="checkbox" {...form.register("isFeatured")} id="isFeatured" />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
              <Button type="submit" disabled={createVideo.isPending || updateVideo.isPending}>
                {editingId ? (updateVideo.isPending ? "Updating..." : "Update Video") : (createVideo.isPending ? "Creating..." : "Create Video")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {videos?.map(video => (
          <div key={video.id} className="flex items-center justify-between p-4 border rounded bg-card">
            <div className="flex items-center gap-4">
              <img src={video.thumbnailUrl || ""} alt="" className="w-16 h-9 object-cover rounded" />
              <div>
                <div className="font-bold">{video.title}</div>
                <div className="text-sm text-muted-foreground">{video.category} {video.isFeatured && '• Featured'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(video)} data-testid={`button-edit-video-${video.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteVideo.mutate(video.id)} data-testid={`button-delete-video-${video.id}`}>
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
  const { data: events } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
  });

  const onSubmit = (data: InsertEvent) => {
    if (editingId) {
      updateEvent.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
        }
      });
    } else {
      createEvent.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
          }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Event" : "Add New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="datetime-local" {...form.register("date", { valueAsDate: true })} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input {...form.register("location")} placeholder="City, Country" />
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input {...form.register("venue")} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select {...form.register("type")} className="w-full px-3 py-2 border rounded">
                  <option value="concert">Concert</option>
                  <option value="festival">Festival</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Ticket URL</Label>
                <Input {...form.register("ticketUrl")} placeholder="https://..." />
              </div>
              <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending}>
                {editingId ? (updateEvent.isPending ? "Updating..." : "Update Event") : (createEvent.isPending ? "Creating..." : "Create Event")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events?.map(event => (
          <div key={event.id} className="flex items-center justify-between p-4 border rounded bg-card">
            <div>
              <div className="font-bold">{event.title}</div>
              <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()} • {event.location}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(event)} data-testid={`button-edit-event-${event.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteEvent.mutate(event.id)} data-testid={`button-delete-event-${event.id}`}>
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
  const { data: press } = usePress();
  const createPress = useCreatePress();
  const updatePress = useUpdatePress();
  const deletePress = useDeletePress();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { getUploadParameters } = useUpload();

  const form = useForm<InsertPress>({
    resolver: zodResolver(insertPressSchema),
  });

  const onSubmit = (data: InsertPress) => {
    if (editingId) {
      updatePress.mutate({ id: editingId, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          form.reset();
        }
      });
    } else {
      createPress.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Press & Media</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingId(null);
            form.reset();
            setOpen(false);
          } else {
            setOpen(true);
          }
        }}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Press Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Press Item" : "Add Press Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Input {...form.register("source")} placeholder="Publication name" />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input {...form.register("url")} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Snippet</Label>
                <Textarea {...form.register("snippet")} placeholder="Brief excerpt..." />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="datetime-local" {...form.register("date", { valueAsDate: true })} />
              </div>
              <Button type="submit" disabled={createPress.isPending || updatePress.isPending}>
                {editingId ? (updatePress.isPending ? "Updating..." : "Update Press Item") : (createPress.isPending ? "Creating..." : "Create Press Item")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {press?.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded bg-card">
            <div>
              <div className="font-bold">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.source} • {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(item)} data-testid={`button-edit-press-${item.id}`}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deletePress.mutate(item.id)} data-testid={`button-delete-press-${item.id}`}>
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
  const { data: messages } = useMessages();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contact Messages</h2>

      <div className="grid gap-4">
        {messages && messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg.id} className="p-4 border rounded bg-card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold">{msg.name}</div>
                  <div className="text-sm text-muted-foreground">{msg.email}</div>
                </div>
                {msg.read ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                )}
              </div>
              <div className="text-sm font-semibold mb-2">{msg.subject}</div>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</div>
              <div className="text-xs text-muted-foreground mt-2">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">No messages yet</div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [isLoading, user, setLocation]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-bold">Content Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {user.username}</span>
            <Button variant="outline" onClick={() => logout()}>
              <LogOut size={16} className="mr-2" /> Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="albums" className="w-full">
          <TabsList className="mb-8 w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="albums" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Albums
            </TabsTrigger>
            <TabsTrigger 
              value="tracks" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Tracks
            </TabsTrigger>
            <TabsTrigger 
              value="videos" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="press" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Press
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="albums">
            <AlbumsManager />
          </TabsContent>
          <TabsContent value="tracks">
            <TracksManager />
          </TabsContent>
          <TabsContent value="videos">
            <VideosManager />
          </TabsContent>
          <TabsContent value="events">
            <EventsManager />
          </TabsContent>
          <TabsContent value="press">
            <PressManager />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
