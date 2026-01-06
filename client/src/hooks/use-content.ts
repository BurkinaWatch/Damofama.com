import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertAlbum, type InsertTrack, type InsertVideo, type InsertEvent, type InsertPress, type InsertPhoto, type InsertMessage } from "@shared/schema";

// === ALBUMS ===
export function useAlbums(includeHidden = false) {
  return useQuery({
    queryKey: [api.albums.list.path, { includeHidden }],
    queryFn: async () => {
      const url = includeHidden ? `${api.albums.list.path}?includeHidden=true` : api.albums.list.path;
      const res = await fetch(url, { credentials: "include" });
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
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create album");
      return api.albums.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.albums.list.path] }),
  });
}

export function useUpdateAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertAlbum }) => {
      const url = buildUrl(api.albums.update.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update album");
      return api.albums.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.albums.list.path] }),
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.albums.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete album");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.albums.list.path] }),
  });
}

// === TRACKS ===
export function useTracks(includeHidden = false) {
  return useQuery({
    queryKey: [api.tracks.list.path, { includeHidden }],
    queryFn: async () => {
      const url = includeHidden ? `${api.tracks.list.path}?includeHidden=true` : api.tracks.list.path;
      const res = await fetch(url, { credentials: "include" });
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
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create track");
      return api.tracks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tracks.list.path] }),
  });
}

export function useUpdateTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertTrack }) => {
      const url = buildUrl(api.tracks.update.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update track");
      return api.tracks.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tracks.list.path] }),
  });
}

export function useDeleteTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tracks.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete track");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tracks.list.path] }),
  });
}

export function useIncrementPlayCount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/tracks/${id}/play`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to increment play count");
      return await res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tracks.list.path] }),
  });
}

// === VIDEOS ===
export function useVideos(includeHidden = false) {
  return useQuery({
    queryKey: [api.videos.list.path, { includeHidden }],
    queryFn: async () => {
      const url = includeHidden ? `${api.videos.list.path}?includeHidden=true` : api.videos.list.path;
      const res = await fetch(url, { credentials: "include" });
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
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create video");
      return api.videos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.videos.list.path] }),
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertVideo }) => {
      const url = buildUrl(api.videos.update.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update video");
      return api.videos.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.videos.list.path] }),
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.videos.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete video");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.videos.list.path] }),
  });
}

// === EVENTS ===
export function useEvents(includeHidden = false) {
  return useQuery({
    queryKey: [api.events.list.path, { includeHidden }],
    queryFn: async () => {
      const url = includeHidden ? `${api.events.list.path}?includeHidden=true` : api.events.list.path;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
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
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return api.events.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.events.list.path] }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertEvent }) => {
      const url = buildUrl(api.events.update.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update event");
      return api.events.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.events.list.path] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.events.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.events.list.path] }),
  });
}

// === PRESS ===
export function usePress(includeHidden = false) {
  return useQuery({
    queryKey: [api.press.list.path, { includeHidden }],
    queryFn: async () => {
      const url = includeHidden ? `${api.press.list.path}?includeHidden=true` : api.press.list.path;
      const res = await fetch(url, { credentials: "include" });
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
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create press item");
      return api.press.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.press.list.path] }),
  });
}

export function useUpdatePress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertPress }) => {
      const url = buildUrl(api.press.update.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update press item");
      return api.press.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.press.list.path] }),
  });
}

export function useDeletePress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.press.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete press item");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.press.list.path] }),
  });
}

// === PHOTOS ===
export function usePhotos(includeHidden = false) {
  return useQuery({
    queryKey: [api.photos.list.path, { includeHidden }],
    queryFn: async () => {
      const url = includeHidden ? `${api.photos.list.path}?includeHidden=true` : api.photos.list.path;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch photos");
      return api.photos.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPhoto) => {
      const res = await fetch(api.photos.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create photo");
      return api.photos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.photos.list.path] }),
  });
}

export function useUpdatePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertPhoto }) => {
      const url = buildUrl(api.photos.update.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update photo");
      return api.photos.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.photos.list.path] }),
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.photos.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete photo");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.photos.list.path] }),
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
