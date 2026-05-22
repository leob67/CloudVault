import { useState } from 'react';
import { Search, Grid, List, SortAsc, SortDesc, Upload, FolderPlus, RefreshCw } from 'lucide-react';
import { useApp } from '../context/FileContext';

interface HeaderProps {
  onUploadClick: () => void;
  onNewFolderClick: () => void;
}

export default function Header({ onUploadClick, onNewFolderClick }: HeaderProps) {
  const { state, dispatch } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 min-w-0">
        <h2 className="text-base font-semibold text-gray-900">
          {state.currentView === 'files' && 'My Files'}
          {state.currentView === 'shared' && 'Shared with Me'}
          {state.currentView === 'trash' && 'Rubbish Bin'}
        </h2>
      </div>

      {/* Search */}
      <div className={`flex-1 max-w-md transition-all ${searchFocused ? 'shadow-md' : ''}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Sort */}
        <button
          onClick={() => dispatch({ type: 'SET_SORT_ORDER', payload: state.sortOrder === 'asc' ? 'desc' : 'asc' })}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Sort"
        >
          {state.sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
        </button>

        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })}
            className={`p-1.5 rounded ${state.viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            <Grid className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' })}
            className={`p-1.5 rounded ${state.viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            <List className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Refresh */}
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" title="Refresh">
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* New Folder */}
        <button
          onClick={onNewFolderClick}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          New Folder
        </button>

        {/* Upload */}
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>
    </div>
  );
}