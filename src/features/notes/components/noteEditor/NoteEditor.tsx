import React, { useState, useEffect } from "react";
import type { Note } from "../types/noteTypes";
import "./NoteEditor.css";

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string) => void;
  onCancel?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave(title, content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl + S to save
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="note-editor" onKeyDown={handleKeyDown}>
      <div className="note-editor-header">
        <input
          type="text"
          className="note-editor-title"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <div className="note-editor-actions">
          {onCancel && (
            <button className="button-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button className="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      <textarea
        className="note-editor-content"
        placeholder="Start writing your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="note-editor-footer">
        <span className="note-editor-hint">
          Press Cmd/Ctrl + S to save
        </span>
      </div>
    </div>
  );
};

export default NoteEditor;
