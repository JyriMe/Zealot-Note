// Import React library
import React from "react";

// Import Note type definition
import type { Note } from "../types/noteTypes";

// Import CSS styles
import "./NoteList.css";

/**
 * Props Interface for NoteList component
 * Defines what data this component needs from its parent
 */
interface NoteListProps {
  notes: Note[];                                // Array of all notes to display
  selectedNoteId: string | null;                // ID of currently selected note
  onSelectNote: (noteId: string) => void;       // Function to call when user clicks a note
  onDeleteNote: (noteId: string) => void;       // Function to call when user clicks delete
}

/**
 * NoteList Component
 * Displays a scrollable list of note cards in the sidebar
 * Each card shows: title, preview of content, and last updated date
 *
 * Destructuring props to extract individual properties
 */
const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}) => {
  // ===== HELPER FUNCTIONS =====
  // These are utility functions used within this component

  /**
   * formatDate - Converts timestamp to human-readable date
   * @param timestamp - Milliseconds since Jan 1, 1970 (Unix epoch)
   * @returns Formatted date string like "Dec 9, 2025"
   */
  const formatDate = (timestamp: number) => {
    // Create a Date object from the timestamp
    const date = new Date(timestamp);

    // Convert to readable format using browser's locale
    // en-US = English (United States) format
    return date.toLocaleDateString("en-US", {
      month: "short",      // "Dec" instead of "December"
      day: "numeric",      // "9" instead of "09"
      year: "numeric",     // "2025"
    });
  };

  /**
   * truncateContent - Shortens long text with ellipsis
   * @param content - The full text to truncate
   * @param maxLength - Maximum characters before truncating (default 60)
   * @returns Shortened text with "..." at the end if it was too long
   */
  const truncateContent = (content: string, maxLength = 60) => {
    // If content is short enough, return it as-is
    if (content.length <= maxLength) return content;

    // Otherwise, cut it at maxLength and add "..."
    return content.substring(0, maxLength) + "...";
  };

  // ===== EMPTY STATE =====
  // If no notes exist, show a friendly message instead of an empty list
  if (notes.length === 0) {
    return (
      <div className="note-list-empty">
        <p>No notes yet. Create your first note!</p>
      </div>
    );
  }

  // ===== RENDER NOTE LIST =====
  return (
    <div className="note-list">
      {/*
        .map() iterates over the notes array and creates a card for each note
        Arrow function: (note) => ... runs for each note in the array
      */}
      {notes.map((note) => (
        <div
          // key is required by React for list items - helps React track which items changed
          // Must be unique - we use the note ID
          key={note.id}
          // Template literal with conditional class:
          // Always has "note-item" class
          // Adds "selected" class if this note is the selected one
          className={`note-item ${selectedNoteId === note.id ? "selected" : ""}`}
          // When user clicks anywhere on the card, call onSelectNote with this note's ID
          onClick={() => onSelectNote(note.id)}
        >
          {/* ===== NOTE HEADER: Title and Delete Button ===== */}
          <div className="note-item-header">
            {/* Title - show "Untitled Note" if title is empty */}
            <h3 className="note-item-title">
              {/* || is the "or" operator - if left side is falsy, use right side */}
              {note.title || "Untitled Note"}
            </h3>

            {/* Delete button (×) */}
            <button
              className="note-item-delete"
              onClick={(e) => {
                // e.stopPropagation() prevents the click from bubbling up
                // Without this, clicking delete would ALSO trigger the onClick on the parent div
                // (which would select the note we're trying to delete!)
                e.stopPropagation();

                // Call the delete handler passed from parent
                onDeleteNote(note.id);
              }}
              // aria-label for screen readers (accessibility)
              aria-label="Delete note"
            >
              ×
            </button>
          </div>

          {/* ===== CONTENT PREVIEW ===== */}
          {/* Show first 60 characters of note content */}
          <p className="note-item-preview">
            {truncateContent(note.content)}
          </p>

          {/* ===== LAST UPDATED DATE ===== */}
          <span className="note-item-date">{formatDate(note.updatedAt)}</span>
        </div>
      ))}
    </div>
  );
};

// Export component for use in other files
export default NoteList;
