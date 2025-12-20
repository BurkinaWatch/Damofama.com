import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAlbums, useTracks, useEvents, useCreateAlbum, useCreateEvent, useDeleteAlbum, useDeleteEvent } from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAlbumSchema, insertEventSchema, type InsertAlbum, type InsertEvent } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Simple CRUD for Albums
function AlbumsManager() {
  const { data: albums } = useAlbums();
  const createAlbum = useCreateAlbum();
  const deleteAlbum = useDeleteAlbum();
  const [open, setOpen] = useState(false);

  const form = useForm<InsertAlbum>({
    resolver: zodResolver(insertAlbumSchema),
  });

  const onSubmit = (data: InsertAlbum) => {
    createAlbum.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Albums</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Album</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Album</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input {...form.register("coverImage")} />
              </div>
              <div className="space-y-2">
                <Label>Release Date (ISO)</Label>
                <Input type="datetime-local" {...form.register("releaseDate", { valueAsDate: true })} />
              </div>
              <Button type="submit" disabled={createAlbum.isPending}>
                {createAlbum.isPending ? "Creating..." : "Create Album"}
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
            <Button variant="destructive" size="icon" onClick={() => deleteAlbum.mutate(album.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple CRUD for Events
function EventsManager() {
  const { data: events } = useEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const [open, setOpen] = useState(false);

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
  });

  const onSubmit = (data: InsertEvent) => {
    createEvent.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Date (ISO)</Label>
                <Input type="datetime-local" {...form.register("date", { valueAsDate: true })} />
              </div>
              <div className="space-y-2">
                <Label>Location (City, Country)</Label>
                <Input {...form.register("location")} />
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input {...form.register("venue")} />
              </div>
              <div className="space-y-2">
                <Label>Ticket URL</Label>
                <Input {...form.register("ticketUrl")} />
              </div>
              <Button type="submit" disabled={createEvent.isPending}>
                {createEvent.isPending ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events?.map(event => (
          <div key={event.id} className="flex items-center justify-between p-4 border rounded bg-card">
            <div>
              <div className="font-bold">{event.title} - {event.location}</div>
              <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()} @ {event.venue}</div>
            </div>
            <Button variant="destructive" size="icon" onClick={() => deleteEvent.mutate(event.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    setLocation("/login");
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
              value="events" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Events
            </TabsTrigger>
            {/* Add more tabs for tracks, videos, press, messages */}
          </TabsList>

          <TabsContent value="albums">
            <AlbumsManager />
          </TabsContent>
          <TabsContent value="events">
            <EventsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
