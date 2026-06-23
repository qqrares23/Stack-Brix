# StackBrix — Developer Documentation

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Project Structure](#2-project-structure)
3. [Appwrite Project Setup](#3-appwrite-project-setup)
4. [Environment Variables](#4-environment-variables)
5. [Appwrite SDK Initialization](#5-appwrite-sdk-initialization)
6. [Database Schema](#6-database-schema)
   - [libraries](#61-libraries-collection)
   - [submissions](#62-submissions-collection)
   - [documents](#63-documents-collection)
   - [blocks](#64-blocks-collection)
   - [categories](#65-categories-collection)
7. [Authentication](#7-authentication)
   - [useAuth hook](#71-useauth-hook)
   - [useSession hook](#72-usesession-hook)
   - [OAuth providers](#73-oauth-providers)
8. [Admin Access Control](#8-admin-access-control)
   - [How the gate works](#81-how-the-gate-works)
   - [Assigning the admin label](#82-assigning-the-admin-label)
   - [RequireAdmin route guard](#83-requireadmin-route-guard)
9. [Content Moderation](#9-content-moderation)
   - [Layer 1 — client-side filter](#91-layer-1--client-side-filter)
   - [Layer 2 — server-side OpenAI Moderation API](#92-layer-2--server-side-openai-moderation-api)
   - [Layer 3 — NSFW image detection](#93-layer-3--nsfw-image-detection)
10. [Hub Page — useLibraries](#10-hub-page--uselibraries)
11. [Docs Page — useDocNav & useDocContent](#11-docs-page--usedocnav--usedoccontent)
12. [Editor Page — useEditor](#12-editor-page--useeditor)
13. [Admin Page — useAdmin](#13-admin-page--useadmin)
14. [Storage (Library Avatars)](#14-storage-library-avatars)
15. [Realtime Subscriptions](#15-realtime-subscriptions)
16. [Appwrite Permissions Model](#16-appwrite-permissions-model)
17. [Appwrite Functions (Server Logic)](#17-appwrite-functions-server-logic)
18. [Deployment — Vercel](#18-deployment--vercel)

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript, Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4, DaisyUI v5.5 |
| Backend | Appwrite (self-hosted or cloud) |
| Auth | Appwrite Account service |
| Database | Appwrite Databases |
| Storage | Appwrite Storage |
| Realtime | Appwrite Realtime (WebSocket) |
| Server logic | Appwrite Functions (Node.js runtime) |
| Hosting | Vercel (frontend), Appwrite Cloud or self-hosted (backend) |
| CI/CD | GitHub → Vercel (auto-deploy on every push to `master`) |

---

## 2. Project Structure

```
stackbrix/
├── src/
│   ├── lib/
│   │   ├── appwrite.ts          ← SDK client + service instances (create this)
│   │   ├── moderation.ts        ← client-side content filter (exists)
│   │   └── mappers.ts           ← Appwrite document → TS type mappers (create this)
│   ├── data/
│   │   └── index.ts             ← UI constants only (BLOCK_DEFAULTS)
│   ├── types/
│   │   ├── library.ts
│   │   ├── editor.ts
│   │   ├── admin.ts
│   │   ├── navigation.ts
│   │   └── theme.ts
│   ├── hooks/
│   │   ├── useTheme.ts          ← localStorage theme persistence
│   │   ├── useSession.ts        ← reads Appwrite session + admin label (exists)
│   │   ├── useAuth.ts           ← login / register / logout form logic
│   │   ├── useLibraries.ts      ← fetches libraries collection
│   │   ├── useEditor.ts         ← fetches/mutates documents + blocks collections
│   │   └── useAdmin.ts          ← fetches/mutates submissions collection
│   ├── components/
│   │   ├── ui/
│   │   │   ├── BrixMark.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   └── Callout.tsx
│   │   ├── layout/
│   │   │   └── TopBar.tsx       ← admin button gated by isAdmin prop
│   │   └── features/
│   │       ├── hub/             ← HeroSection, CategoryFilter, LibraryCard
│   │       ├── docs/            ← DocsSidebar, DocsArticle, DocsTabs, DocsToc
│   │       ├── editor/          ← InsertToolbar, EditorBlock, PageTreeSidebar,
│   │       │                       PublishPanel (shows moderation errors), SubmitModal
│   │       ├── admin/           ← StatsCards, AdminTabs, QueueList, DetailPanel
│   │       └── auth/            ← BrandPanel, LoginForm, RegisterForm
│   ├── pages/
│   │   ├── HubPage.tsx
│   │   ├── DocsPage.tsx
│   │   ├── EditorPage.tsx       ← runs moderateSubmission() before submit
│   │   ├── AdminPage.tsx        ← only reachable with admin label
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── App.tsx                  ← AdminContext, RequireAdmin guard, useSession
│   ├── main.tsx
│   └── index.css                ← Tailwind + DaisyUI themes (stackbrix / stackbrix-dark)
├── vercel.json                  ← SPA rewrite + explicit build config
├── .env.example                 ← reference for Vercel environment variables
├── developer_docs.md
├── package.json
└── vite.config.ts
```

---

## 3. Appwrite Project Setup

### 3.1 Create a project

1. Go to your Appwrite console (`https://cloud.appwrite.io` or your self-hosted instance).
2. Click **Create Project** → name it `stackbrix`.
3. Note your **Project ID** — you'll need it for the SDK.

### 3.2 Add a Web platform

Inside the project → **Overview** → **Add Platform** → **Web**:

- **Name**: StackBrix Web
- **Hostname**: `localhost` for dev, your Vercel domain for production (e.g. `stackbrix.vercel.app`)

This whitelists the origin so the SDK's session cookie is accepted. You must add both hostnames — one entry each.

### 3.3 Create a Database

**Databases** → **Create Database**:

- **Name**: `stackbrix-db`
- Note the **Database ID**.

---

## 4. Environment Variables

Create `.env.local` at the project root (never commit this file — it is covered by `.gitignore`).

The `.env.example` file in the repo lists every key. Copy it:

```bash
cp .env.example .env.local
```

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_BUCKET_ID=your-storage-bucket-id

VITE_COL_LIBRARIES=libraries
VITE_COL_SUBMISSIONS=submissions
VITE_COL_DOCUMENTS=documents
VITE_COL_BLOCKS=blocks
VITE_COL_CATEGORIES=categories
```

In **Vercel**: Settings → Environment Variables → add each key above. Vite bakes `VITE_*` variables into the JS bundle at build time, so they must exist before the build runs.

For **Appwrite Functions**, set the same keys (without `VITE_` prefix) under Functions → Settings → Variables, plus `APPWRITE_API_KEY`.

---

## 5. Appwrite SDK Initialization

Create `src/lib/appwrite.ts`:

```ts
import { Client, Account, Databases, Storage, Realtime } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account   = new Account(client);
export const databases = new Databases(client);
export const storage   = new Storage(client);
export const realtime  = new Realtime(client);

export const DB  = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COL = {
  LIBRARIES:   import.meta.env.VITE_COL_LIBRARIES,
  SUBMISSIONS: import.meta.env.VITE_COL_SUBMISSIONS,
  DOCUMENTS:   import.meta.env.VITE_COL_DOCUMENTS,
  BLOCKS:      import.meta.env.VITE_COL_BLOCKS,
  CATEGORIES:  import.meta.env.VITE_COL_CATEGORIES,
} as const;

export const BUCKET = import.meta.env.VITE_APPWRITE_BUCKET_ID;
```

---

## 6. Database Schema

### 6.1 `libraries` Collection

**Purpose**: The main catalog — every approved library visible on the Hub.

**Collection ID**: `libraries`  
**Permissions**: Any role can `read`. Appwrite Functions handle `create`/`update`/`delete` on approval.

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `name` | String (128) | ✓ | Library display name |
| `author` | String (128) | ✓ | Author username |
| `authorId` | String (36) | ✓ | Appwrite user `$id` |
| `cat` | String (64) | ✓ | Category slug (e.g. `utilities`) |
| `desc` | String (512) | ✓ | One-line summary |
| `tags` | String[] (32 each, max 10) | ✓ | Search tags |
| `version` | String (32) | ✓ | Current version string |
| `stars` | Integer | | GitHub star count (synced by Function) |
| `installs` | Integer | | Wally install count (synced by Function) |
| `color` | String (7) | ✓ | Hex color for avatar background |
| `initials` | String (2) | ✓ | 2-char initials for avatar |
| `githubUrl` | URL (512) | | GitHub repo link |
| `wallyUrl` | URL (512) | | Wally package link |
| `submissionId` | String (36) | | FK → `submissions.$id` |

**Indexes**:
- `cat` — category filter queries
- `name` — search (full-text on Appwrite Cloud, substring via `contains` otherwise)
- `stars` — "Most popular" sort

### 6.2 `submissions` Collection

**Purpose**: Review queue. Authors submit here; admins approve or reject.

**Collection ID**: `submissions`  
**Permissions**: `role:member` can `create`. Authors (`user:{id}`) can read their own. `role:label('admin')` can read all and `update` status.

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `name` | String (128) | ✓ | Library name |
| `author` | String (128) | ✓ | Author username |
| `authorId` | String (36) | ✓ | Appwrite user `$id` |
| `initials` | String (2) | ✓ | Avatar initials |
| `color` | String (7) | ✓ | Avatar color |
| `cat` | String (64) | ✓ | Category slug |
| `version` | String (32) | ✓ | Version string |
| `desc` | String (512) | ✓ | Short description |
| `links` | String[] (512) | | GitHub / Wally URLs |
| `status` | Enum(`pending`,`approved`,`rejected`) | ✓ | Current review state |
| `moderationFlag` | Boolean | | Set to `true` by moderation Function if flagged |
| `moderationReason` | String (256) | | Human-readable flag reason |
| `documentId` | String (36) | | FK → the author's draft `documents.$id` |
| `reviewedBy` | String (36) | | Appwrite user `$id` of reviewer |
| `reviewedAt` | DateTime | | ISO timestamp of last status change |

**Indexes**:
- `status` — tab filters
- `authorId` — author's own submissions
- `[status, $createdAt]` — ordered review queue

### 6.3 `documents` Collection

**Purpose**: A library's documentation structured as a tree of pages.

**Collection ID**: `documents`  
**Permissions**: `role:any` can read published docs. Authors (`user:{id}`) can create/update/delete their own.

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `libraryId` | String (36) | | FK → `libraries.$id` (null while draft) |
| `authorId` | String (36) | ✓ | Appwrite user `$id` |
| `title` | String (256) | ✓ | Page title |
| `subtitle` | String (512) | | Short summary |
| `slug` | String (128) | ✓ | URL-safe identifier |
| `version` | String (32) | ✓ | Version this doc applies to |
| `status` | Enum(`draft`,`submitted`,`published`) | ✓ | Visibility state |
| `order` | Integer | ✓ | Sort order within parent group |
| `groupTitle` | String (128) | | Section heading in sidebar |
| `parentId` | String (36) | | FK → parent `documents.$id` for nesting |

**Indexes**:
- `[libraryId, status]` — published pages for a library
- `[authorId, status]` — author's drafts
- `[parentId, order]` — page tree in order

### 6.4 `blocks` Collection

**Purpose**: Content blocks that make up a document page.

**Collection ID**: `blocks`  
**Permissions**: Same as the parent document's author.

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `documentId` | String (36) | ✓ | FK → `documents.$id` |
| `type` | Enum(`h2`,`text`,`code`,`callout`) | ✓ | Block renderer type |
| `text` | String (65535) | ✓ | Raw text content |
| `order` | Integer | ✓ | Display order within document |
| `lang` | String (32) | | Code language hint (code blocks only) |

**Indexes**:
- `[documentId, order]` — fetch and sort blocks for a page

### 6.5 `categories` Collection

**Purpose**: Canonical category list with live counts.

**Collection ID**: `categories`  
**Permissions**: `role:any` can read. Only Appwrite Functions (API key) can write.

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `slug` | String (64) | ✓ | Machine-readable ID (e.g. `utilities`) |
| `label` | String (128) | ✓ | Display name |
| `count` | Integer | ✓ | Number of approved libraries |

**Indexes**:
- `slug` (unique) — fast lookup when updating counts

---

## 7. Authentication

### 7.1 `useAuth` Hook

The current `useAuth` hook (`src/hooks/useAuth.ts`) manages local form state only. Wire it up with Appwrite as follows:

```ts
// src/hooks/useAuth.ts  — full Appwrite implementation
import { account } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { AppwriteException, ID } from 'appwrite';

export function useAuth() {
  const navigate = useNavigate();
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true); setError('');
    try {
      await account.createEmailPasswordSession(email, password);
      navigate('/');
    } catch (e) {
      setError(e instanceof AppwriteException ? e.message : 'Login failed');
    } finally { setLoading(false); }
  }, [navigate]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true); setError('');
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      navigate('/');
    } catch (e) {
      setError(e instanceof AppwriteException ? e.message : 'Registration failed');
    } finally { setLoading(false); }
  }, [navigate]);

  const logout = useCallback(async () => {
    await account.deleteSession('current');
    navigate('/login');
  }, [navigate]);

  return { login, register, logout, loading, error };
}
```

### 7.2 `useSession` Hook

`src/hooks/useSession.ts` already exists in the codebase. It is the single source of truth for the logged-in user and their admin status. The hook is currently stubbed — uncomment the Appwrite block when `src/lib/appwrite.ts` is created:

```ts
// src/hooks/useSession.ts  — activate by uncommenting the useEffect body
import { useState, useEffect } from 'react';
import { account } from '../lib/appwrite';   // uncomment this import too

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  labels: string[];
}

export function useSession() {
  const [user, setUser]       = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);   // set true when activating

  useEffect(() => {
    setLoading(true);
    account.get()
      .then((u) => setUser({
        userId: u.$id,
        name:   u.name,
        email:  u.email,
        labels: u.labels ?? [],
      }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.labels.includes('admin') ?? false,
  };
}
```

`useSession` is called once in `App.tsx` and its return values (`isAdmin`, `isLoggedIn`) are passed down as props to `TopBar` and used by `RequireAdmin`.

### 7.3 OAuth Providers

**GitHub OAuth** (recommended — most library authors have GitHub accounts):

1. GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Set **Authorization callback URL** to:  
   `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/YOUR_PROJECT_ID`
3. Copy **Client ID** and **Client Secret** into Appwrite console → Auth → OAuth2 → GitHub → Enable

In `LoginForm.tsx`, replace the GitHub button's `navigate('/')` with:

```ts
import { OAuthProvider } from 'appwrite';
import { account } from '../../../lib/appwrite';

account.createOAuth2Session(
  OAuthProvider.Github,
  'https://your-domain.vercel.app/',        // success redirect
  'https://your-domain.vercel.app/login',   // failure redirect
);
```

**Roblox OAuth** (Roblox launched OAuth2 in 2023 — not a built-in Appwrite provider):

Roblox is not in Appwrite's built-in provider list. The flow requires a custom Appwrite Function:
1. Redirect user to Roblox's auth endpoint with your Client ID.
2. Roblox redirects back to your Function's URL with a `code`.
3. The Function exchanges `code` for an access token, fetches the Roblox user profile, then calls `account.createJWT()` server-side to create an Appwrite session.
4. Return the JWT to the frontend to complete the login.

This is a ~1 day implementation. Prioritise GitHub OAuth first.

---

## 8. Admin Access Control

### 8.1 How the Gate Works

Admin access is enforced at three independent layers:

| Layer | File | Mechanism |
|---|---|---|
| **UI** | `TopBar.tsx` | Admin button only renders when `isAdmin === true` |
| **Route** | `App.tsx` → `RequireAdmin` | Direct navigation to `/admin` redirects to `/` for non-admins |
| **Data** | Appwrite permissions | `submissions` collection is only readable by `role:label('admin')` |

The `isAdmin` flag comes from `useSession()` in `App.tsx`, which reads `user.labels` from the Appwrite account response. A user only has this flag if their Appwrite account has been assigned the `admin` label.

### 8.2 Assigning the Admin Label

**Via Appwrite Console** (manual, recommended for first admin):

1. Appwrite Console → **Users** → select the user
2. **Labels** tab → type `admin` → click Add

**Via Appwrite Function** (programmatic, for bulk or automated assignment):

```js
// node-appwrite (server-side only — never run this from the frontend)
import { Users } from 'node-appwrite';
const users = new Users(client);
await users.updateLabels(userId, ['admin']);
```

**Removing admin access**: delete the `admin` label from the user in the console. The change takes effect on the user's next session check (next page load).

### 8.3 `RequireAdmin` Route Guard

`RequireAdmin` is defined inline in `App.tsx`:

```tsx
function RequireAdmin({ isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) return <Navigate to="/" replace />;
  return <AdminPage />;
}

// Used as:
<Route path="/admin" element={<RequireAdmin isAdmin={isAdmin} />} />
```

When Appwrite is connected and `useSession` is loading, you should also block the render until loading completes to avoid a flash. Update `RequireAdmin` to:

```tsx
function RequireAdmin({ isAdmin, loading }: { isAdmin: boolean; loading: boolean }) {
  if (loading) return null;                    // or a spinner
  if (!isAdmin) return <Navigate to="/" replace />;
  return <AdminPage />;
}
```

And pass `loading` from `useSession()` in `App.tsx`.

---

## 9. Content Moderation

StackBrix uses a layered moderation strategy. Each layer is independent — failing one does not bypass the others.

### 9.1 Layer 1 — Client-side Filter

**File**: `src/lib/moderation.ts`  
**When**: Before the submission is sent to Appwrite, inside `EditorPage.submitDoc()`  
**What it checks**: Regex patterns for common slurs and harmful intent phrases across all text fields (title, subtitle, every block's text)

```ts
// Usage in EditorPage.tsx
import { moderateSubmission } from '../lib/moderation';

const check = moderateSubmission({
  title:    docTitle,
  subtitle: docSubtitle,
  body:     blocks.map((b) => b.text).join(' '),
});

if (check.flagged) {
  setModerationError(check.reason);   // shown in PublishPanel as red inline error
  return;
}
```

To extend the filter, add patterns to the `BLOCKED_PATTERNS` array in `moderation.ts`. Use `\b` word boundaries to avoid false positives.

**Limitations**: Client-side regex is bypassable by a determined bad actor — it is a UX convenience only. Layers 2 and 3 are the authoritative checks.

### 9.2 Layer 2 — Server-side OpenAI Moderation API

**When**: Appwrite Function triggered on `submissions` collection `create` event  
**API**: `POST https://api.openai.com/v1/moderations` — free, no rate limit for low traffic  
**What it catches**: hate speech, harassment, self-harm, sexual content, violence (OpenAI's 11 moderation categories)

```js
// functions/on-submission-created/src/main.js
import { Client, Databases } from 'node-appwrite';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db      = new Databases(client);
  const payload = JSON.parse(req.body);
  const docId   = payload.$id;

  // Concatenate all text fields for moderation
  const input = [
    payload.name,
    payload.desc,
    ...(payload.links ?? []),
  ].join('\n');

  const modRes = await fetch('https://api.openai.com/v1/moderations', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ input }),
  });

  const modData = await modRes.json();
  const result  = modData.results[0];

  if (result.flagged) {
    const categories = Object.entries(result.categories)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(', ');

    // Mark submission as auto-rejected
    await db.updateDocument(
      process.env.DATABASE_ID,
      process.env.COL_SUBMISSIONS,
      docId,
      {
        status:           'rejected',
        moderationFlag:   true,
        moderationReason: `Auto-rejected: flagged for ${categories}`,
      },
    );
    log(`Submission ${docId} auto-rejected: ${categories}`);
  }

  return res.send('OK');
};
```

**Function environment variables** to add:
```
OPENAI_API_KEY=sk-...
DATABASE_ID=your-database-id
COL_SUBMISSIONS=submissions
```

**Trigger**: Databases → `submissions` → Events → `databases.*.collections.*.documents.*.create`

### 9.3 Layer 3 — NSFW Image Detection

**When**: Appwrite Function triggered on Storage bucket file upload  
**API**: Google Cloud Vision SafeSearch (free tier: 1000 units/month)

```js
// functions/on-avatar-upload/src/main.js
import { Client, Storage } from 'node-appwrite';
import { ImageAnnotatorClient } from '@google-cloud/vision';

export default async ({ req, res, log }) => {
  const payload = JSON.parse(req.body);
  const fileId  = payload.$id;

  const appwrite = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const storage = new Storage(appwrite);

  // Download file bytes
  const fileBuffer = await storage.getFileDownload(process.env.BUCKET_ID, fileId);

  // Run SafeSearch
  const vision  = new ImageAnnotatorClient();
  const [result] = await vision.safeSearchDetection({ image: { content: fileBuffer } });
  const safe    = result.safeSearchAnnotation;

  const BLOCK = ['LIKELY', 'VERY_LIKELY'];
  if (BLOCK.includes(safe.adult) || BLOCK.includes(safe.violence)) {
    await storage.deleteFile(process.env.BUCKET_ID, fileId);
    log(`File ${fileId} deleted: adult=${safe.adult} violence=${safe.violence}`);
  }

  return res.send('OK');
};
```

**Trigger**: Storage → Bucket events → `buckets.*.files.*.create`

**Alternative**: [Sightengine](https://sightengine.com) — simpler API, no GCP account needed, generous free tier.

---

## 10. Hub Page — `useLibraries`

`src/hooks/useLibraries.ts` currently accepts empty initial arrays. Replace with a live Appwrite fetch:

```ts
// src/hooks/useLibraries.ts  — full Appwrite implementation
import { useState, useEffect, useMemo } from 'react';
import { databases, DB, COL } from '../lib/appwrite';
import { Query } from 'appwrite';
import type { Library, Category } from '../types/library';
import { mapLibrary } from '../lib/mappers';

export function useLibraries() {
  const [libraries, setLibraries]   = useState<Library[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat]   = useState<string>('all');
  const [search, setSearch]         = useState<string>('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    databases.listDocuments(DB, COL.CATEGORIES)
      .then((res) => setCategories(res.documents as unknown as Category[]))
      .catch(() => setError('Failed to load categories'));
  }, []);

  useEffect(() => {
    setLoading(true);
    const queries = [
      Query.equal('status', 'approved'),
      Query.orderDesc('stars'),
      Query.limit(50),
    ];
    if (activeCat !== 'all') queries.push(Query.equal('cat', activeCat));

    databases.listDocuments(DB, COL.LIBRARIES, queries)
      .then((res) => setLibraries(res.documents.map(mapLibrary)))
      .catch(() => setError('Failed to load libraries'))
      .finally(() => setLoading(false));
  }, [activeCat]);

  const filtered = useMemo<Library[]>(() => {
    if (!search.trim()) return libraries;
    const q = search.toLowerCase();
    return libraries.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.author.toLowerCase().includes(q) ||
        l.desc.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [libraries, search]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCat),
    [categories, activeCat],
  );

  return {
    libraries: filtered, categories,
    activeCat, setActiveCat,
    search, setSearch,
    catTitle: activeCategory?.label ?? 'All libraries',
    loading, error,
  };
}
```

### Document mapper

Create `src/lib/mappers.ts`:

```ts
import type { Models } from 'appwrite';
import type { Library } from '../types/library';
import type { QueueItem } from '../types/admin';

export function mapLibrary(doc: Models.Document): Library {
  return {
    name:     doc.name,
    author:   doc.author,
    cat:      doc.cat,
    desc:     doc.desc,
    tags:     doc.tags ?? [],
    version:  doc.version,
    stars:    String(doc.stars ?? 0),
    installs: String(doc.installs ?? 0),
    color:    doc.color,
    initials: doc.initials,
  };
}

export function mapSubmission(doc: Models.Document): QueueItem {
  return {
    id:        doc.$id,
    name:      doc.name,
    author:    doc.author,
    initials:  doc.initials,
    color:     doc.color,
    cat:       doc.cat,
    version:   doc.version,
    submitted: formatRelativeTime(doc.$createdAt),
    status:    doc.status,
    desc:      doc.desc,
    links:     doc.links ?? [],
    mine:      false,
  };
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1)  return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
```

---

## 11. Docs Page — `useDocNav` & `useDocContent`

`DocsPage` currently passes `navGroups={[]}`. The sidebar nav and article content will be dynamic once these hooks are created.

### URL structure

Update the route in `App.tsx`:

```tsx
<Route path="/docs/:librarySlug/:pageSlug?" element={<DocsPage />} />
```

### `useDocNav` hook

```ts
// src/hooks/useDocNav.ts
import { useState, useEffect } from 'react';
import { databases, DB, COL } from '../lib/appwrite';
import { Query } from 'appwrite';
import type { NavGroup, NavItem } from '../types/navigation';

export function useDocNav(libraryId: string) {
  const [navGroups, setNavGroups] = useState<NavGroup[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!libraryId) return;
    databases.listDocuments(DB, COL.DOCUMENTS, [
      Query.equal('libraryId', libraryId),
      Query.equal('status', 'published'),
      Query.orderAsc('order'),
      Query.limit(200),
    ]).then((res) => {
      const groups: Record<string, NavItem[]> = {};
      for (const doc of res.documents) {
        const group = doc.groupTitle ?? 'General';
        if (!groups[group]) groups[group] = [];
        groups[group].push({ id: doc.$id, label: doc.title });
      }
      setNavGroups(Object.entries(groups).map(([title, items]) => ({ title, items })));
    }).finally(() => setLoading(false));
  }, [libraryId]);

  return { navGroups, loading };
}
```

### `useDocContent` hook

```ts
// src/hooks/useDocContent.ts
import { useState, useEffect } from 'react';
import { databases, DB, COL } from '../lib/appwrite';
import { Query } from 'appwrite';
import type { Block } from '../types/editor';

export function useDocContent(documentId: string) {
  const [blocks, setBlocks]     = useState<Block[]>([]);
  const [docTitle, setDocTitle] = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!documentId) return;
    Promise.all([
      databases.getDocument(DB, COL.DOCUMENTS, documentId),
      databases.listDocuments(DB, COL.BLOCKS, [
        Query.equal('documentId', documentId),
        Query.orderAsc('order'),
        Query.limit(500),
      ]),
    ]).then(([doc, blockRes]) => {
      setDocTitle(doc.title);
      setBlocks(blockRes.documents.map((b) => ({ id: b.$id, type: b.type, text: b.text })));
    }).finally(() => setLoading(false));
  }, [documentId]);

  return { docTitle, blocks, loading };
}
```

---

## 12. Editor Page — `useEditor`

### Loading a draft

```ts
// useEditor.ts additions
export function useEditor(documentId?: string) {
  // ... existing state ...

  useEffect(() => {
    if (!documentId) return;
    Promise.all([
      databases.getDocument(DB, COL.DOCUMENTS, documentId),
      databases.listDocuments(DB, COL.BLOCKS, [
        Query.equal('documentId', documentId),
        Query.orderAsc('order'),
        Query.limit(500),
      ]),
    ]).then(([doc, blockRes]) => {
      setDocTitle(doc.title);
      setDocSubtitle(doc.subtitle ?? '');
      setBlocks(blockRes.documents.map((b) => ({ id: b.$id, type: b.type, text: b.text })));
    });
  }, [documentId]);
}
```

### Auto-save (debounced)

```ts
const autosave = useCallback(
  debounce(async (id: string, title: string, subtitle: string, bks: Block[]) => {
    await databases.updateDocument(DB, COL.DOCUMENTS, id, { title, subtitle });
    for (let i = 0; i < bks.length; i++) {
      await databases.updateDocument(DB, COL.BLOCKS, bks[i].id, {
        text: bks[i].text, type: bks[i].type, order: i,
      });
    }
  }, 1200),
  [],
);
```

### Creating a new document

```ts
const createDocument = async (authorId: string) => {
  const doc = await databases.createDocument(
    DB, COL.DOCUMENTS, ID.unique(),
    { authorId, title: 'Untitled', subtitle: '', slug: 'untitled-' + Date.now(),
      version: 'v1.0.0', status: 'draft', order: 0, groupTitle: 'Getting Started' },
    [Permission.read(Role.user(authorId)), Permission.update(Role.user(authorId)),
     Permission.delete(Role.user(authorId))],
  );
  return doc.$id;
};
```

### `submitDoc` — with moderation + Appwrite write

`EditorPage.submitDoc()` already runs `moderateSubmission()` (Layer 1) before calling `enqueue()`. When wiring Appwrite, replace the optimistic `enqueue` call with:

```ts
const submitDoc = async (documentId: string, user: SessionUser) => {
  // Layer 1 — client-side (already in place)
  const check = moderateSubmission({ title: docTitle, subtitle: docSubtitle,
    body: blocks.map((b) => b.text).join(' ') });
  if (check.flagged) { setModerationError(check.reason); return; }

  // Write to Appwrite — Layer 2 moderation Function fires automatically
  const sub = await databases.createDocument(
    DB, COL.SUBMISSIONS, ID.unique(),
    { name: docTitle, author: user.name, authorId: user.userId,
      initials: docTitle.slice(0, 2).toUpperCase(), color: '#FF4438',
      cat: 'Utilities', version: 'v1.0.0', desc: docSubtitle,
      links: [], status: 'pending', documentId },
    [Permission.read(Role.user(user.userId)), Permission.read(Role.label('admin')),
     Permission.update(Role.label('admin'))],
  );

  await databases.updateDocument(DB, COL.DOCUMENTS, documentId, { status: 'submitted' });
  enqueue({ ...sub, id: sub.$id, mine: true, status: 'pending' } as QueueItem);
  setSubmitted(sub.$id);
};
```

---

## 13. Admin Page — `useAdmin`

### Fetching the queue with realtime

```ts
// src/hooks/useAdmin.ts  — full Appwrite implementation
import { databases, realtime, DB, COL } from '../lib/appwrite';
import { Query } from 'appwrite';
import { mapSubmission } from '../lib/mappers';

export function useAdmin() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  // ...

  useEffect(() => {
    databases.listDocuments(DB, COL.SUBMISSIONS, [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ]).then((res) => setQueue(res.documents.map(mapSubmission)));
  }, []);

  useEffect(() => {
    const unsub = realtime.subscribe(
      `databases.${DB}.collections.${COL.SUBMISSIONS}.documents`,
      (event) => {
        const doc = event.payload as Models.Document;
        setQueue((q) => {
          const i = q.findIndex((x) => x.id === doc.$id);
          if (i >= 0) { const u = [...q]; u[i] = mapSubmission(doc); return u; }
          return [mapSubmission(doc), ...q];
        });
      },
    );
    return unsub;
  }, []);
}
```

### `setStatus` — persisting a decision

```ts
const setStatus = useCallback(async (id: string, status: SubmissionStatus) => {
  setQueue((q) => q.map((x) => (x.id === id ? { ...x, status } : x)));  // optimistic
  await databases.updateDocument(DB, COL.SUBMISSIONS, id, {
    status, reviewedAt: new Date().toISOString(),
  });
  // Approval triggers the `on-submission-approved` Function (see §17)
}, []);
```

---

## 14. Storage (Library Avatars)

### Create a bucket

**Storage** → **Create Bucket**:

- **Name**: `avatars`
- **File size limit**: 512 KB
- **Allowed extensions**: `jpg`, `jpeg`, `png`, `webp`
- **Permissions**: `role:any` read. `role:member` create. Functions delete.

### Upload

```ts
import { storage, BUCKET } from '../lib/appwrite';
import { ID } from 'appwrite';

async function uploadAvatar(file: File): Promise<string> {
  const result = await storage.createFile(BUCKET, ID.unique(), file);
  return result.$id;
}
```

### Display

```ts
function getAvatarUrl(fileId: string): string {
  return storage.getFilePreview(BUCKET, fileId, 128, 128, 'center', 80).href;
}
```

Use `getAvatarUrl` in `Avatar.tsx` when a `fileId` prop is present, falling back to the colored initials avatar.

---

## 15. Realtime Subscriptions

```ts
// Subscribe to a whole collection
realtime.subscribe(
  `databases.${DB}.collections.${COL.SUBMISSIONS}.documents`,
  callback,
);

// Subscribe to a single document
realtime.subscribe(
  `databases.${DB}.collections.${COL.BLOCKS}.documents.${blockId}`,
  callback,
);
```

Event strings in `event.events`:
- `databases.*.collections.*.documents.*.create`
- `databases.*.collections.*.documents.*.update`
- `databases.*.collections.*.documents.*.delete`

| Feature | Channel | Purpose |
|---|---|---|
| Admin queue | `submissions` collection | Live new/updated submissions |
| Editor (future) | specific `blocks` document | Collaborative live editing |
| Hub | `libraries` collection | Newly approved libraries appear instantly |

Always return the unsubscribe function from `useEffect` cleanup.

---

## 16. Appwrite Permissions Model

### Helpers

```ts
import { Permission, Role } from 'appwrite';

Permission.read(Role.any())           // any visitor
Permission.create(Role.users())       // any logged-in user
Permission.read(Role.user(userId))    // specific user only
Permission.update(Role.user(userId))
Permission.delete(Role.user(userId))
Permission.read(Role.label('admin'))  // admin-labelled users
Permission.update(Role.label('admin'))
```

### Per-collection matrix

| Collection | Public read | Member create | Owner update/delete | Admin full |
|---|---|---|---|---|
| `libraries` | ✓ | — (Function only) | — | ✓ |
| `submissions` | — | ✓ | ✓ own | ✓ |
| `documents` | ✓ published | ✓ | ✓ own | ✓ |
| `blocks` | ✓ published | ✓ | ✓ own | ✓ |
| `categories` | ✓ | — | — | Function only |

---

## 17. Appwrite Functions (Server Logic)

### Function 1: `on-submission-created` — auto-moderation

**Trigger**: `databases.*.collections.submissions.documents.*.create`

Runs OpenAI Moderation API on the submission text. Auto-rejects and sets `moderationFlag: true` if flagged. See §9.2 for full source.

### Function 2: `on-submission-approved` — publish to catalog

**Trigger**: `databases.*.collections.submissions.documents.*.update` (filter: `status === 'approved'`)

```js
// functions/on-submission-approved/src/main.js
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db      = new Databases(client);
  const payload = JSON.parse(req.body);

  if (payload.status !== 'approved') return res.send('skipped');

  // 1. Create library document (publicly readable)
  const lib = await db.createDocument(
    process.env.DATABASE_ID, process.env.COL_LIBRARIES, ID.unique(),
    { name: payload.name, author: payload.author, authorId: payload.authorId,
      cat: payload.cat, desc: payload.desc, tags: payload.tags ?? [],
      version: payload.version, stars: 0, installs: 0,
      color: payload.color, initials: payload.initials, submissionId: payload.$id },
    [Permission.read(Role.any())],
  );

  // 2. Publish the linked document
  if (payload.documentId) {
    await db.updateDocument(
      process.env.DATABASE_ID, process.env.COL_DOCUMENTS, payload.documentId,
      { status: 'published', libraryId: lib.$id },
      [Permission.read(Role.any()), Permission.update(Role.user(payload.authorId))],
    );
  }

  // 3. Increment category count
  const cats = await db.listDocuments(
    process.env.DATABASE_ID, process.env.COL_CATEGORIES,
    [Query.equal('slug', payload.cat)],
  );
  if (cats.documents.length > 0) {
    const cat = cats.documents[0];
    await db.updateDocument(
      process.env.DATABASE_ID, process.env.COL_CATEGORIES, cat.$id,
      { count: cat.count + 1 },
    );
  }

  log(`Published library ${lib.$id}`);
  return res.send('OK');
};
```

### Function 3: `sync-github-stats`

**Trigger**: CRON `0 */6 * * *` (every 6 hours)

Lists all `libraries` with a `githubUrl`, calls `GET /repos/{owner}/{repo}` for each, updates the `stars` field. Keep within GitHub's 5000 req/hour rate limit (use a token).

### Function 4: `on-avatar-upload` — NSFW image detection

**Trigger**: `buckets.*.files.*.create`

Runs Google Cloud Vision SafeSearch. Deletes the file if it scores `LIKELY` or `VERY_LIKELY` for adult or violence. See §9.3 for full source.

### Deploying functions

```bash
npm install -g appwrite-cli
appwrite login
appwrite deploy function --functionId on-submission-created
appwrite deploy function --functionId on-submission-approved
appwrite deploy function --functionId sync-github-stats
appwrite deploy function --functionId on-avatar-upload
```

Set all environment variables per function under **Functions → Settings → Variables**.

---

## 18. Deployment — Vercel

### How it works

The repo is connected to Vercel at `https://github.com/qqrares23/Stack-Brix`. Every push to the `master` branch triggers an automatic production deployment. No manual action required.

### `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The `rewrites` rule is critical — without it, Vercel serves `dist/` as a static file tree and any direct navigation to `/docs`, `/admin`, etc. returns 404 because those files don't exist on disk. The rewrite sends every request to `index.html` so React Router handles routing client-side.

### Environment variables on Vercel

Go to **Vercel → Project → Settings → Environment Variables** and add:

```
VITE_APPWRITE_ENDPOINT
VITE_APPWRITE_PROJECT_ID
VITE_APPWRITE_DATABASE_ID
VITE_APPWRITE_BUCKET_ID
VITE_COL_LIBRARIES
VITE_COL_SUBMISSIONS
VITE_COL_DOCUMENTS
VITE_COL_BLOCKS
VITE_COL_CATEGORIES
```

Set scope to **Production** + **Preview** so both environments work.

### Appwrite web platform

After getting your Vercel domain (e.g. `stackbrix.vercel.app`), add it to Appwrite:

**Console → Overview → Add Platform → Web → Hostname**: `stackbrix.vercel.app`

Without this, Appwrite rejects requests from the production domain and no session cookies are set.

### Self-hosting Appwrite (optional)

If running Appwrite on your own server instead of Appwrite Cloud:

- Minimum: 2 vCPU, 4 GB RAM
- Use the official Docker Compose setup
- Set `_APP_DOMAIN` and `_APP_DOMAIN_TARGET` to your domain
- Use Traefik or nginx as a TLS-terminating reverse proxy
- Change `VITE_APPWRITE_ENDPOINT` to `https://your-appwrite-domain.com/v1`

### Security checklist

- Never expose your Appwrite API key to the frontend — it bypasses all permission checks
- Set required flags and max-length limits on all collection attributes to block oversized payloads
- Enable rate limiting in Appwrite console → Auth → Security (prevents brute-force logins)
- Create function-scoped API keys with only the specific scopes each Function needs
- Rotate API keys regularly
- Validate all content server-side in Functions before writing to `libraries` — client-side moderation is a UX aid, not a security control
- Appwrite's session cookie is `SameSite=Strict` and `Secure` — it requires HTTPS in production
