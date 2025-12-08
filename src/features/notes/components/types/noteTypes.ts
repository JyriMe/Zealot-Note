export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
}
