import { useEffect, useMemo, useState } from "react";
import css from "./App.module.css";
import { useDebounce } from "use-debounce";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  fetchNotes,
  type CreateNoteInput,
  type FetchNotesResponse,
} from "../../services/noteService";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

function Loader() {
  return <div className={css.loader}>Loading...</div>;
}

function ErrorBox({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : "Unknown error";
  return <div className={css.error}>Error: {msg}</div>;
}

const App = () => {
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debounceSearch]);

  const queryKey = useMemo(
    () => ["notes", { page, perPage, search: debounceSearch }],
    [page, perPage, debounceSearch]
  );

  const { data, isPending, error } = useQuery<FetchNotesResponse>({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search: debounceSearch,
      }),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateNoteInput) => createNote(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  async function handleCreate(values: CreateNoteInput) {
    await createMutation.mutateAsync(values);
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isPending && <Loader />}
      {error && <ErrorBox error={error} />}
      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onCreate={handleCreate}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
