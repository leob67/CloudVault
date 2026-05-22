import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, FileItem, FolderItem, User, Album, SharedLink } from '../types';

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  files: [],
  folders: [],
  albums: [],
  sharedLinks: [],
  currentFolder: null,
  selectedFiles: [],
  viewMode: 'grid',
  sortBy: 'name',
  sortOrder: 'asc',
  searchQuery: '',
  uploadQueue: [],
  currentView: 'files',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.payload] };
    case 'ADD_FILES':
      return { ...state, files: [...state.files, ...action.payload] };
    case 'DELETE_FILE':
      return {
        ...state,
        files: state.files.map(f =>
          f.id === action.payload ? { ...f, inTrash: true, trashDate: new Date() } : f
        ),
      };
    case 'PERMANENTLY_DELETE_FILE':
      return { ...state, files: state.files.filter(f => f.id !== action.payload) };
    case 'RESTORE_FILE':
      return {
        ...state,
        files: state.files.map(f =>
          f.id === action.payload ? { ...f, inTrash: false, trashDate: undefined } : f
        ),
      };
    case 'RESTORE_ALL_FILES':
      return {
        ...state,
        files: state.files.map(f =>
          f.inTrash ? { ...f, inTrash: false, trashDate: undefined } : f
        ),
      };
    case 'EMPTY_TRASH':
      return { ...state, files: state.files.filter(f => !f.inTrash) };
    case 'RENAME_FILE':
      return {
        ...state,
        files: state.files.map(f =>
          f.id === action.payload.id ? { ...f, name: action.payload.name, modified: new Date() } : f
        ),
      };
    case 'MOVE_FILE':
      return {
        ...state,
        files: state.files.map(f =>
          f.id === action.payload.id ? { ...f, parentId: action.payload.folderId, modified: new Date() } : f
        ),
      };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        files: state.files.map(f =>
          f.id === action.payload ? { ...f, isFavorite: !f.isFavorite } : f
        ),
      };
    case 'TOGGLE_SHARE': {
      const file = state.files.find(f => f.id === action.payload);
      const newShared = !file?.shared;
      const newLink = newShared ? generateShareLink() : undefined;
      return {
        ...state,
        files: state.files.map(f =>
          f.id === action.payload ? { ...f, shared: newShared, sharedLink: newLink } : f
        ),
      };
    }
    case 'SET_CURRENT_FOLDER':
      return { ...state, currentFolder: action.payload };
    case 'ADD_FOLDER':
      return { ...state, folders: [...state.folders, action.payload] };
    case 'DELETE_FOLDER':
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.payload ? { ...f, inTrash: true, trashDate: new Date() } : f
        ),
      };
    case 'PERMANENTLY_DELETE_FOLDER':
      return { ...state, folders: state.folders.filter(f => f.id !== action.payload) };
    case 'RESTORE_FOLDER':
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.payload ? { ...f, inTrash: false, trashDate: undefined } : f
        ),
      };
    case 'RESTORE_ALL_FOLDERS':
      return {
        ...state,
        folders: state.folders.map(f =>
          f.inTrash ? { ...f, inTrash: false, trashDate: undefined } : f
        ),
      };
    case 'EMPTY_TRASH_FOLDERS':
      return { ...state, folders: state.folders.filter(f => !f.inTrash) };
    case 'RENAME_FOLDER':
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.payload.id ? { ...f, name: action.payload.name, modified: new Date() } : f
        ),
      };
    case 'SELECT_FILE':
      return { ...state, selectedFiles: [action.payload] };
    case 'TOGGLE_SELECT_FILE':
      return {
        ...state,
        selectedFiles: state.selectedFiles.includes(action.payload)
          ? state.selectedFiles.filter(id => id !== action.payload)
          : [...state.selectedFiles, action.payload],
      };
    case 'SELECT_ALL': {
      const visibleFiles = getVisibleItems(state).files;
      return { ...state, selectedFiles: visibleFiles.map(f => f.id) };
    }
    case 'CLEAR_SELECTION':
      return { ...state, selectedFiles: [] };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload, currentFolder: null, selectedFiles: [] };
    case 'ADD_UPLOAD':
      return { ...state, uploadQueue: [...state.uploadQueue, action.payload] };
    case 'UPDATE_UPLOAD':
      return {
        ...state,
        uploadQueue: state.uploadQueue.map(u =>
          u.id === action.payload.id ? { ...u, progress: action.payload.progress } : u
        ),
      };
    case 'COMPLETE_UPLOAD':
      return {
        ...state,
        uploadQueue: state.uploadQueue.map(u =>
          u.id === action.payload ? { ...u, status: 'complete' as const } : u
        ),
      };
    case 'ERROR_UPLOAD':
      return {
        ...state,
        uploadQueue: state.uploadQueue.map(u =>
          u.id === action.payload ? { ...u, status: 'error' as const } : u
        ),
      };
    case 'REMOVE_UPLOAD':
      return { ...state, uploadQueue: state.uploadQueue.filter(u => u.id !== action.payload) };
    case 'ADD_ALBUM':
      return { ...state, albums: [...state.albums, action.payload] };
    case 'DELETE_ALBUM':
      return { ...state, albums: state.albums.filter(a => a.id !== action.payload) };
    case 'ADD_TO_ALBUM':
      return {
        ...state,
        albums: state.albums.map(a =>
          a.id === action.payload.albumId
            ? { ...a, fileIds: [...a.fileIds, action.payload.fileId] }
            : a
        ),
      };
    case 'REMOVE_FROM_ALBUM':
      return {
        ...state,
        albums: state.albums.map(a =>
          a.id === action.payload.albumId
            ? { ...a, fileIds: a.fileIds.filter(id => id !== action.payload.fileId) }
            : a
        ),
      };
    case 'ADD_SHARED_LINK':
      return { ...state, sharedLinks: [...state.sharedLinks, action.payload] };
    case 'DELETE_SHARED_LINK':
      return { ...state, sharedLinks: state.sharedLinks.filter(l => l.id !== action.payload) };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function generateShareLink(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${window.location.origin}/share/${result}`;
}

function getVisibleItems(state: AppState) {
  let files = state.files;
  let folders = state.folders;

  switch (state.currentView) {
    case 'shared':
      files = files.filter(f => f.shared && !f.inTrash);
      break;
    case 'trash':
      files = files.filter(f => f.inTrash);
      folders = folders.filter(f => f.inTrash);
      break;
    case 'favorites':
      files = files.filter(f => f.isFavorite && !f.inTrash);
      break;
    case 'albums':
      files = files.filter(f => f.albumId && !f.inTrash);
      break;
    default:
      files = files.filter(f => !f.inTrash);
      folders = folders.filter(f => !f.inTrash);
  }

  return { files, folders };
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (user: User) => void;
  logout: () => void;
  addFile: (file: File) => void;
  addFolder: (name: string) => void;
  deleteFile: (id: string) => void;
  permanentlyDeleteFile: (id: string) => void;
  restoreFile: (id: string) => void;
  restoreAllFiles: () => void;
  emptyTrash: () => void;
  renameFile: (id: string, name: string) => void;
  toggleFavorite: (id: string) => void;
  shareFile: (id: string) => void;
  downloadFile: (file: FileItem) => void;
  getFilteredFiles: () => FileItem[];
  getFilteredFolders: () => FolderItem[];
  getTotalSize: () => number;
  getFileCount: () => number;
  getTrashCount: () => number;
  createAlbum: (name: string) => void;
  deleteAlbum: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('cloudvault-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: {
          files: parsed.files?.map((f: any) => ({
            ...f,
            modified: new Date(f.modified),
            trashDate: f.trashDate ? new Date(f.trashDate) : undefined,
          })) || [],
          folders: parsed.folders?.map((f: any) => ({
            ...f,
            created: new Date(f.created),
            modified: new Date(f.modified),
            trashDate: f.trashDate ? new Date(f.trashDate) : undefined,
          })) || [],
          albums: parsed.albums?.map((a: any) => ({
            ...a,
            created: new Date(a.created),
          })) || [],
          sharedLinks: parsed.sharedLinks?.map((l: any) => ({
            ...l,
            created: new Date(l.created),
          })) || [],
          user: parsed.user,
          isAuthenticated: parsed.isAuthenticated || false,
        }});
      } catch (e) {
        console.error('Failed to load state:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cloudvault-state', JSON.stringify({
      files: state.files,
      folders: state.folders,
      albums: state.albums,
      sharedLinks: state.sharedLinks,
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }));
  }, [state.files, state.folders, state.albums, state.sharedLinks, state.user, state.isAuthenticated]);

  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
  };

  const addFile = (file: File) => {
    const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const reader = new FileReader();

    reader.onload = () => {
      const fileItem: FileItem = {
        id,
        name: file.name,
        size: file.size,
        type: file.type.split('/')[0],
        mimeType: file.type,
        modified: new Date(),
        parentId: state.currentFolder,
        shared: false,
        isFolder: false,
        data: reader.result as string,
        isFavorite: false,
        inTrash: false,
      };
      dispatch({ type: 'ADD_FILE', payload: fileItem });
    };

    reader.readAsDataURL(file);
  };

  const addFolder = (name: string) => {
    const folder: FolderItem = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      parentId: state.currentFolder,
      created: new Date(),
      modified: new Date(),
      isFavorite: false,
      inTrash: false,
    };
    dispatch({ type: 'ADD_FOLDER', payload: folder });
  };

  const deleteFile = (id: string) => {
    dispatch({ type: 'DELETE_FILE', payload: id });
  };

  const permanentlyDeleteFile = (id: string) => {
    dispatch({ type: 'PERMANENTLY_DELETE_FILE', payload: id });
  };

  const restoreFile = (id: string) => {
    dispatch({ type: 'RESTORE_FILE', payload: id });
  };

  const restoreAllFiles = () => {
    dispatch({ type: 'RESTORE_ALL_FILES' });
    dispatch({ type: 'RESTORE_ALL_FOLDERS' });
  };

  const emptyTrash = () => {
    dispatch({ type: 'EMPTY_TRASH' });
    dispatch({ type: 'EMPTY_TRASH_FOLDERS' });
  };

  const renameFile = (id: string, name: string) => {
    dispatch({ type: 'RENAME_FILE', payload: { id, name } });
  };

  const toggleFavorite = (id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  };

  const shareFile = (id: string) => {
    dispatch({ type: 'TOGGLE_SHARE', payload: id });
  };

  const downloadFile = (file: FileItem) => {
    if (file.data) {
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      link.click();
    }
  };

  const getFilteredFiles = (): FileItem[] => {
    const { files } = getVisibleItems(state);

    if (state.currentFolder !== null) {
      const filtered = files.filter(f => f.parentId === state.currentFolder);
      return sortItems(filtered, state.sortBy, state.sortOrder);
    }

    const filtered = files.filter(f => f.parentId === null);
    return sortItems(filtered, state.sortBy, state.sortOrder);
  };

  const getFilteredFolders = (): FolderItem[] => {
    const { folders } = getVisibleItems(state);

    if (state.currentFolder !== null) {
      return folders.filter(f => f.parentId === state.currentFolder);
    }

    return folders.filter(f => f.parentId === null);
  };

  const sortItems = (items: FileItem[], sortBy: string, order: string): FileItem[] => {
    return [...items].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'date':
          cmp = new Date(b.modified).getTime() - new Date(a.modified).getTime();
          break;
        case 'size':
          cmp = b.size - a.size;
          break;
      }
      return order === 'asc' ? cmp : -cmp;
    });
  };

  const getTotalSize = (): number => {
    return state.files.filter(f => !f.inTrash).reduce((acc, f) => acc + f.size, 0);
  };

  const getFileCount = (): number => {
    return state.files.filter(f => !f.isFolder && !f.inTrash).length;
  };

  const getTrashCount = (): number => {
    return state.files.filter(f => f.inTrash).length + state.folders.filter(f => f.inTrash).length;
  };

  const createAlbum = (name: string) => {
    const album: Album = {
      id: `album-${Date.now()}`,
      name,
      created: new Date(),
      fileIds: [],
    };
    dispatch({ type: 'ADD_ALBUM', payload: album });
  };

  const deleteAlbum = (id: string) => {
    dispatch({ type: 'DELETE_ALBUM', payload: id });
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      login,
      logout,
      addFile,
      addFolder,
      deleteFile,
      permanentlyDeleteFile,
      restoreFile,
      restoreAllFiles,
      emptyTrash,
      renameFile,
      toggleFavorite,
      shareFile,
      downloadFile,
      getFilteredFiles,
      getFilteredFolders,
      getTotalSize,
      getFileCount,
      getTrashCount,
      createAlbum,
      deleteAlbum,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}