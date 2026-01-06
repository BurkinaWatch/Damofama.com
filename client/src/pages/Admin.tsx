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
import { Trash2, Plus, LogOut, Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertAlbumSchema, insertTrackSchema, insertEventSchema, insertVideoSchema, insertPressSchema, insertPhotoSchema,
  type InsertAlbum, type InsertTrack, type InsertEvent, type InsertVideo, type InsertPress, type InsertPhoto
} from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadButton } from "@/components/FileUploadButton";
import { useToast } from "@/hooks/use-toast";

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
        onError: (err: any) => toast({ 
          title: "Erreur lors de la mise à jour", 
          description: err.message,
          variant: "destructive" 
        }),
      });
    } else {
      createAlbum.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({ title: "Album créé" });
        },
        onError: (err: any) => toast({ 
          title: "Erreur lors de la création", 
          description: err.message,
          variant: "destructive" 
        }),
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Albums</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Ajouter Album</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier Album" : "Nouvel Album"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Image de couverture</Label>
                <div className="flex gap-2">
                  <Input {...form.register("coverImage")} className="flex-1" />
                  <FileUploadButton accept="image/*" onUploadComplete={(path) => form.setValue("coverImage", path)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} rows={3} />
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
          <div key={album.id} className="flex items-center justify-between p-3 border rounded bg-card">
            <div className="flex items-center gap-3">
              <img src={album.coverImage} className="w-10 h-10 rounded object-cover" alt={album.title} />
              <div className="font-bold">{album.title}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(album)}><Edit2 size={16} /></Button>
              <Button variant="destructive" size="icon" onClick={() => deleteAlbum.mutate(album.id)}><Trash2 size={16} /></Button>
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
        onError: () => toast({ title: "Erreur lors de la mise à jour", variant: "destructive" }),
      });
    } else {
      createTrack.mutate(data, {
        onSuccess: () => { setOpen(false); form.reset(); toast({ title: "Morceau ajouté" }); },
        onError: () => toast({ title: "Erreur lors de l'ajout", variant: "destructive" }),
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
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier" : "Nouveau"} Morceau</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input {...form.register("title")} placeholder="Titre" />
            </div>
            <div className="space-y-2">
              <Label>Fichier Audio</Label>
              <div className="flex gap-2">
                <Input {...form.register("audioUrl")} placeholder="URL Audio" className="flex-1" />
                <FileUploadButton accept="audio/*" onUploadComplete={(path) => form.setValue("audioUrl", path)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Durée (ex: 3:45)</Label>
              <Input {...form.register("duration")} placeholder="Durée (ex: 3:45)" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...form.register("isSingle")} id="track-single" />
              <Label htmlFor="track-single">Single</Label>
            </div>
            <Button type="submit" disabled={createTrack.isPending || updateTrack.isPending}>
              {editingId ? "Modifier" : "Ajouter"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {tracks.map(track => (
          <div key={track.id} className="flex items-center justify-between p-3 border rounded bg-card">
            <div className="flex flex-col">
              <div className="font-medium">{track.title}</div>
              <div className="text-xs text-muted-foreground">{track.playCount || 0} lectures</div>
            </div>
            <div className="flex gap-2">
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
    defaultValues: { title: "", youtubeUrl: "", type: "clip", category: "music_video", isFeatured: false },
  });

  const onSubmit = (data: InsertVideo) => {
    console.log("Submitting video data:", data);
    // Assurer que le type est présent
    const submissionData = {
      ...data,
      type: data.type || "clip",
      category: data.category || "music_video"
    };
    
    if (editingId) {
      updateVideo.mutate({ id: editingId, data: submissionData }, {
        onSuccess: () => { 
          console.log("Video updated successfully");
          setOpen(false); 
          setEditingId(null); 
          form.reset(); 
          toast({ title: "Vidéo mise à jour" }); 
        },
        onError: (err: any) => {
          console.error("Error updating video:", err);
          let description = "Une erreur est survenue lors de la communication avec le serveur.";
          try {
            const errorData = JSON.parse(err.message);
            if (errorData.details) description = errorData.details;
          } catch (e) {
            if (err.message) description = err.message;
          }
          toast({ 
            title: "Erreur lors de la mise à jour", 
            description,
            variant: "destructive" 
          });
        },
      });
    } else {
      createVideo.mutate(submissionData, {
        onSuccess: () => { 
          console.log("Video created successfully");
          setOpen(false); 
          form.reset(); 
          toast({ title: "Vidéo ajoutée" }); 
        },
        onError: (err: any) => {
          console.error("Error creating video:", err);
          let description = "Une erreur est survenue lors de la communication avec le serveur.";
          try {
            const errorData = JSON.parse(err.message);
            if (errorData.details) description = errorData.details;
          } catch (e) {
            if (err.message) description = err.message;
          }
          toast({ 
            title: "Erreur lors de l'ajout", 
            description,
            variant: "destructive" 
          });
        },
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
            <select {...form.register("type")} className="w-full h-10 rounded border bg-background px-3">
              <option value="clip">Clip Vidéo</option>
              <option value="live">Live / Concert</option>
            </select>
            <Input {...form.register("youtubeUrl")} placeholder="URL YouTube" />
            <div className="flex items-center gap-2">
              <input type="checkbox" {...form.register("isFeatured")} id="v-feat" />
              <Label htmlFor="v-feat">Mettre en avant</Label>
            </div>
            <Button type="submit">{editingId ? "Modifier" : "Ajouter"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {videos.map(video => (
          <div key={video.id} className="flex items-center justify-between p-3 border rounded bg-card">
            <div>
              <div className="font-medium">{video.title}</div>
              <div className="text-xs text-muted-foreground uppercase">{video.type}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => { 
                setEditingId(video.id); 
                form.reset({
                  title: video.title,
                  youtubeUrl: video.youtubeUrl,
                  type: video.type as "clip" | "live",
                  category: video.category ?? "music_video",
                  isFeatured: video.isFeatured ?? false,
                  hidden: video.hidden ?? false
                }); 
                setOpen(true); 
              }}><Edit2 size={16} /></Button>
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
    defaultValues: { title: "", location: "", venue: "", type: "concert", date: new Date() },
  });

  const onSubmit = (data: InsertEvent) => {
    // Ensure date is properly handled
    const submissionData = {
      ...data,
      date: data.date instanceof Date ? data.date : new Date(data.date)
    };

    if (editingId) {
      updateEvent.mutate({ id: editingId, data: submissionData }, {
        onSuccess: () => { setOpen(false); setEditingId(null); form.reset(); toast({ title: "Événement mis à jour" }); },
        onError: () => toast({ title: "Erreur lors de la mise à jour", variant: "destructive" }),
      });
    } else {
      createEvent.mutate(submissionData, {
        onSuccess: () => { setOpen(false); form.reset(); toast({ title: "Événement ajouté" }); },
        onError: () => toast({ title: "Erreur lors de l'ajout", variant: "destructive" }),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Événements</h2>
        <Button onClick={() => { setEditingId(null); form.reset({ title: "", location: "", venue: "", type: "concert", date: new Date() }); setOpen(true); }}><Plus size={16} className="mr-2" /> Ajouter Événement</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier" : "Nouvel"} Événement</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="event-title">Nom de l'événement</Label>
                <Input id="event-title" {...form.register("title")} placeholder="Ex: Concert Tounganata" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-date">Date et heure</Label>
                  <Input 
                    id="event-date"
                    type="datetime-local" 
                    {...form.register("date", { 
                      valueAsDate: true,
                      setValueAs: (v) => v ? new Date(v) : new Date()
                    })} 
                    defaultValue={editingId ? undefined : new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-type">Type</Label>
                  <select 
                    id="event-type"
                    {...form.register("type")} 
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="concert">Concert</option>
                    <option value="festival">Festival</option>
                    <option value="showcase">Showcase</option>
                    <option value="private">Privé</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-venue">Salle / Lieu précis</Label>
                  <Input id="event-venue" {...form.register("venue")} placeholder="Ex: Palais de la Culture" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-location">Ville, Pays</Label>
                  <Input id="event-location" {...form.register("location")} placeholder="Ex: Ouagadougou, BF" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full sm:w-auto" disabled={createEvent.isPending || updateEvent.isPending}>
                {editingId ? "Enregistrer les modifications" : "Ajouter l'événement"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {events.map(event => (
          <div key={event.id} className="flex items-center justify-between p-3 border rounded bg-card">
            <div className="font-medium">{event.title}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => { setEditingId(event.id); form.reset({ ...event, date: event.date ? new Date(event.date) : undefined } as any); setOpen(true); }}><Edit2 size={16} /></Button>
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
    defaultValues: { title: "", source: "", url: "", snippet: "", date: new Date() },
  });

  const onSubmit = (data: InsertPress) => {
    const submissionData = {
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : new Date().toISOString()
    };
    if (editingId) {
      updatePress.mutate({ id: editingId, data: submissionData as any }, {
        onSuccess: () => { setOpen(false); setEditingId(null); form.reset(); toast({ title: "Article mis à jour" }); },
        onError: () => toast({ title: "Erreur lors de la mise à jour", variant: "destructive" }),
      });
    } else {
      createPress.mutate(submissionData as any, {
        onSuccess: () => { setOpen(false); form.reset(); toast({ title: "Article ajouté" }); },
        onError: () => toast({ title: "Erreur lors de l'ajout", variant: "destructive" }),
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier" : "Nouvel"} Article de Presse</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre de l'article</Label>
                <Input id="title" {...form.register("title")} placeholder="Ex: Interview exclusive avec..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="source">Source / Média</Label>
                  <Input id="source" {...form.register("source")} placeholder="Ex: Rolling Stone" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Lien de l'article</Label>
                  <Input id="url" {...form.register("url")} placeholder="https://..." />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="snippet">Extrait / Description</Label>
                <Textarea 
                  id="snippet" 
                  {...form.register("snippet")} 
                  placeholder="Un court résumé de l'article..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full sm:w-auto">
                {editingId ? "Enregistrer les modifications" : "Ajouter l'article"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {press.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 border rounded bg-card">
            <div className="font-medium">{item.title}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => { setEditingId(item.id); form.reset(item); setOpen(true); }}><Edit2 size={16} /></Button>
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
  const deletePhoto = useDeletePhoto();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<InsertPhoto>({
    resolver: zodResolver(insertPhotoSchema),
    defaultValues: { title: "", imageUrl: "", category: "concert" },
  });

  const onSubmit = (data: InsertPhoto) => {
    createPhoto.mutate(data, {
      onSuccess: () => { setOpen(false); form.reset(); toast({ title: "Photo ajoutée" }); },
      onError: (err: any) => toast({ 
        title: "Erreur lors de l'ajout", 
        description: err.message,
        variant: "destructive" 
      }),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Photos</h2>
        <Button onClick={() => { form.reset(); setOpen(true); }}><Plus size={16} className="mr-2" /> Ajouter Photo</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvelle Photo</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register("title")} placeholder="Titre" />
            <div className="flex gap-2">
              <Input {...form.register("imageUrl")} placeholder="URL Image" className="flex-1" />
              <FileUploadButton accept="image/*" onUploadComplete={(path) => form.setValue("imageUrl", path)} />
            </div>
            <Input {...form.register("category")} placeholder="Catégorie" />
            <Button type="submit">Ajouter</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="relative group aspect-square">
            <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover rounded border" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
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
            <div className="flex justify-between font-bold">
              <div>{msg.name} ({msg.email})</div>
              <div className="text-xs text-muted-foreground">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'}</div>
            </div>
            <p className="text-sm">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({ logout }: { logout: any }) {
  const [activeTab, setActiveTab] = useState("albums");

  const tabs = [
    { value: "albums", label: "Albums" },
    { value: "tracks", label: "Musique" },
    { value: "videos", label: "Vidéos" },
    { value: "events", label: "Events" },
    { value: "press", label: "Presse" },
    { value: "photos", label: "Photos" },
    { value: "messages", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold uppercase tracking-tight">Admin Dashboard</h1>
          <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending}>
            <LogOut size={16} className="mr-2" /> Déconnexion
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto mb-6">
            <TabsList className="inline-flex w-auto min-w-max">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="px-4 py-2" data-testid={`tab-${tab.value}`}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
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

export default function Admin() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user || user.role !== "admin") return null;

  return <AdminDashboard logout={logout} />;
}
