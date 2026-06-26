import PocketBase from 'pocketbase';

// Client-side singleton (defaults to relative URL now)
const pbUrl = typeof window === 'undefined' 
  ? process.env.INTERNAL_PB_URL || 'http://127.0.0.1:8090' // Only used in server components that don't need auth, or via proxy
  : '/api/pb'; // Client side points to proxy

export const pb = new PocketBase(pbUrl);

// Helper to construct image URL via proxy
export function getPbImageUrl(collectionId: string, recordId: string, fileName: string) {
  if (!fileName) return "/placeholder.jpg";
  return `/api/files/${collectionId}/${recordId}/${fileName}`;
}
