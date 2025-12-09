import type { Note, Folder } from "../features/notes/components/types/noteTypes";

// Format timestamp to readable date
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength = 60): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Validate Note object structure (internal helper)
const isValidNote = (obj: unknown): obj is Note => {
  if (typeof obj !== "object" || obj === null) return false;
  const note = obj as Record<string, unknown>;
  return (
    typeof note.id === "string" &&
    typeof note.title === "string" &&
    typeof note.content === "string" &&
    typeof note.createdAt === "number" &&
    typeof note.updatedAt === "number"
  );
};

// Validate Folder object structure (internal helper)
const isValidFolder = (obj: unknown): obj is Folder => {
  if (typeof obj !== "object" || obj === null) return false;
  const folder = obj as Record<string, unknown>;
  return (
    typeof folder.id === "string" &&
    typeof folder.name === "string" &&
    typeof folder.createdAt === "number"
  );
};

// Validate and parse notes from localStorage
export const parseNotesFromStorage = (data: string): Note[] => {
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidNote).map((note) => ({
      ...note,
      folderId: note.folderId ?? null, // Migration for old notes
    }));
  } catch {
    return [];
  }
};

// Validate and parse folders from localStorage
export const parseFoldersFromStorage = (data: string): Folder[] => {
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidFolder);
  } catch {
    return [];
  }
};
