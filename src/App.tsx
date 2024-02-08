import { Toaster } from "sonner";
import logo from "./assets/logo-nlw-expert.svg";
import { AddNoteCard } from "./components/AddNoteCard";
import { NoteCard } from "./components/NoteCard";
import { ChangeEvent, useState } from "react";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    if (notesOnStorage) return JSON.parse(notesOnStorage);
    return [];
  });

    const onAddNote = (content: string) => {
      const newNote = {
        id: crypto.randomUUID(),
        date: new Date(),
        content
      }

      const notesArray = [newNote, ...notes]
      setNotes(notesArray);

      localStorage.setItem("notes", JSON.stringify(notesArray));
    }

    const handlesearch = (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    }

    const filteredNotes = search ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())) : notes;

    const onDeleteNote = (id: string) => {
      const notesArray = notes.filter(note => note.id !== id);
      setNotes(notesArray);
      localStorage.setItem("notes", JSON.stringify(notesArray));
    }

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-5 px-5">
      <Toaster richColors />
      <img src={logo} alt="NLW Expert" />
      <form className="w-full">
        <input
          type="text"
          placeholder="Search in your notes..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handlesearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        
        <AddNoteCard onAddNote={onAddNote} />
        { filteredNotes.map(note => <NoteCard key={note.id} note={note} onDeleteNote={onDeleteNote}/>) }

      </div>
    </div> 
  );
}
