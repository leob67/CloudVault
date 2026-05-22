export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  modified: Date;
  parentId: string | null;
  shared: boolean;
  sharedLink?: string;
  data?: string;
  isFolder: boolean;
  isFavorite: boolean;
  inTrash: boolean;
  trashDate?: Date;
  albumId?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  created: Date;
  modified: Date;
  isFavorite: boolean;
  inTrash: boolean;
  trashDate?: Date;
}

export interface Album {
  id: string;
  name: string;
  coverImage?: string;
  created: Date;
  fileIds: string[];
}

export interface SharedLink {
  id: string;
  fileId: string;
  link: string;
  created: Date;
}

export interface UploadProgress {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  size: number;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  files: FileItem[];
  folders: FolderItem[];
  albums: Album[];
  sharedLinks: SharedLink[];
  currentFolder: string | null;
  selectedFiles: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  uploadQueue: UploadProgress[];
  currentView: 'files' | 'shared' | 'trash' | 'favorites' | 'albums' | 'partners' | 'links';
}

export type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'ADD_FILE'; payload: FileItem }
  | { type: 'ADD_FILES'; payload: FileItem[] }
  | { type: 'DELETE_FILE'; payload: string }
  | { type: 'PERMANENTLY_DELETE_FILE'; payload: string }
  | { type: 'RESTORE_FILE'; payload: string }
  | { type: 'RESTORE_ALL_FILES' }
  | { type: 'EMPTY_TRASH' }
  | { type: 'RENAME_FILE'; payload: { id: string; name: string } }
  | { type: 'MOVE_FILE'; payload: { id: string; folderId: string | null } }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'TOGGLE_SHARE'; payload: string }
  | { type: 'SET_CURRENT_FOLDER'; payload: string | null }
  | { type: 'ADD_FOLDER'; payload: FolderItem }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'PERMANENTLY_DELETE_FOLDER'; payload: string }
  | { type: 'RESTORE_FOLDER'; payload: string }
  | { type: 'RESTORE_ALL_FOLDERS' }
  | { type: 'EMPTY_TRASH_FOLDERS' }
  | { type: 'RENAME_FOLDER'; payload: { id: string; name: string } }
  | { type: 'SELECT_FILE'; payload: string }
  | { type: 'TOGGLE_SELECT_FILE'; payload: string }
  | { type: 'SELECT_ALL' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
  | { type: 'SET_SORT_BY'; payload: 'name' | 'date' | 'size' }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CURRENT_VIEW'; payload: AppState['currentView'] }
  | { type: 'ADD_UPLOAD'; payload: UploadProgress }
  | { type: 'UPDATE_UPLOAD'; payload: { id: string; progress: number } }
  | { type: 'COMPLETE_UPLOAD'; payload: string }
  | { type: 'ERROR_UPLOAD'; payload: string }
  | { type: 'REMOVE_UPLOAD'; payload: string }
  | { type: 'ADD_ALBUM'; payload: Album }
  | { type: 'DELETE_ALBUM'; payload: string }
  | { type: 'ADD_TO_ALBUM'; payload: { albumId: string; fileId: string } }
  | { type: 'REMOVE_FROM_ALBUM'; payload: { albumId: string; fileId: string } }
  | { type: 'ADD_SHARED_LINK'; payload: SharedLink }
  | { type: 'DELETE_SHARED_LINK'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };