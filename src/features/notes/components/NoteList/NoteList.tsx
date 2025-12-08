import React from "react";
import type { Note } from "../types/noteTypes";
import "./NoteList.css";

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength = 60) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (notes.length === 0) {
    return (
      <div className="note-list-empty">
        <p>No notes yet. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`note-item ${selectedNoteId === note.id ? "selected" : ""}`}
          onClick={() => onSelectNote(note.id)}
        >
          <div className="note-item-header">
            <h3 className="note-item-title">
              {note.title || "Untitled Note"}
            </h3>
            <button
              className="note-item-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
              aria-label="Delete note"
            >
              �
            </button>
          </div>
          <p className="note-item-preview">
            {truncateContent(note.content)}
          </p>
          <span className="note-item-date">{formatDate(note.updatedAt)}</span>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
