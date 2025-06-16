// src/app/components/common/utils.ts
export const getImageHeightClass = (aspectRatio: string): string => {
  const heightMap: Record<string, string> = {
    '1:1': 'h-64',
    '4:3': 'h-48',
    '4:5': 'h-80',
    '2:3': 'h-96',
    '8:7': 'h-56',
    '8:9': 'h-72'
  };
  return heightMap[aspectRatio] || 'h-64';
};

export const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

export const THEME_COLORS = {
  primary: 'indigo-600',
  primaryHover: 'indigo-700',
  secondary: 'yellow-400',
  secondaryHover: 'yellow-300',
  accent: 'purple-500',
  background: 'gray-50',
  white: 'white'
} as const;