import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertAlbum, type InsertTrack, type InsertVideo, type InsertEvent, type InsertPress, type InsertMessage } from "@shared/schema";

// === ALBUMS ===
export function useAlbums() {
  return useQuery({
    queryKey: [api.albums.list.path],
    queryFn: async () => {
      const res = await fetch(api.albums.list.path);
      if (!res.ok) throw new Error("Failed to fetch albums");
      return api.albums.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAlbum) => {
      const res = await fetch(api.albums.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create album");
      return api.albums.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.albums.list.path] }),
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.albums.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete album");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.albums.list.path] }),
  });
}

// === TRACKS ===
export function useTracks() {
  return useQuery({
    queryKey: [api.tracks.list.path],
    queryFn: async () => {
      const res = await fetch(api.tracks.list.path);
      if (!res.ok) throw new Error("Failed to fetch tracks");
      return api.tracks.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTrack) => {
      const res = await fetch(api.tracks.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create track");
      return api.tracks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tracks.list.path] }),
  });
}

export function useDeleteTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tracks.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete track");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tracks.list.path] }),
  });
}

// === VIDEOS ===
export function useVideos() {
  return useQuery({
    queryKey: [api.videos.list.path],
    queryFn: async () => {
      const res = await fetch(api.videos.list.path);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return api.videos.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertVideo) => {
      const res = await fetch(api.videos.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create video");
      return api.videos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.videos.list.path] }),
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.videos.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete video");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.videos.list.path] }),
  });
}

// === EVENTS ===
export function useEvents() {
  return useQuery({
    queryKey: [api.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.events.list.path);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      // Parse dates from strings to Date objects for frontend use
      return api.events.list.responses[200].parse(data).map(e => ({
        ...e,
        date: new Date(e.date)
      }));
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEvent) => {
      const res = await fetch(api.events.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return api.events.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.events.list.path] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.events.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.events.list.path] }),
  });
}

// === PRESS ===
export function usePress() {
  return useQuery({
    queryKey: [api.press.list.path],
    queryFn: async () => {
      const res = await fetch(api.press.list.path);
      if (!res.ok) throw new Error("Failed to fetch press");
      const data = await res.json();
      return api.press.list.responses[200].parse(data).map(p => ({
        ...p,
        date: p.date ? new Date(p.date) : null
      }));
    },
  });
}

export function useCreatePress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPress) => {
      const res = await fetch(api.press.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create press item");
      return api.press.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.press.list.path] }),
  });
}

export function useDeletePress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.press.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete press item");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.press.list.path] }),
  });
}

// === MESSAGES ===
export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: InsertMessage) => {
      const res = await fetch(api.contact.send.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.contact.send.responses[201].parse(await res.json());
    },
  });
}

export function useMessages() {
  return useQuery({
    queryKey: [api.contact.list.path],
    queryFn: async () => {
      const res = await fetch(api.contact.list.path);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.contact.list.responses[200].parse(await res.json());
    },
  });
}
