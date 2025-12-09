import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import type { Note } from "../types/noteTypes";
import "./NoteEditor.css";

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string) => void;
  onCancel?: () => void;
}

const NoteEditor = ({ note, onSave, onCancel }: NoteEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit");

  // Sync form with note prop when it changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  // Save if title or content has text
  const handleSave = useCallback(() => {
    if (title.trim() || content.trim()) {
      onSave(title, content);
    }
  }, [title, content, onSave]);

  // Global keyboard shortcut: Cmd/Ctrl + S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <input
          type="text"
          className="note-editor-title"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          aria-label="Note title"
        />
        <div className="note-editor-actions">
          {/* View mode toggle */}
          <div className="view-mode-toggle" role="group" aria-label="View mode">
            <button
              className={`view-mode-btn ${viewMode === "edit" ? "active" : ""}`}
              onClick={() => setViewMode("edit")}
              title="Edit mode"
              aria-label="Edit mode"
              aria-pressed={viewMode === "edit"}
            >
              ✏️
            </button>
            <button
              className={`view-mode-btn ${viewMode === "split" ? "active" : ""}`}
              onClick={() => setViewMode("split")}
              title="Split view"
              aria-label="Split view"
              aria-pressed={viewMode === "split"}
            >
              ⬜
            </button>
            <button
              className={`view-mode-btn ${viewMode === "preview" ? "active" : ""}`}
              onClick={() => setViewMode("preview")}
              title="Preview mode"
              aria-label="Preview mode"
              aria-pressed={viewMode === "preview"}
            >
              👁️
            </button>
          </div>

          {onCancel && (
            <button className="button-secondary" onClick={onCancel} aria-label="Cancel editing">
              Cancel
            </button>
          )}
          <button className="button" onClick={handleSave} aria-label="Save note">
            Save
          </button>
        </div>
      </div>

      <div className={`note-editor-body ${viewMode}`}>
        {/* Editor pane */}
        {(viewMode === "edit" || viewMode === "split") && (
          <textarea
            className="note-editor-content"
            placeholder="Start writing in markdown...

# Heading 1
## Heading 2

**bold** and *italic*

- List item 1
- List item 2

[Link](url)

`code`"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-label="Note content"
          />
        )}

        {/* Preview pane */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className="note-editor-preview">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="preview-placeholder">Preview will appear here...</p>
            )}
          </div>
        )}
      </div>

      <div className="note-editor-footer">
        <span className="note-editor-hint">
          Markdown supported • Cmd/Ctrl + S to save
        </span>
      </div>
    </div>
  );
};

export default NoteEditor;
