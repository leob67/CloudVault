import { Folder, Share2, Trash2, HardDrive, Star, Image, Users, Link2, Settings, User } from 'lucide-react';
import { useApp } from '../context/FileContext';

interface SidebarProps {
  onSettingsClick: () => void;
}

export default function Sidebar({ onSettingsClick }: SidebarProps) {
  const { state, dispatch, getTotalSize, getFileCount, getTrashCount } = useApp();

  const navItems = [
    { id: 'files', icon: Folder, label: 'My Files', badge: null },
    { id: 'shared', icon: Share2, label: 'Shared with Me', badge: null },
    { id: 'favorites', icon: Star, label: 'Favorites', badge: null },
    { id: 'albums', icon: Image, label: 'Albums', badge: null },
    { id: 'partners', icon: Users, label: 'Partners', badge: null },
    { id: 'links', icon: Link2, label: 'Shared Links', badge: null },
    { id: 'trash', icon: Trash2, label: 'Rubbish Bin', badge: getTrashCount() },
  ];

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <HardDrive className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">CloudVault</h1>
            <p className="text-xs text-green-600 font-medium">Unlimited Storage</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Navigation</p>
          <ul className="space-y-1">
            {navItems.slice(0, 1).map(item => (
              <li key={item.id}>
                <button
                  onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: item.id as any })}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    state.currentView === item.id
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Share</p>
          <ul className="space-y-1">
            {navItems.slice(1, 6).map(item => (
              <li key={item.id}>
                <button
                  onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: item.id as any })}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    state.currentView === item.id
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Account</p>
          <ul className="space-y-1">
            {navItems.slice(6).map(item => (
              <li key={item.id}>
                <button
                  onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: item.id as any })}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    state.currentView === item.id
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Storage Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Storage</span>
            <span className="text-xs text-green-600 font-bold">UNLIMITED</span>
          </div>

          {/* Storage Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div className="h-full w-1/4 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatSize(getTotalSize())} used</span>
            <span>∞ total</span>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
            {state.user?.picture ? (
              <img src={state.user.picture} alt={state.user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-red-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{state.user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{getFileCount()} files</p>
            </div>
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}