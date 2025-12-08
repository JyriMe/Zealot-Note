/**
 * Note Interface
 * Defines the shape/structure of a Note object
 * This is a TypeScript "interface" - it describes what properties a Note must have
 *
 * Think of it like a blueprint or contract that every Note object must follow
 */
export interface Note {
  id: string;           // Unique identifier (UUID) - never changes for a note
  title: string;        // Note title (can be empty string)
  content: string;      // Note body text (can be empty string)
  createdAt: number;    // Timestamp (milliseconds) when note was created
  updatedAt: number;    // Timestamp (milliseconds) when note was last modified
  tags?: string[];      // Optional array of tag strings (? means optional - may not exist)
}

/**
 * NotesState Interface
 * Defines the overall state shape for notes management
 * Currently not used in the app, but available for future Redux/state management
 */
export interface NotesState {
  notes: Note[];              // Array of all Note objects
  selectedNoteId: string | null;  // ID of currently selected note (null if none)
  searchQuery: string;        // Search text for filtering notes (future feature)
}
