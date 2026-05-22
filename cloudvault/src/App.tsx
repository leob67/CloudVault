import { useState, useEffect, useCallback } from 'react';
import { AppProvider, useApp } from './context/FileContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FileGrid from './components/FileGrid';
import UploadZone from './components/UploadZone';
import NewFolderModal from './components/NewFolderModal';
import ShareModal from './components/ShareModal';
import Settings from './components/Settings';
import { FileItem, User } from './types';

function CloudVault() {
  const { state, dispatch, getFilteredFiles, getFilteredFolders, login } = useApp();
  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const files = getFilteredFiles();
  const folders = getFilteredFolders();

  const handleLogin = (user: User) => {
    login(user);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.relatedTarget === null || !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUpload(false);
        setShowNewFolder(false);
        setShowSettings(false);
        setShareFile(null);
        dispatch({ type: 'CLEAR_SELECTION' });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        dispatch({ type: 'SELECT_ALL' });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        setShowUpload(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Show login screen if not authenticated
  if (!state.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div
      className="h-screen flex bg-gray-100"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Sidebar onSettingsClick={() => setShowSettings(true)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onUploadClick={() => setShowUpload(true)}
          onNewFolderClick={() => setShowNewFolder(true)}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Drop Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-red-600 bg-opacity-10 border-4 border-dashed border-red-500 z-40 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-2">Drop files to upload</p>
                <p className="text-sm text-gray-500">Unlimited storage • No size limit</p>
              </div>
            </div>
          )}

          <FileGrid files={files} folders={folders} />

          {/* FAB Upload Button */}
          <button
            onClick={() => setShowUpload(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-30"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </main>
      </div>

      {showUpload && <UploadZone onClose={() => setShowUpload(false)} />}
      {showNewFolder && <NewFolderModal onClose={() => setShowNewFolder(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {shareFile && <ShareModal file={shareFile} onClose={() => setShareFile(null)} />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <CloudVault />
    </AppProvider>
  );
}

export default App;