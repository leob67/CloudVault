export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getFileIcon(type: string, mimeType: string): string {
  if (type === 'folder') return 'folder';

  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
  const docTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const spreadsheetTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const archiveTypes = ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'];
  const textTypes = ['text/plain', 'text/html', 'text/css', 'text/javascript'];

  if (imageTypes.includes(mimeType)) return 'image';
  if (videoTypes.includes(mimeType)) return 'video';
  if (audioTypes.includes(mimeType)) return 'music';
  if (docTypes.includes(mimeType)) return 'file-text';
  if (spreadsheetTypes.includes(mimeType)) return 'table';
  if (archiveTypes.includes(mimeType)) return 'archive';
  if (textTypes.includes(mimeType)) return 'file';

  return 'file';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}