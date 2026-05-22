import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/FileContext';

interface UploadZoneProps {
  onClose: () => void;
}

export default function UploadZone({ onClose }: UploadZoneProps) {
  const { state, addFile } = useApp();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => addFile(file));
  }, [addFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => addFile(file));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className={`w-8 h-8 ${isDragging ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <p className="text-base font-medium text-gray-900 mb-1">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Unlimited storage • No file size limit
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              Select Files
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Upload Queue */}
          {state.uploadQueue.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Uploading ({state.uploadQueue.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {state.uploadQueue.map(upload => (
                  <div key={upload.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      upload.status === 'complete' ? 'bg-green-100' :
                      upload.status === 'error' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {upload.status === 'complete' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : upload.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Upload className="w-4 h-4 text-blue-600 animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{upload.name}</p>
                      <p className="text-xs text-gray-500">{formatSize(upload.size)}</p>
                      {upload.status === 'uploading' && (
                        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 transition-all"
                            style={{ width: `${upload.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}