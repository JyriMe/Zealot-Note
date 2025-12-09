import React, { useState, useEffect } from "react";
import type { Note, Folder } from "../../features/notes/components/types/noteTypes";
import FolderList from "../../features/notes/components/FolderList/FolderList";
import NoteList from "../../features/notes/components/NoteList/NoteList";
import NoteEditor from "../../features/notes/components/noteEditor/NoteEditor";
import "./Notes.css";

const Notes: React.FC = () => {
  // State
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFolders = localStorage.getItem("zealot-folders");
    const savedNotes = localStorage.getItem("zealot-notes");

    if (savedFolders) {
      try {
        setFolders(JSON.parse(savedFolders));
      } catch (error) {
        console.error("Failed to load folders:", error);
      }
    }

    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Migration: add folderId if missing
        const migratedNotes = parsedNotes.map((note: Note) => ({
          ...note,
          folderId: note.folderId ?? null,
        }));
        setNotes(migratedNotes);
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }
  }, []);

  // Save folders to localStorage
  useEffect(() => {
    localStorage.setItem("zealot-folders", JSON.stringify(folders));
  }, [folders]);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("zealot-notes", JSON.stringify(notes));
  }, [notes]);

  // Filter notes by selected folder
  const filteredNotes =
    selectedFolderId === null
      ? notes
      : notes.filter((note) => note.folderId === selectedFolderId);

  // Get note counts per folder
  const noteCounts = notes.reduce(
    (acc, note) => {
      const key = note.folderId || "unfiled";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Get the selected note object
  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  // Folder handlers
  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    // Move notes from deleted folder to unfiled
    setNotes((prev) =>
      prev.map((note) =>
        note.folderId === folderId ? { ...note, folderId: null } : note
      )
    );
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name: newName } : f))
    );
  };

  // Note handlers
  const handleCreateNew = () => {
    setSelectedNoteId(null);
    setIsCreatingNew(true);
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsCreatingNew(false);
  };

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
      // Create new note in current folder
      const newNote: Note = {
        id: crypto.randomUUID(),
        title,
        content,
        folderId: selectedFolderId,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
    }

    setIsCreatingNew(false);
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
        setIsCreatingNew(false);
      }
    }
  };

  const handleMoveNote = (noteId: string, folderId: string | null) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, folderId, updatedAt: Date.now() } : note
      )
    );
  };

  const handleCancelEdit = () => {
    setIsCreatingNew(false);
    if (isCreatingNew) {
      setSelectedNoteId(null);
    }
  };

  const showEditor = isCreatingNew || selectedNoteId;

  return (
    <div className="notes-page">
      {/* Sidebar */}
      <aside className="notes-sidebar">
        {/* Folders section */}
        <FolderList
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
          onRenameFolder={handleRenameFolder}
          noteCounts={noteCounts}
        />

        {/* Notes section */}
        <div className="notes-sidebar-header">
          <h2>{selectedFolderId ? folders.find((f) => f.id === selectedFolderId)?.name : "All Notes"}</h2>
          <button className="button" onClick={handleCreateNew}>
            + New Note
          </button>
        </div>
        <NoteList
          notes={filteredNotes}
          folders={folders}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onDeleteNote={handleDeleteNote}
          onMoveNote={handleMoveNote}
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
