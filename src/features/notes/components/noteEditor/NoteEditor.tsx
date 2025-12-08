// Import React and hooks
import React, { useState, useEffect } from "react";

// Import Note type definition
import type { Note } from "../types/noteTypes";

// Import styles for this component
import "./NoteEditor.css";

/**
 * Props (Properties) Interface
 * Defines what data this component expects to receive from its parent
 * This is like a contract - the parent MUST provide these props
 */
interface NoteEditorProps {
  note: Note | null;   // The note to edit (null if creating new note)
  onSave: (title: string, content: string) => void;  // Function to call when user clicks Save
  onCancel?: () => void;  // Optional function to call when user clicks Cancel (? means optional)
}

/**
 * NoteEditor Component
 * Provides a form for creating or editing notes
 * Has a title input, content textarea, and Save/Cancel buttons
 *
 * Destructuring props: { note, onSave, onCancel }
 * This extracts the properties directly instead of writing props.note, props.onSave, etc.
 */
const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  // ===== LOCAL STATE =====
  // These are separate from the note prop - they track what user is typing RIGHT NOW
  // This is called "controlled components" - React controls the input value

  /**
   * title: The current text in the title input field
   * setTitle: Function to update the title state
   */
  const [title, setTitle] = useState("");

  /**
   * content: The current text in the content textarea
   * setContent: Function to update the content state
   */
  const [content, setContent] = useState("");

  // ===== SYNC LOCAL STATE WITH PROP =====
  /**
   * useEffect that runs whenever the 'note' prop changes
   * When parent passes a different note (or null), we need to update our input fields
   */
  useEffect(() => {
    if (note) {
      // If editing an existing note, fill the form with its data
      setTitle(note.title);
      setContent(note.content);
    } else {
      // If creating a new note, clear the form
      setTitle("");
      setContent("");
    }
  }, [note]); // Runs whenever 'note' prop changes

  /**
   * handleSave - Called when user clicks Save button
   * Validates that note isn't completely empty, then calls parent's onSave function
   */
  const handleSave = () => {
    // .trim() removes whitespace from start and end
    // Only save if title OR content has actual text (not just spaces)
    if (title.trim() || content.trim()) {
      // Call the parent's save function with current title and content
      // Parent (Notes component) will handle actually saving to localStorage
      onSave(title, content);
    }
  };

  /**
   * handleKeyDown - Keyboard event handler
   * Detects keyboard shortcuts while user is typing
   * @param e - Keyboard event object containing info about which key was pressed
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Check if user pressed Cmd (Mac) or Ctrl (Windows/Linux) + S
    // e.metaKey = Cmd key on Mac
    // e.ctrlKey = Ctrl key on Windows/Linux
    // e.key = the specific key pressed (in this case, "s")
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      // Prevent browser's default "Save Page" behavior
      e.preventDefault();

      // Trigger our save function instead
      handleSave();
    }
  };

  // ===== RENDER =====
  return (
    // Main container - onKeyDown listens for keyboard shortcuts anywhere in the editor
    <div className="note-editor" onKeyDown={handleKeyDown}>
      {/* ===== HEADER: Title input and action buttons ===== */}
      <div className="note-editor-header">
        {/* Title input field */}
        <input
          type="text"                                    // Standard text input
          className="note-editor-title"                  // CSS class for styling
          placeholder="Note title..."                    // Gray text shown when empty
          value={title}                                  // Current value (from state)
          onChange={(e) => setTitle(e.target.value)}    // Update state when user types
          autoFocus                                      // Automatically focus this input when component loads
        />

        {/* Action buttons (Cancel and Save) */}
        <div className="note-editor-actions">
          {/* Conditional rendering: only show Cancel if onCancel function was provided */}
          {/* && is a shortcut for "if onCancel exists, render the button" */}
          {onCancel && (
            <button className="button-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}

          {/* Save button - always shown */}
          <button className="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* ===== CONTENT: Main textarea for note body ===== */}
      <textarea
        className="note-editor-content"               // CSS class for styling
        placeholder="Start writing your note..."      // Gray text shown when empty
        value={content}                               // Current value (from state)
        onChange={(e) => setContent(e.target.value)} // Update state when user types
      />

      {/* ===== FOOTER: Hint about keyboard shortcut ===== */}
      <div className="note-editor-footer">
        <span className="note-editor-hint">
          Press Cmd/Ctrl + S to save
        </span>
      </div>
    </div>
  );
};

// Export component for use in other files
export default NoteEditor;
