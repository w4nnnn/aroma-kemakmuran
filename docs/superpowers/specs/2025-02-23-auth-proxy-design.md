# Architecture Design: Server-Side Auth & PocketBase Internalization

## Purpose
This document outlines the architecture for securing the admin dashboard using Server-Side Authentication (SSR/Middleware) and entirely internalizing the PocketBase instance so it is no longer exposed to the public internet in production. All client-to-database communication will be proxied securely through Next.js.

## Current State & Issues
1. **Authentication Leakage**: The admin layout currently relies on client-side (`useEffect`) checks. Users can temporarily see admin UI layouts before being redirected, and turning off JS bypasses the initial redirect logic.
2. **Exposed Database Port**: `docker-compose.yml` exposes PocketBase port 8090 to the host.
3. **Client-side Direct Access**: Client components (like `RichTextEditor`, `ProductFormPage`, and `ProductGallery`) directly talk to PocketBase via `NEXT_PUBLIC_PB_URL` (fetching and uploading files), which will break if the port is closed.

## Proposed Architecture

### 1. Strong Server-Side Auth (Cookies & Middleware)
We will transition from a purely local `AuthStore` to an HTTP Cookie-backed `AuthStore`.
- **Login Action**: When an admin logs in, we set an HTTP-only secure cookie containing the PocketBase token and admin model.
- **Middleware (`middleware.ts`)**: Next.js Middleware will intercept requests to `/admin/*`. It will read the auth cookie, decode/validate the PocketBase token, and reject/redirect unauthorized users *before* any page rendering occurs.
- **Admin Context Sync**: The client-side `AdminProvider` will be updated to initialize its state from the server-injected cookies rather than waiting for client-side evaluation.

### 2. Internalizing PocketBase (Docker changes)
- Remove the `ports: - "8090:8090"` mapping from `docker-compose.yml`.
- PocketBase will now strictly run on `http://pocketbase:8090` within the isolated Docker internal network.
- `INTERNAL_PB_URL` will be used by the Next.js server to talk to PocketBase.

### 3. Next.js Reverse Proxy for API & Media
To allow client-side features (like the Admin Form submit, Image Uploads, and Public Product Gallery) to function without direct access to PocketBase, we will build Next.js API Route Handlers.
- **Data/Upload Proxy (`app/api/pb/[...path]/route.ts`)**: 
  - Catches requests like `POST /api/pb/collections/products/records`.
  - Attaches the auth token (from Next.js cookies).
  - Forwards the payload (including `FormData` for files) to `http://pocketbase:8090/api/...`.
  - Returns the response to the client.
- **Media Proxy (`app/api/files/[collectionId]/[recordId]/[filename]/route.ts`)**:
  - Catches requests for images and videos.
  - Fetches the binary stream from `http://pocketbase:8090/api/files/...`.
  - Pipes the stream back to the browser with appropriate `Content-Type` and caching headers.
- **Helper Updates**: Update `getPbImageUrl` in `lib/pocketbase.ts` to output relative `/api/files/...` paths instead of absolute `127.0.0.1:8090` paths.

## Implementation Steps
1. Create API Route for Next.js to proxy PocketBase requests (Data & Files).
2. Modify `lib/pocketbase.ts` to support Server/Client Cookie synchronization.
3. Implement `middleware.ts` to secure the `/admin` routes.
4. Refactor `admin-context.tsx` and Login page to utilize the new cookie-based auth flow.
5. Update client components (`ProductFormPage`, `ProductGallery`, `HeroSection`) to ensure they point to the relative proxy endpoints.
6. Remove the public port mapping in `docker-compose.yml`.

## Trade-offs & Considerations
- **Pros**: Ultimate security (no exposed DB port), true SSR protection preventing unauthorized UI flashes.
- **Cons**: All media streams pass through the Next.js Node process. For an extremely high-traffic app, this uses more Node CPU/Memory than Nginx. Given the scope of this project, it is an acceptable and highly portable trade-off.
