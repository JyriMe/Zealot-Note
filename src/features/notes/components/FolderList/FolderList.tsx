import { useState } from "react";
import type { Folder } from "../types/noteTypes";
import "./FolderList.css";

interface FolderListProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  noteCounts: Record<string, number>;
}

const FolderList = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  noteCounts,
}: FolderListProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Create new folder
  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreating(false);
    }
  };

  // Start renaming folder
  const startRename = (folder: Folder) => {
    setEditingId(folder.id);
    setEditName(folder.name);
  };

  // Save renamed folder
  const handleRename = () => {
    if (editingId && editName.trim()) {
      onRenameFolder(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
    }
  };

  // Get total notes count
  const allNotesCount = Object.values(noteCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="folder-list">
      <div className="folder-list-header">
        <span className="folder-list-title">Folders</span>
        <button
          className="folder-add-btn"
          onClick={() => setIsCreating(true)}
          title="New Folder"
          aria-label="Create new folder"
        >
          +
        </button>
      </div>

      {/* New folder input */}
      {isCreating && (
        <div className="folder-create">
          <input
            type="text"
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setIsCreating(false);
            }}
            autoFocus
            aria-label="New folder name"
          />
          <button onClick={handleCreate} aria-label="Confirm create folder">✓</button>
          <button onClick={() => setIsCreating(false)} aria-label="Cancel create folder">✕</button>
        </div>
      )}

      {/* All Notes option */}
      <div
        className={`folder-item ${selectedFolderId === null ? "selected" : ""}`}
        onClick={() => onSelectFolder(null)}
        role="button"
        tabIndex={0}
        aria-label={`All Notes, ${allNotesCount} notes`}
        aria-selected={selectedFolderId === null}
        onKeyDown={(e) => e.key === "Enter" && onSelectFolder(null)}
      >
        <span className="folder-icon">📁</span>
        <span className="folder-name">All Notes</span>
        <span className="folder-count">{allNotesCount}</span>
      </div>

      {/* Folder list */}
      {folders.map((folder) => (
        <div
          key={folder.id}
          className={`folder-item ${selectedFolderId === folder.id ? "selected" : ""}`}
          onClick={() => onSelectFolder(folder.id)}
          role="button"
          tabIndex={0}
          aria-label={`${folder.name}, ${noteCounts[folder.id] || 0} notes`}
          aria-selected={selectedFolderId === folder.id}
          onKeyDown={(e) => e.key === "Enter" && onSelectFolder(folder.id)}
        >
          <span className="folder-icon">📂</span>

          {editingId === folder.id ? (
            <input
              type="text"
              className="folder-rename-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setEditingId(null);
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              aria-label="Rename folder"
            />
          ) : (
            <span className="folder-name">{folder.name}</span>
          )}

          <span className="folder-count">{noteCounts[folder.id] || 0}</span>

          <div className="folder-actions">
            <button
              className="folder-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                startRename(folder);
              }}
              title="Rename"
              aria-label={`Rename folder ${folder.name}`}
            >
              ✎
            </button>
            <button
              className="folder-action-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete folder "${folder.name}"? Notes will be moved to All Notes.`)) {
                  onDeleteFolder(folder.id);
                }
              }}
              title="Delete"
              aria-label={`Delete folder ${folder.name}`}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FolderList;
