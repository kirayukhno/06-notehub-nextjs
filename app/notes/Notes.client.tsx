'use client';

import css from "@/app/notes/page.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import { fetchNotes } from "@/lib/api";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import NoteList from "../components/NoteList/NoteList";
import SearchBox from "../components/SearchBox/SearchBox";
import Pagination from "../components/Pagination/Pagination";
import Modal from "../components/Modal/Modal";
import { NoteForm } from "../components/NoteForm/NoteForm";

export default function NotesClient() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ["notes", search, page],
        queryFn: () => fetchNotes(search, page),
        placeholderData: keepPreviousData,
    });

    const debouncedSearch = useDebouncedCallback(
        (value: string) => {
            setSearch(value);
            setPage(1);
        },
        300
    );

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onChange={debouncedSearch} />
                {data && (
                    <Pagination
                        totalPages={data.totalPages}
                        page={page}
                        onPageChange={setPage}
                    />
                )}
                 <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
            </header>
            <Toaster/>
            {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}
                        {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm
                        onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}