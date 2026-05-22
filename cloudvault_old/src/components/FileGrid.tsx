import { useState } from 'react';
import { MoreVertical, Share2, Download, Trash2, Edit2, Eye, Folder, Star, RotateCcw } from 'lucide-react';
import { FileItem, FolderItem } from '../types';
import { formatFileSize, formatDate } from '../utils/helpers';
import { useApp } from '../context/FileContext';

interface FileGridProps {
  files: FileItem[];
  folders: FolderItem[];
}

export default function FileGrid({ files, folders }: FileGridProps) {
  const { state, dispatch, downloadFile, deleteFile, shareFile, renameFile, toggleFavorite, restoreFile, permanentlyDeleteFile } = useApp();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const isTrashView = state.currentView === 'trash';
  const isFavoritesView = state.currentView === 'favorites';

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleRename = (file: FileItem) => {
    setRenamingId(file.id);
    setNewName(file.name);
    closeContextMenu();
  };

  const submitRename = () => {
    if (renamingId && newName.trim()) {
      renameFile(renamingId, newName.trim());
    }
    setRenamingId(null);
    setNewName('');
  };

  const handleShare = (file: FileItem) => {
    shareFile(file.id);
    closeContextMenu();
  };

  const handleDownload = (file: FileItem) => {
    downloadFile(file);
    closeContextMenu();
  };

  const handleDelete = (file: FileItem) => {
    deleteFile(file.id);
    closeContextMenu();
  };

  const handleRestore = (file: FileItem) => {
    restoreFile(file.id);
    closeContextMenu();
  };

  const handlePermanentDelete = (file: FileItem) => {
    permanentlyDeleteFile(file.id);
    closeContextMenu();
  };

  const handleToggleFavorite = (file: FileItem) => {
    toggleFavorite(file.id);
    closeContextMenu();
  };

  const getFileIcon = (mimeType: string) => {
    const type = mimeType.split('/')[0];
    if (type === 'image') return '🖼️';
    if (type === 'video') return '🎬';
    if (type === 'audio') return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    return '📄';
  };

  const getViewTitle = () => {
    switch (state.currentView) {
      case 'files': return 'My Files';
      case 'shared': return 'Shared with Me';
      case 'favorites': return 'Favorites';
      case 'albums': return 'Albums';
      case 'partners': return 'Partners';
      case 'links': return 'Shared Links';
      case 'trash': return 'Rubbish Bin';
      default: return 'Files';
    }
  };

  if (files.length === 0 && folders.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Folder className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {isTrashView ? 'Trash is empty' : 'No files here'}
          </h3>
          <p className="text-sm text-gray-500">
            {isTrashView ? 'Deleted files will appear here' : 'Drop files here or click Upload to add files'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6" onClick={closeContextMenu}>
      {/* Folders */}
      {folders.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Folders</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => dispatch({ type: 'SET_CURRENT_FOLDER', payload: folder.id })}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-yellow-200 transition-colors">
                  <Folder className="w-10 h-10 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center truncate w-full">{folder.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">{getViewTitle()}</h3>
          {state.viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {files.map(file => (
                <div
                  key={file.id}
                  className={`relative group rounded-lg border-2 transition-all cursor-pointer ${
                    state.selectedFiles.includes(file.id)
                      ? 'border-red-500 bg-red-50'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      dispatch({ type: 'TOGGLE_SELECT_FILE', payload: file.id });
                    } else {
                      dispatch({ type: 'SELECT_FILE', payload: file.id });
                    }
                  }}
                  onContextMenu={(e) => handleContextMenu(e, file.id)}
                  onDoubleClick={() => !isTrashView && downloadFile(file)}
                >
                  <div className="p-4">
                    <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                      {file.mimeType.startsWith('image/') && file.data ? (
                        <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">{getFileIcon(file.mimeType)}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate mb-1" title={file.name}>
                      {renamingId === file.id ? (
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onBlur={submitRename}
                          onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                          className="w-full px-1 py-0.5 border border-red-500 rounded text-sm"
                          autoFocus
                        />
                      ) : (
                        file.name
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isTrashView && file.trashDate ? `${formatDate(file.trashDate)} • ` : ''}
                      {formatFileSize(file.size)}
                    </p>
                    {file.shared && (
                      <div className="absolute top-2 right-2">
                        <Share2 className="w-4 h-4 text-red-600" />
                      </div>
                    )}
                    {file.isFavorite && (
                      <div className="absolute top-2 left-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContextMenu(e, file.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Size</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Modified</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr
                      key={file.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        state.selectedFiles.includes(file.id) ? 'bg-red-50' : ''
                      }`}
                      onClick={(e) => {
                        if (e.ctrlKey || e.metaKey) {
                          dispatch({ type: 'TOGGLE_SELECT_FILE', payload: file.id });
                        } else {
                          dispatch({ type: 'SELECT_FILE', payload: file.id });
                        }
                      }}
                      onContextMenu={(e) => handleContextMenu(e, file.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
                          {renamingId === file.id ? (
                            <input
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              onBlur={submitRename}
                              onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                              className="px-1 py-0.5 border border-red-500 rounded text-sm"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium text-gray-900">{file.name}</span>
                          )}
                          {file.shared && <Share2 className="w-4 h-4 text-red-600" />}
                          {file.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatFileSize(file.size)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(file.modified)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {isTrashView ? (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRestore(file); }}
                                className="p-1.5 rounded hover:bg-green-100" title="Restore"
                              >
                                <RotateCcw className="w-4 h-4 text-green-600" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handlePermanentDelete(file); }}
                                className="p-1.5 rounded hover:bg-red-100" title="Delete Permanently"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                                className="p-1.5 rounded hover:bg-gray-200" title="Download"
                              >
                                <Download className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggleFavorite(file); }}
                                className="p-1.5 rounded hover:bg-gray-200" title={file.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                              >
                                <Star className={`w-4 h-4 ${file.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleShare(file); }}
                                className="p-1.5 rounded hover:bg-gray-200" title="Share"
                              >
                                <Share2 className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRename(file); }}
                                className="p-1.5 rounded hover:bg-gray-200" title="Rename"
                              >
                                <Edit2 className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                                className="p-1.5 rounded hover:bg-gray-200" title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-gray-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-48"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {isTrashView ? (
            <>
              <button
                onClick={() => {
                  const file = files.find(f => f.id === contextMenu.fileId);
                  if (file) handleRestore(file);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-green-600"
              >
                <RotateCcw className="w-4 h-4" /> Restore
              </button>
              <button
                onClick={() => {
                  const file = files.find(f => f.id === contextMenu.fileId);
                  if (file) handlePermanentDelete(file);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" /> Delete Permanently
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  const file = files.find(f => f.id === contextMenu.fileId);
                  if (file) downloadFile(file);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button
                onClick={() => {
                  const file = files.find(f => f.id === contextMenu.fileId);
                  if (file) downloadFile(file);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button
                onClick={() => {
                  const file = files.find(f => f.id === contextMenu.fileId);
                  if (file) handleToggleFavorite(file);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Star className={`w-4 h-4 ${files.find(f => f.id === contextMenu.fileId)?.isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                {files.find(f => f.id === contextMenu.fileId)?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              <button
                onClick={() => {
                  const file = files.find(f => f.id === contextMenu.fileId);
                  if (file) shareFile(file.id);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  const file = files.find(f => f.id === contextMenu.fileId);
                  if (file) handleRename(file);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Rename
              </button>
              <button
                onClick={() => {
                  const file = files.find(f => f.id === contextMenu.fileId);
                  if (file) handleDelete(file);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}