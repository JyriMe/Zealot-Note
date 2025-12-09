import React, { useState, useEffect } from "react";
import type { Note } from "../../features/notes/components/types/noteTypes";
import NoteList from "../../features/notes/components/NoteList/NoteList";
import NoteEditor from "../../features/notes/components/noteEditor/NoteEditor";
import "./Notes.css";

const Notes: React.FC = () => {
  // State for notes array, selected note ID, and new note mode
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("zealot-notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("zealot-notes", JSON.stringify(notes));
  }, [notes]);

  // Get the full note object for the selected ID
  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  // Create new note
  const handleCreateNew = () => {
    setSelectedNoteId(null);
    setIsCreatingNew(true);
  };

  // Select existing note
  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsCreatingNew(false);
  };

  // Save note (create or update)
  const handleSaveNote = (title: string, content: string) => {
    const now = Date.now();

    if (selectedNoteId) {
      // Update existing note
      setNotes((prev) =>
        prev.map((note) =>
          note.id === selectedNoteId
            ? { ...note, title, content, updatedAt: now }
            : note
        )
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
    }

    setIsCreatingNew(false);
  };

  // Delete note with confirmation
  const handleDeleteNote = (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
        setIsCreatingNew(false);
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsCreatingNew(false);
    if (isCreatingNew) {
      setSelectedNoteId(null);
    }
  };

  // Show editor if creating new or editing existing
  const showEditor = isCreatingNew || selectedNoteId;

  return (
    <div className="notes-page">
      {/* Sidebar */}
      <aside className="notes-sidebar">
        <div className="notes-sidebar-header">
          <h2>My Notes</h2>
          <button className="button" onClick={handleCreateNew}>
            + New Note
          </button>
        </div>
        <NoteList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onDeleteNote={handleDeleteNote}
        />
      </aside>

      {/* Main content */}
      <main className="notes-content">
        {showEditor ? (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onCancel={handleCancelEdit}
          />
        ) : (
          <div className="notes-empty-state">
            <h2>Welcome to Zealot Notes</h2>
            <p>Select a note from the sidebar or create a new one to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;
