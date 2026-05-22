import { useState } from 'react';
import { X, User, HardDrive, Trash2, RotateCcw, AlertTriangle, LogOut } from 'lucide-react';
import { useApp } from '../context/FileContext';
import { formatFileSize, formatDate } from '../utils/helpers';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { state, logout, restoreFile, permanentlyDeleteFile, restoreAllFiles, emptyTrash, getTrashCount, getFileCount, getTotalSize } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'storage' | 'trash'>('profile');
  const [showConfirmEmpty, setShowConfirmEmpty] = useState(false);

  const trashFiles = state.files.filter(f => f.inTrash);
  const trashFolders = state.folders.filter(f => f.inTrash);

  const handleEmptyTrash = () => {
    emptyTrash();
    setShowConfirmEmpty(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === 'profile' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-4 h-4" /> Profile
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === 'storage' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <HardDrive className="w-4 h-4" /> Storage
          </button>
          <button
            onClick={() => setActiveTab('trash')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === 'trash' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trash2 className="w-4 h-4" /> Trash ({getTrashCount()})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* User Info */}
              {state.user && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  {state.user.picture ? (
                    <img src={state.user.picture} alt={state.user.name} className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-red-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{state.user.name}</h3>
                    <p className="text-sm text-gray-500">{state.user.email}</p>
                  </div>
                </div>
              )}

              {/* Account Actions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Account Actions</h4>
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-6">
              {/* Storage Overview */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">CloudVault Storage</span>
                  <span className="text-lg font-bold text-green-600">UNLIMITED</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div className="h-full w-1/4 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatFileSize(getTotalSize())} used</span>
                  <span>∞ total</span>
                </div>
              </div>

              {/* Storage Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-gray-900">{getFileCount()}</div>
                  <div className="text-sm text-gray-500">Files</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-gray-900">{state.folders.filter(f => !f.inTrash).length}</div>
                  <div className="text-sm text-gray-500">Folders</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trash' && (
            <div className="space-y-6">
              {/* Trash Info */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">Rubbish Bin</span>
                </div>
                <p className="text-sm text-gray-500">
                  {getTrashCount()} items in trash • Files in trash are automatically deleted after 30 days
                </p>
              </div>

              {/* Trash Actions */}
              <div className="flex gap-3">
                <button
                  onClick={restoreAllFiles}
                  disabled={getTrashCount() === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore All
                </button>
                <button
                  onClick={() => setShowConfirmEmpty(true)}
                  disabled={getTrashCount() === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Empty Trash
                </button>
              </div>

              {/* Trash Items */}
              {trashFiles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Files ({trashFiles.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {trashFiles.map(file => (
                      <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • Deleted {file.trashDate ? formatDate(file.trashDate) : 'unknown'}
                          </p>
                        </div>
                        <button
                          onClick={() => restoreFile(file.id)}
                          className="p-2 bg-green-100 hover:bg-green-200 rounded-lg"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => permanentlyDeleteFile(file.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trashFolders.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Folders ({trashFolders.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {trashFolders.map(folder => (
                      <div key={folder.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
                          <p className="text-xs text-gray-500">
                            Folder • Deleted {folder.trashDate ? formatDate(folder.trashDate) : 'unknown'}
                          </p>
                        </div>
                        <button
                          onClick={() => restoreAllFiles()}
                          className="p-2 bg-green-100 hover:bg-green-200 rounded-lg"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {getTrashCount() === 0 && (
                <div className="text-center py-8">
                  <Trash2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Trash is empty</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Confirm Empty Trash Dialog */}
      {showConfirmEmpty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Empty Trash?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmEmpty(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEmptyTrash}
                className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Empty Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}