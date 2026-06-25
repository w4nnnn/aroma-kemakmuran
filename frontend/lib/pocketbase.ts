import PocketBase from 'pocketbase';

// Determine URL based on environment (Server vs Client)
const pbUrl = typeof window === 'undefined' 
  ? process.env.INTERNAL_PB_URL || 'http://127.0.0.1:8090'
  : process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pbUrl);

// Helper to construct image URL
export function getPbImageUrl(collectionId: string, recordId: string, fileName: string) {
  if (!fileName) return "/placeholder.jpg"; // Fallback
  return `${process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090'}/api/files/${collectionId}/${recordId}/${fileName}`;
}
