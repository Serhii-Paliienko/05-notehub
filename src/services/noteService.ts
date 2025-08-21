import type { AxiosInstance } from "axios";
import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;
if (!token) throw new Error("Missing VITE_NOTEHUB_TOKEN");

const api: AxiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: { Authorization: `Bearer ${token}` },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  tag: NoteTag;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search } = params;
  const res = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search },
  });
  return res.data;
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const res = await api.post<{ note: Note }>("/notes", input);
  return res.data.note;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<{ note: Note }>(`/notes/${id}`);
  return res.data.note;
}
