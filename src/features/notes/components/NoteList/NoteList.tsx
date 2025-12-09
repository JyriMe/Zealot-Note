import React, { useState, memo } from "react";
import type { Note, Folder } from "../types/noteTypes";
import { formatDate, truncateText } from "../../../../utils/helpers";
import "./NoteList.css";

interface NoteListProps {
  notes: Note[];
  folders: Folder[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onMoveNote: (noteId: string, folderId: string | null) => void;
}

const NoteList: React.FC<NoteListProps> = memo(({
  notes,
  folders,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onMoveNote,
}) => {
  const [movingNoteId, setMovingNoteId] = useState<string | null>(null);

  // Empty state
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
          role="button"
          tabIndex={0}
          aria-label={`Note: ${note.title || "Untitled Note"}`}
          aria-selected={selectedNoteId === note.id}
          onKeyDown={(e) => e.key === "Enter" && onSelectNote(note.id)}
        >
          <div className="note-item-header">
            <h3 className="note-item-title">{note.title || "Untitled Note"}</h3>
            <div className="note-item-actions">
              {/* Move to folder button */}
              <button
                className="note-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setMovingNoteId(movingNoteId === note.id ? null : note.id);
                }}
                title="Move to folder"
                aria-label="Move note to folder"
                aria-expanded={movingNoteId === note.id}
              >
                📁
              </button>
              {/* Delete button */}
              <button
                className="note-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                aria-label="Delete note"
              >
                ×
              </button>
            </div>
          </div>

          {/* Move to folder dropdown */}
          {movingNoteId === note.id && (
            <div className="note-move-dropdown" onClick={(e) => e.stopPropagation()}>
              <div
                className={`note-move-option ${note.folderId === null ? "current" : ""}`}
                onClick={() => {
                  onMoveNote(note.id, null);
                  setMovingNoteId(null);
                }}
              >
                📁 All Notes (Unfiled)
              </div>
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`note-move-option ${note.folderId === folder.id ? "current" : ""}`}
                  onClick={() => {
                    onMoveNote(note.id, folder.id);
                    setMovingNoteId(null);
                  }}
                >
                  📂 {folder.name}
                </div>
              ))}
            </div>
          )}

          <p className="note-item-preview">{truncateText(note.content)}</p>
          <span className="note-item-date">{formatDate(note.updatedAt)}</span>
        </div>
      ))}
    </div>
  );
});

export default NoteList;
