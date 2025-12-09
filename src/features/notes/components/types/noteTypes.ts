// Folder structure
export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

// Note object structure
export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null; // null = unfiled/root level
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

// State structure for notes management
export interface NotesState {
  folders: Folder[];
  notes: Note[];
  selectedFolderId: string | null;
  selectedNoteId: string | null;
  searchQuery: string;
}
