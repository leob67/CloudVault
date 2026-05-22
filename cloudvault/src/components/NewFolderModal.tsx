import { useState } from 'react';
import { X, Folder } from 'lucide-react';
import { useApp } from '../context/FileContext';

interface NewFolderModalProps {
  onClose: () => void;
}

export default function NewFolderModal({ onClose }: NewFolderModalProps) {
  const { addFolder } = useApp();
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      addFolder(folderName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">New Folder</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                autoFocus
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}