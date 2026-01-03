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
  const shareUrl = content.url || window.location.origin;
  const text = content.description || content.title;
  
  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
    instagram: 'https://www.instagram.com/damodamsool?igsh=cDd6dG93MjNkcHZu',
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

function AlbumsManager() {
  const { data: albums = [] } = useAlbums(true);
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
          toast({ title: "Album mis à jour" });
        },
        onError: () => toast({ title: "Erreur lors de la mise à jour", variant: "destructive" }),
      });
    } else {
      createAlbum.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({ title: "Album créé" });
        },
        onError: () => toast({ title: "Erreur lors de la création", variant: "destructive" }),
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
    if (confirm("Êtes-vous sûr ?")) {
      deleteAlbum.mutate(id, {
        onSuccess: () => toast({ title: "Album supprimé" }),
        onError: () => toast({ title: "Erreur lors de la suppression", variant: "destructive" }),
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h2 className="text-xl md:text-2xl font-bold">Albums</h2>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) { setEditingId(null); form.reset(); }
          setOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-album"><Plus size={16} className="mr-2" /> Ajouter Album</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier Album" : "Nouvel Album"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="album-title">Titre</Label>
                <Input id="album-title" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="album-cover">Image de couverture</Label>
                <div className="flex gap-2">
                  <Input id="album-cover" {...form.register("coverImage")} className="flex-1" />
                  <FileUploadButton accept="image/*" onUploadComplete={(path) => form.setValue("coverImage", path)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="album-description">Description</Label>
                <Textarea id="album-description" {...form.register("description")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="album-release">Date de sortie</Label>
                <Input id="album-release" type="datetime-local" {...form.register("releaseDate", { valueAsDate: true })} />
              </div>
              <Button type="submit" disabled={createAlbum.isPending || updateAlbum.isPending}>
                {editingId ? "Modifier" : "Créer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3">
        {albums.map(album => (
          <div key={album.id} className={`flex items-center justify-between p-3 border rounded bg-card gap-2 ${album.hidden ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img src={album.coverImage} className="w-10 h-10 rounded object-cover" alt={album.title} />
              <div className="truncate">
                <div className="font-bold text-sm truncate">{album.title}</div>
                <div className="text-xs text-muted-foreground">{album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="outline" size="icon" onClick={() => handleEdit(album)}><Edit2 size={16} /></Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(album.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TracksManager() {
  const { data: tracks = [] } = useTracks(true);
  const createTrack = useCreateTrack();
  const updateTrack = useUpdateTrack();
  const deleteTrack = useDeleteTrack();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertTrack>({
    resolver: zodResolver(insertTrackSchema),
    defaultValues: { title: "", audioUrl: "", duration: "", isSingle: false },
  });

  const onSubmit = (data: InsertTrack) => {
    if (editingId) {
      updateTrack.mutate({ id: editingId, data }, {
        onSuccess: () => { setOpen(false); setEditingId(null); form.reset(); toast({ title: "Morceau mis à jour" }); },
      });
    } else {
      createTrack.mutate(data, {
        onSuccess: () => { setOpen(false); form.reset(); toast({ title: "Morceau ajouté" }); },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Morceaux</h2>
        <Button onClick={() => { setEditingId(null); form.reset(); setOpen(true); }}><Plus size={16} className="mr-2" /> Ajouter Morceau</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Modifier" : "Nouveau"} Morceau</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register("title")} placeholder="Titre" />
            <div className="flex gap-2">
              <Input {...form.register("audioUrl")} placeholder="URL Audio" className="flex-1" />
              <FileUploadButton accept="audio/*" onUploadComplete={(path) => form.setValue("audioUrl", path)} />
            </div>
            <Input {...form.register("duration")} placeholder="Durée (ex: 3:45)" />
            <div className="flex items-center gap-2">
              <input type="checkbox" {...form.register("isSingle")} id="track-single" />
              <Label htmlFor="track-single">Single</Label>
            </div>
            <Button type="submit">{editingId ? "Modifier" : "Ajouter"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {tracks.map(track => (
          <div key={track.id} className="flex items-center justify-between p-3 border rounded bg-card">
            <div className="truncate font-medium">{track.title}</div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => { setEditingId(track.id); form.reset(track); setOpen(true); }}><Edit2 size={16} /></Button>
              <Button variant="destructive" size="icon" onClick={() => deleteTrack.mutate(track.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideosManager() {
  const { data: videos = [] } = useVideos(true);
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertVideo>({
    resolver: zodResolver(insertVideoSchema),
    defaultValues: { title: "", youtubeUrl: "", category: "music_video", isFeatured: false },
  });

  const onSubmit = (data: InsertVideo) => {
    if (editingId) {
      updateVideo.mutate({ id: editingId, data }, {
        onSuccess: () => { setOpen(false); setEditingId(null); form.reset(); toast({ title: "Vidéo mise à jour" }); },
      });
    } else {
      createVideo.mutate(data, {
        onSuccess: () => { setOpen(false); form.reset(); toast({ title: "Vidéo ajoutée" }); },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Vidéos</h2>
        <Button onClick={() => { setEditingId(null); form.reset(); setOpen(true); }}><Plus size={16} className="mr-2" /> Ajouter Vidéo</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Modifier" : "Nouvelle"} Vidéo</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register("title")} placeholder="Titre" />
            <div className="flex gap-2">
              <Input {...form.register("youtubeUrl")} placeholder="URL Vidéo (YouTube ou Direct)" className="flex-1" />
              <FileUploadButton accept="video/*" onUploadComplete={(path) => form.setValue("youtubeUrl", path)} />
            </div>
            <div className="flex gap-2">
              <Input {...form.register("thumbnailUrl")} placeholder="URL Miniature" className="flex-1" />
              <FileUploadButton accept="image/*" onUploadComplete={(path) => form.setValue("thumbnailUrl", path)} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...form.register("isFeatured")} id="video-featured" />
              <Label htmlFor="video-featured">Mettre en avant</Label>
            </div>
            <Button type="submit">{editingId ? "Modifier" : "Ajouter"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {videos.map(video => (
          <div key={video.id} className="flex items-center justify-between p-3 border rounded bg-card">
            <div className="truncate font-medium">{video.title}</div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => { setEditingId(video.id); form.reset(video); setOpen(true); }}><Edit2 size={16} /></Button>
              <Button variant="destructive" size="icon" onClick={() => deleteVideo.mutate(video.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsManager() {
  const { data: events = [] } = useEvents(true);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: { title: "", location: "", venue: "", type: "concert" },
  });

  const onSubmit = (data: InsertEvent) => {
    if (editingId) {
      updateEvent.mutate({ id: editingId, data }, {
        onSuccess: () => { setOpen(false); setEditingId(null); form.reset(); toast({ title: "Événement mis à jour" }); },
      });
    } else {
      createEvent.mutate(data, {
        onSuccess: () => { setOpen(false); form.reset(); toast({ title: "Événement ajouté" }); },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Événements</h2>
        <Button onClick={() => { setEditingId(null); form.reset(); setOpen(true); }}><Plus size={16} className="mr-2" /> Ajouter Événement</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Modifier" : "Nouvel"} Événement</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register("title")} placeholder="Titre" />
            <Input type="datetime-local" {...form.register("date", { valueAsDate: true })} />
            <Input {...form.register("location")} placeholder="Lieu (Ville, Pays)" />
            <Input {...form.register("venue")} placeholder="Salle" />
            <Input {...form.register("ticketUrl")} placeholder="URL Billetterie" />
            <Button type="submit">{editingId ? "Modifier" : "Ajouter"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {events.map(event => (
          <div key={event.id} className="flex items-center justify-between p-3 border rounded bg-card">
            <div className="truncate font-medium">{event.title} - {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => {
                setEditingId(event.id);
                form.reset({
                  ...event,
                  date: event.date ? new Date(event.date) : new Date()
                } as any);
                setOpen(true);
              }}><Edit2 size={16} /></Button>
              <Button variant="destructive" size="icon" onClick={() => deleteEvent.mutate(event.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PressManager() {
  const { data: press = [] } = usePress(true);
  const createPress = useCreatePress();
  const updatePress = useUpdatePress();
  const deletePress = useDeletePress();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertPress>({
    resolver: zodResolver(insertPressSchema),
    defaultValues: { title: "", source: "", url: "", snippet: "" },
  });

  const onSubmit = (data: InsertPress) => {
    if (editingId) {
      updatePress.mutate({ id: editingId, data }, {
        onSuccess: () => { setOpen(false); setEditingId(null); form.reset(); toast({ title: "Article mis à jour" }); },
      });
    } else {
      createPress.mutate(data, {
        onSuccess: () => { setOpen(false); form.reset(); toast({ title: "Article ajouté" }); },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Presse</h2>
        <Button onClick={() => { setEditingId(null); form.reset(); setOpen(true); }}><Plus size={16} className="mr-2" /> Ajouter Article</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Modifier" : "Nouvel"} Article</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register("title")} placeholder="Titre" />
            <Input {...form.register("source")} placeholder="Source" />
            <Input {...form.register("url")} placeholder="URL" />
            <Textarea {...form.register("snippet")} placeholder="Extrait" />
            <Input type="date" {...form.register("date", { valueAsDate: true })} />
            <Button type="submit">{editingId ? "Modifier" : "Ajouter"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {press.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 border rounded bg-card">
            <div className="truncate font-medium">{item.title} ({item.source})</div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => {
                setEditingId(item.id);
                form.reset({
                  ...item,
                  date: item.date ? new Date(item.date) : new Date()
                } as any);
                setOpen(true);
              }}><Edit2 size={16} /></Button>
              <Button variant="destructive" size="icon" onClick={() => deletePress.mutate(item.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotosManager() {
  const { data: photos = [] } = usePhotos(true);
  const createPhoto = useCreatePhoto();
  const updatePhoto = useUpdatePhoto();
  const deletePhoto = useDeletePhoto();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<InsertPhoto>({
    resolver: zodResolver(insertPhotoSchema),
    defaultValues: { title: "", imageUrl: "", category: "concert" },
  });

  const onSubmit = (data: InsertPhoto) => {
    if (editingId) {
      updatePhoto.mutate({ id: editingId, data }, {
        onSuccess: () => { setOpen(false); setEditingId(null); form.reset(); toast({ title: "Photo mise à jour" }); },
      });
    } else {
      createPhoto.mutate(data, {
        onSuccess: () => { setOpen(false); form.reset(); toast({ title: "Photo ajoutée" }); },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Photos</h2>
        <Button onClick={() => { setEditingId(null); form.reset(); setOpen(true); }}><Plus size={16} className="mr-2" /> Ajouter Photo</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Modifier" : "Nouvelle"} Photo</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register("title")} placeholder="Titre" />
            <div className="flex gap-2">
              <Input {...form.register("imageUrl")} placeholder="URL Image" className="flex-1" />
              <FileUploadButton accept="image/*" onUploadComplete={(path) => form.setValue("imageUrl", path)} />
            </div>
            <Input {...form.register("category")} placeholder="Catégorie" />
            <Button type="submit">{editingId ? "Modifier" : "Ajouter"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="relative group aspect-square">
            <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover rounded border" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
              <Button variant="outline" size="icon" onClick={() => { setEditingId(photo.id); form.reset(photo); setOpen(true); }}><Edit2 size={16} /></Button>
              <Button variant="destructive" size="icon" onClick={() => deletePhoto.mutate(photo.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesManager() {
  const { data: messages = [] } = useMessages();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Messages reçus</h2>
      <div className="grid gap-4">
        {messages.length === 0 && <p className="text-muted-foreground">Aucun message.</p>}
        {messages.map(msg => (
          <div key={msg.id} className="p-4 border rounded bg-card space-y-2">
            <div className="flex justify-between">
              <div className="font-bold">{msg.name} ({msg.email})</div>
              <div className="text-xs text-muted-foreground">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'}</div>
            </div>
            <div className="text-sm font-medium">{msg.subject}</div>
            <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("albums");

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold">Administration</h1>
          <Button variant="outline" onClick={() => logout()} className="w-full sm:w-auto">
            <LogOut size={16} className="mr-2" /> Déconnexion
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-7 mb-8 h-auto">
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="tracks">Morceaux</TabsTrigger>
            <TabsTrigger value="videos">Vidéos</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="press">Presse</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="albums"><AlbumsManager /></TabsContent>
          <TabsContent value="tracks"><TracksManager /></TabsContent>
          <TabsContent value="videos"><VideosManager /></TabsContent>
          <TabsContent value="events"><EventsManager /></TabsContent>
          <TabsContent value="press"><PressManager /></TabsContent>
          <TabsContent value="photos"><PhotosManager /></TabsContent>
          <TabsContent value="messages"><MessagesManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
