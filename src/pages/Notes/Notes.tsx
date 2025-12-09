import React, { useState, useEffect, useMemo, useCallback } from "react";
import type { Note, Folder } from "../../features/notes/components/types/noteTypes";
import { parseNotesFromStorage, parseFoldersFromStorage } from "../../utils/helpers";
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

  // Load data from localStorage on mount with validation
  useEffect(() => {
    const savedFolders = localStorage.getItem("zealot-folders");
    const savedNotes = localStorage.getItem("zealot-notes");

    if (savedFolders) {
      setFolders(parseFoldersFromStorage(savedFolders));
    }

    if (savedNotes) {
      setNotes(parseNotesFromStorage(savedNotes));
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

  // Filter notes by selected folder (memoized)
  const filteredNotes = useMemo(
    () =>
      selectedFolderId === null
        ? notes
        : notes.filter((note) => note.folderId === selectedFolderId),
    [notes, selectedFolderId]
  );

  // Get note counts per folder (memoized)
  const noteCounts = useMemo(
    () =>
      notes.reduce(
        (acc, note) => {
          const key = note.folderId || "unfiled";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    [notes]
  );

  // Get the selected note object (memoized)
  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  // Folder handlers (wrapped with useCallback for performance)
  const handleCreateFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };
    setFolders((prev) => [...prev, newFolder]);
  }, []);

  const handleDeleteFolder = useCallback((folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    // Move notes from deleted folder to unfiled
    setNotes((prev) =>
      prev.map((note) =>
        note.folderId === folderId ? { ...note, folderId: null } : note
      )
    );
    setSelectedFolderId((prev) => (prev === folderId ? null : prev));
  }, []);

  const handleRenameFolder = useCallback((folderId: string, newName: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name: newName } : f))
    );
  }, []);

  // Note handlers (wrapped with useCallback for performance)
  const handleCreateNew = useCallback(() => {
    setSelectedNoteId(null);
    setIsCreatingNew(true);
  }, []);

  const handleSelectNote = useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
    setIsCreatingNew(false);
  }, []);

  const handleSaveNote = useCallback((title: string, content: string) => {
    const now = Date.now();

    setSelectedNoteId((currentSelectedId) => {
      if (currentSelectedId) {
        // Update existing note
        setNotes((prev) =>
          prev.map((note) =>
            note.id === currentSelectedId
              ? { ...note, title, content, updatedAt: now }
              : note
          )
        );
        setIsCreatingNew(false);
        return currentSelectedId;
      } else {
        // Create new note in current folder
        const newNote: Note = {
          id: crypto.randomUUID(),
          title,
          content,
          folderId: null, // Will be set properly below
          createdAt: now,
          updatedAt: now,
        };
        setSelectedFolderId((currentFolderId) => {
          newNote.folderId = currentFolderId;
          setNotes((prev) => [newNote, ...prev]);
          return currentFolderId;
        });
        setIsCreatingNew(false);
        return newNote.id;
      }
    });
  }, []);

  const handleDeleteNote = useCallback((noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      setSelectedNoteId((prev) => {
        if (prev === noteId) {
          setIsCreatingNew(false);
          return null;
        }
        return prev;
      });
    }
  }, []);

  const handleMoveNote = useCallback((noteId: string, folderId: string | null) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, folderId, updatedAt: Date.now() } : note
      )
    );
  }, []);

  // Fixed: Check isCreatingNew BEFORE setting it to false
  const handleCancelEdit = useCallback(() => {
    setIsCreatingNew((wasCreatingNew) => {
      if (wasCreatingNew) {
        setSelectedNoteId(null);
      }
      return false;
    });
  }, []);

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
