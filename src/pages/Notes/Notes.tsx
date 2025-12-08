// Import React and hooks
// useState: lets us create state variables that trigger re-renders when changed
// useEffect: lets us run code when component mounts or when dependencies change
import React, { useState, useEffect } from "react";

// Import TypeScript type for Note
// "type" keyword means we're only importing the type definition, not runtime code
import type { Note } from "../../features/notes/components/types/noteTypes";

// Import our child components
import NoteList from "../../features/notes/components/NoteList/NoteList";
import NoteEditor from "../../features/notes/components/noteEditor/NoteEditor";

// Import CSS styles for this component
import "./Notes.css";

/**
 * Notes Component - Main notes page
 * This component manages the state for all notes and coordinates between
 * the NoteList (sidebar) and NoteEditor (main content area)
 */
const Notes: React.FC = () => {
  // ===== STATE MANAGEMENT =====
  // State is data that can change over time and triggers component re-renders

  /**
   * notes: Array of all note objects
   * setNotes: Function to update the notes array
   * useState<Note[]>([]) means:
   *   - Initial value is empty array []
   *   - TypeScript knows this will be an array of Note objects
   */
  const [notes, setNotes] = useState<Note[]>([]);

  /**
   * selectedNoteId: ID of the currently selected note (or null if none selected)
   * When user clicks a note in the sidebar, we store its ID here
   */
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  /**
   * isCreatingNew: Boolean flag to track if user is creating a new note
   * true = user clicked "New Note" button
   * false = user is viewing/editing existing note or nothing is selected
   */
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // ===== LOAD NOTES FROM LOCALSTORAGE ON COMPONENT MOUNT =====
  /**
   * useEffect Hook - Runs code after component renders
   * The empty dependency array [] means this runs ONLY ONCE when component first mounts
   * This is perfect for loading saved data when the app starts
   */
  useEffect(() => {
    // localStorage is browser storage that persists even after closing the tab
    // getItem() retrieves data by key name
    const savedNotes = localStorage.getItem("zealot-notes");

    // Check if we found any saved notes
    if (savedNotes) {
      try {
        // JSON.parse converts JSON string back into JavaScript objects
        const parsed = JSON.parse(savedNotes);
        // Update state with the loaded notes
        setNotes(parsed);
      } catch (error) {
        // If parsing fails (corrupted data), log error instead of crashing
        console.error("Failed to load notes:", error);
      }
    }
  }, []); // Empty array = only run once on mount

  // ===== SAVE NOTES TO LOCALSTORAGE WHENEVER THEY CHANGE =====
  /**
   * useEffect Hook - Auto-save feature
   * The dependency array [notes] means this runs whenever 'notes' changes
   * This ensures every change is immediately saved to browser storage
   */
  useEffect(() => {
    // JSON.stringify converts JavaScript objects into a JSON string
    // setItem() saves the string to localStorage with key "zealot-notes"
    localStorage.setItem("zealot-notes", JSON.stringify(notes));
  }, [notes]); // Runs whenever notes array changes

  // ===== DERIVED STATE =====
  /**
   * selectedNote: The full Note object of the currently selected note
   * .find() searches the array for a note matching the selectedNoteId
   * || null means "if not found, use null instead of undefined"
   *
   * This is "derived state" - calculated from existing state, not stored separately
   */
  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  // ===== EVENT HANDLERS =====
  // Functions that respond to user actions (clicks, form submissions, etc.)

  /**
   * handleCreateNew - Called when user clicks "+ New Note" button
   * Sets up state for creating a brand new note
   */
  const handleCreateNew = () => {
    setSelectedNoteId(null);      // Clear any selected note
    setIsCreatingNew(true);        // Flag that we're in "new note" mode
  };

  /**
   * handleSelectNote - Called when user clicks a note in the sidebar
   * @param noteId - The ID of the note that was clicked
   */
  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);     // Set this note as selected
    setIsCreatingNew(false);       // We're not creating new, we're editing existing
  };

  /**
   * handleSaveNote - Called when user clicks "Save" in the editor
   * Handles both creating new notes and updating existing ones
   * @param title - The note title from the editor
   * @param content - The note content from the editor
   */
  const handleSaveNote = (title: string, content: string) => {
    // Get current timestamp in milliseconds since Jan 1, 1970 (Unix epoch)
    const now = Date.now();

    // Check if we're updating an existing note or creating a new one
    if (selectedNoteId) {
      // ===== UPDATE EXISTING NOTE =====
      // setNotes takes a function that receives previous state (prev)
      setNotes((prev) =>
        prev.map((note) =>
          // For each note, check if it's the one being edited
          note.id === selectedNoteId
            ? { ...note, title, content, updatedAt: now } // If yes, update it (...note keeps other properties like createdAt)
            : note // If no, keep it unchanged
        )
      );
    } else {
      // ===== CREATE NEW NOTE =====
      // Build a new Note object
      const newNote: Note = {
        id: crypto.randomUUID(),   // Generate unique ID (built-in browser API)
        title,                     // Title from editor
        content,                   // Content from editor
        createdAt: now,           // Set creation timestamp
        updatedAt: now,           // Set update timestamp (same as creation for new notes)
      };

      // Add new note to the beginning of the array
      // [newNote, ...prev] means "new note first, then all previous notes"
      setNotes((prev) => [newNote, ...prev]);

      // Select the newly created note
      setSelectedNoteId(newNote.id);
    }

    // Exit "creating new" mode (we just saved it)
    setIsCreatingNew(false);
  };

  /**
   * handleDeleteNote - Called when user clicks delete (×) button on a note
   * @param noteId - ID of the note to delete
   */
  const handleDeleteNote = (noteId: string) => {
    // Show browser confirmation dialog to prevent accidental deletions
    if (window.confirm("Are you sure you want to delete this note?")) {
      // .filter() creates a new array with only notes that don't match the ID
      // This effectively removes the note with the matching ID
      setNotes((prev) => prev.filter((note) => note.id !== noteId));

      // If we deleted the currently selected note, clear the selection
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
        setIsCreatingNew(false);
      }
    }
  };

  /**
   * handleCancelEdit - Called when user clicks "Cancel" in the editor
   * Closes the editor without saving changes
   */
  const handleCancelEdit = () => {
    setIsCreatingNew(false);  // Exit "creating new" mode

    // Only clear selection if we were creating a new note
    // If editing existing note, keep it selected (better UX)
    if (isCreatingNew) {
      setSelectedNoteId(null);
    }
  };

  // ===== UI LOGIC =====
  /**
   * showEditor: Determines whether to show the editor or empty state
   * Show editor if:
   *   - User is creating a new note (isCreatingNew = true), OR
   *   - A note is selected (selectedNoteId has a value)
   */
  const showEditor = isCreatingNew || selectedNoteId;

  // ===== RENDER THE COMPONENT =====
  return (
    <div className="notes-page">
      {/* ===== SIDEBAR (Left side) ===== */}
      {/* <aside> is semantic HTML for sidebar content */}
      <aside className="notes-sidebar">
        {/* Header with title and "New Note" button */}
        <div className="notes-sidebar-header">
          <h2>My Notes</h2>
          <button className="button" onClick={handleCreateNew}>
            + New Note
          </button>
        </div>

        {/* List of all notes - we pass data and event handlers as props */}
        <NoteList
          notes={notes}                      // All notes to display
          selectedNoteId={selectedNoteId}    // Which note is currently selected
          onSelectNote={handleSelectNote}    // What to do when user clicks a note
          onDeleteNote={handleDeleteNote}    // What to do when user clicks delete
        />
      </aside>

      {/* ===== MAIN CONTENT AREA (Right side) ===== */}
      <main className="notes-content">
        {/* Conditional rendering: show editor OR empty state */}
        {showEditor ? (
          // Show the note editor when a note is selected or creating new
          <NoteEditor
            note={selectedNote}              // The note to edit (null if creating new)
            onSave={handleSaveNote}          // What to do when user clicks Save
            onCancel={handleCancelEdit}      // What to do when user clicks Cancel
          />
        ) : (
          // Show welcome message when nothing is selected
          <div className="notes-empty-state">
            <h2>Welcome to Zealot Notes</h2>
            <p>Select a note from the sidebar or create a new one to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Export the component so it can be imported in App.tsx
export default Notes;
