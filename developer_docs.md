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
   - [documents (pages)](#63-documents-collection)
   - [blocks](#64-blocks-collection)
   - [categories](#65-categories-collection)
7. [Authentication](#7-authentication)
   - [useAuth hook](#71-useauth-hook)
   - [Session guard (protected routes)](#72-session-guard-protected-routes)
   - [OAuth providers](#73-oauth-providers)
8. [Hub Page — useLibraries](#8-hub-page--uselibraries)
9. [Docs Page — useDocNav](#9-docs-page--usedocnav)
10. [Editor Page — useEditor](#10-editor-page--useeditor)
11. [Admin Page — useAdmin](#11-admin-page--useadmin)
12. [Storage (Library Avatars)](#12-storage-library-avatars)
13. [Realtime Subscriptions](#13-realtime-subscriptions)
14. [Appwrite Permissions Model](#14-appwrite-permissions-model)
15. [Appwrite Functions (Server Logic)](#15-appwrite-functions-server-logic)
16. [Deployment Checklist](#16-deployment-checklist)

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript, Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4, DaisyUI v5 |
| Backend | Appwrite (self-hosted or cloud) |
| Auth | Appwrite Account service |
| Database | Appwrite Databases |
| Storage | Appwrite Storage |
| Realtime | Appwrite Realtime (WebSocket) |
| Server logic | Appwrite Functions (Node.js runtime) |

---

## 2. Project Structure

```
stackbrix/
├── src/
│   ├── lib/
│   │   └── appwrite.ts          ← SDK client + service instances (to create)
│   ├── data/
│   │   └── index.ts             ← UI constants only (BLOCK_DEFAULTS)
│   ├── types/
│   │   ├── library.ts
│   │   ├── editor.ts
│   │   ├── admin.ts
│   │   ├── navigation.ts
│   │   └── theme.ts
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useLibraries.ts      ← fetches libraries collection
│   │   ├── useEditor.ts         ← fetches/mutates documents + blocks collections
│   │   ├── useAdmin.ts          ← fetches/mutates submissions collection
│   │   └── useAuth.ts           ← calls account service
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── features/
│   │       ├── hub/
│   │       ├── docs/
│   │       ├── editor/
│   │       ├── admin/
│   │       └── auth/
│   ├── pages/
│   │   ├── HubPage.tsx
│   │   ├── DocsPage.tsx
│   │   ├── EditorPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
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
- **Hostname**: `localhost` (dev) — add your production domain later

This whitelists the origin so the SDK's session cookie is accepted.

### 3.3 Create a Database

**Databases** → **Create Database**:

- **Name**: `stackbrix-db`
- Note the **Database ID**.

---

## 4. Environment Variables

Create `.env.local` at the project root (never commit this file):

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_BUCKET_ID=your-storage-bucket-id

# Collection IDs (set these after creating collections in §6)
VITE_COL_LIBRARIES=libraries
VITE_COL_SUBMISSIONS=submissions
VITE_COL_DOCUMENTS=documents
VITE_COL_BLOCKS=blocks
VITE_COL_CATEGORIES=categories
```

Add the same keys (without the `VITE_` prefix is fine server-side) to your Appwrite Functions environment when you create server-side functions.

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

Import `databases`, `account`, `storage`, `realtime`, `DB`, `COL`, and `BUCKET` anywhere you need them.

---

## 6. Database Schema

### 6.1 `libraries` Collection

**Purpose**: The main catalog — every approved library visible on the Hub.

**Collection ID**: `libraries`  
**Permissions**: Any role can `read`. Only `role:member` (logged-in users) can `create`. Appwrite Functions handle `update`/`delete` on approval.

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
- `cat` — for category filter queries
- `name` — for search (full-text if on Appwrite Cloud, otherwise substring via `contains`)
- `stars` — for "Most popular" sort

### 6.2 `submissions` Collection

**Purpose**: Review queue. Authors submit here; moderators approve or reject.

**Collection ID**: `submissions`  
**Permissions**: `role:member` can `create`/`read` their own docs (`user:{id}` label). `role:admin` can read all and `update` status.

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
| `documentId` | String (36) | | FK → the author's draft `documents.$id` |
| `reviewedBy` | String (36) | | Appwrite user `$id` of reviewer |
| `reviewedAt` | DateTime | | ISO timestamp of last status change |

**Indexes**:
- `status` — for tab filters
- `authorId` — so authors can query their own submissions
- `[status, $createdAt]` — for the ordered review queue list

### 6.3 `documents` Collection

**Purpose**: A library's documentation, structured as a tree of pages. One document per library per version.

**Collection ID**: `documents`  
**Permissions**: `role:any` can `read` approved docs. Authors (`user:{id}`) can `create`/`update`/`delete` their own. Admins can `delete`.

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `libraryId` | String (36) | | FK → `libraries.$id` (null while draft) |
| `authorId` | String (36) | ✓ | Appwrite user `$id` |
| `title` | String (256) | ✓ | Document / page title |
| `subtitle` | String (512) | | Short summary shown in cards |
| `slug` | String (128) | ✓ | URL-safe identifier |
| `version` | String (32) | ✓ | Version this doc applies to |
| `status` | Enum(`draft`,`published`) | ✓ | Visibility state |
| `order` | Integer | ✓ | Sort order within parent group |
| `groupTitle` | String (128) | | Section heading in the sidebar |
| `parentId` | String (36) | | FK → parent `documents.$id` for nested pages |

**Indexes**:
- `[libraryId, status]` — fetch all published pages for a library
- `[authorId, status]` — fetch an author's drafts
- `[parentId, order]` — build the page tree in order

### 6.4 `blocks` Collection

**Purpose**: The content blocks that make up a document page.

**Collection ID**: `blocks`  
**Permissions**: Same as the parent `documents` document — authors own their blocks.

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `documentId` | String (36) | ✓ | FK → `documents.$id` |
| `type` | Enum(`h2`,`text`,`code`,`callout`) | ✓ | Block renderer type |
| `text` | String (65535) | ✓ | Raw text content |
| `order` | Integer | ✓ | Display order within document |
| `lang` | String (32) | | Code language hint (for code blocks) |

**Indexes**:
- `[documentId, order]` — fetch and sort blocks for a page

### 6.5 `categories` Collection

**Purpose**: Canonical category list with live counts. Counts are maintained by Appwrite Functions triggered on library `create`/`update`/`delete`.

**Collection ID**: `categories`  
**Permissions**: `role:any` can read. Only Appwrite Functions (using API key) can write.

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `slug` | String (64) | ✓ | Machine-readable ID (e.g. `utilities`) |
| `label` | String (128) | ✓ | Display name |
| `count` | Integer | ✓ | Number of approved libraries in this category |

**Indexes**:
- `slug` (unique) — fast lookup when updating counts

---

## 7. Authentication

### 7.1 `useAuth` Hook

The current `useAuth` hook manages local form state only. Wire it up as follows:

```ts
// src/hooks/useAuth.ts
import { account } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { AppwriteException } from 'appwrite';

export function useAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      await account.createEmailPasswordSession(email, password);
      navigate('/');
    } catch (e) {
      setError(e instanceof AppwriteException ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (
    userId: string,   // generate with ID.unique() from appwrite pkg
    email: string,
    password: string,
    name: string,
  ) => {
    setLoading(true);
    setError('');
    try {
      await account.create(userId, email, password, name);
      await account.createEmailPasswordSession(email, password);
      navigate('/');
    } catch (e) {
      setError(e instanceof AppwriteException ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    await account.deleteSession('current');
    navigate('/login');
  }, [navigate]);

  return { login, register, logout, loading, error };
}
```

### 7.2 Session Guard (Protected Routes)

Create a `useSession` hook and a `<RequireAuth>` wrapper:

```ts
// src/hooks/useSession.ts
import { useEffect, useState } from 'react';
import { account } from '../lib/appwrite';
import type { Models } from 'appwrite';

export function useSession() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account.get()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, isLoggedIn: !!user };
}
```

```tsx
// src/components/layout/RequireAuth.tsx
import { Navigate } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  if (loading) return null;                          // or a full-page spinner
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

Wrap protected routes in `App.tsx`:

```tsx
<Route path="/editor" element={<RequireAuth><EditorPage /></RequireAuth>} />
<Route path="/admin"  element={<RequireAuth><AdminPage /></RequireAuth>} />
```

### 7.3 OAuth Providers

The login form has GitHub and Roblox OAuth buttons. Enable them in Appwrite:

**Auth → OAuth2 → GitHub**:
- Client ID + Secret from GitHub → Settings → Developer settings → OAuth Apps
- Callback URL: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/{PROJECT_ID}`

In code, replace `navigate('/')` on the OAuth buttons with:

```ts
import { OAuthProvider } from 'appwrite';

// GitHub
account.createOAuth2Session(
  OAuthProvider.Github,
  'http://localhost:5173/',        // success redirect
  'http://localhost:5173/login',   // failure redirect
);

// Roblox is not a built-in provider — use a custom JWT flow or a third-party
// Roblox OAuth server (e.g. roblox-oauth.com) and Appwrite's custom token:
// account.createJWT() after verifying on an Appwrite Function.
```

---

## 8. Hub Page — `useLibraries`

### Appwrite query

`useLibraries` currently accepts `initialLibraries` and `initialCategories` as constructor arguments. Replace the empty defaults with a `useEffect` fetch:

```ts
// src/hooks/useLibraries.ts  (full replacement)
import { useState, useEffect, useMemo, useCallback } from 'react';
import { databases, DB, COL } from '../lib/appwrite';
import { Query } from 'appwrite';
import type { Library, Category } from '../types/library';

export function useLibraries() {
  const [libraries, setLibraries]   = useState<Library[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat]   = useState<string>('all');
  const [search, setSearch]         = useState<string>('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  // Fetch categories once
  useEffect(() => {
    databases.listDocuments(DB, COL.CATEGORIES)
      .then((res) => setCategories(res.documents as unknown as Category[]))
      .catch(() => setError('Failed to load categories'));
  }, []);

  // Fetch libraries whenever the active category changes
  useEffect(() => {
    setLoading(true);
    const queries = [
      Query.equal('status', 'approved'),   // only published libraries
      Query.orderDesc('stars'),
      Query.limit(50),
    ];
    if (activeCat !== 'all') queries.push(Query.equal('cat', activeCat));

    databases.listDocuments(DB, COL.LIBRARIES, queries)
      .then((res) => setLibraries(res.documents as unknown as Library[]))
      .catch(() => setError('Failed to load libraries'))
      .finally(() => setLoading(false));
  }, [activeCat]);

  // Client-side search filter (swap for server-side full-text on Appwrite Cloud)
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

  // Appwrite Cloud only: server-side full-text search
  // Replace the useMemo above with:
  //
  // const search = useCallback(async (query: string) => {
  //   const res = await databases.listDocuments(DB, COL.LIBRARIES, [
  //     Query.search('name', query),
  //     Query.equal('status', 'approved'),
  //   ]);
  //   setLibraries(res.documents as unknown as Library[]);
  // }, []);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCat),
    [categories, activeCat],
  );

  return {
    libraries: filtered,
    categories,
    activeCat,
    setActiveCat,
    search,
    setSearch,
    catTitle: activeCategory?.label ?? 'All libraries',
    loading,
    error,
  };
}
```

### Mapping Appwrite documents to `Library` type

Appwrite returns `Models.Document` objects with system fields (`$id`, `$createdAt`, etc.). Create a mapper:

```ts
// src/lib/mappers.ts
import type { Models } from 'appwrite';
import type { Library } from '../types/library';

export function mapLibrary(doc: Models.Document): Library {
  return {
    name:      doc.name,
    author:    doc.author,
    cat:       doc.cat,
    desc:      doc.desc,
    tags:      doc.tags ?? [],
    version:   doc.version,
    stars:     String(doc.stars ?? 0),
    installs:  String(doc.installs ?? 0),
    color:     doc.color,
    initials:  doc.initials,
  };
}
```

Use `res.documents.map(mapLibrary)` instead of `as unknown as Library[]`.

---

## 9. Docs Page — `useDocNav`

The `DocsPage` currently passes `navGroups={[]}` to `DocsSidebar`. The nav tree is built from the `documents` collection for the library being viewed.

### URL structure

Add a route param so the library slug and page slug are in the URL:

```tsx
// App.tsx — update the docs route
<Route path="/docs/:librarySlug/:pageSlug?" element={<DocsPage />} />
```

### `useDocNav` hook (create this)

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
      // Group pages by `groupTitle`
      const groups: Record<string, NavItem[]> = {};
      for (const doc of res.documents) {
        const group = doc.groupTitle ?? 'General';
        if (!groups[group]) groups[group] = [];
        groups[group].push({ id: doc.$id, label: doc.title });
      }
      setNavGroups(
        Object.entries(groups).map(([title, items]) => ({ title, items })),
      );
    }).finally(() => setLoading(false));
  }, [libraryId]);

  return { navGroups, loading };
}
```

### `useDocContent` hook (create this)

```ts
// src/hooks/useDocContent.ts
import { useState, useEffect } from 'react';
import { databases, DB, COL } from '../lib/appwrite';
import { Query } from 'appwrite';
import type { Block } from '../types/editor';

export function useDocContent(documentId: string) {
  const [blocks, setBlocks]       = useState<Block[]>([]);
  const [docTitle, setDocTitle]   = useState('');
  const [loading, setLoading]     = useState(true);

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
      setBlocks(blockRes.documents.map((b) => ({
        id:   b.$id,
        type: b.type,
        text: b.text,
      })));
    }).finally(() => setLoading(false));
  }, [documentId]);

  return { docTitle, blocks, loading };
}
```

Wire both hooks into `DocsPage` using the route params from `useParams`.

---

## 10. Editor Page — `useEditor`

### Loading a draft

When the editor opens, load the author's most recent draft (or a specific doc by ID from query params):

```ts
// src/hooks/useEditor.ts  (additions)
import { databases, DB, COL } from '../lib/appwrite';
import { Query, ID } from 'appwrite';

export function useEditor(documentId?: string) {
  // ... existing state ...

  // Load existing document
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
      setBlocks(blockRes.documents.map((b, i) => ({
        id:   b.$id,
        type: b.type,
        text: b.text,
      })));
    });
  }, [documentId]);

  // ... rest of hook
}
```

### Auto-save

Call `autosave` debounced whenever `blocks`, `docTitle`, or `docSubtitle` change:

```ts
// Debounce utility (or use use-debounce package)
const autosave = useCallback(
  debounce(async (id: string, title: string, subtitle: string, bks: Block[]) => {
    // Update document metadata
    await databases.updateDocument(DB, COL.DOCUMENTS, id, {
      title, subtitle, updatedAt: new Date().toISOString(),
    });
    // Upsert each block — in production batch these with Appwrite's batch API
    for (let i = 0; i < bks.length; i++) {
      await databases.updateDocument(DB, COL.BLOCKS, bks[i].id, {
        text: bks[i].text,
        type: bks[i].type,
        order: i,
      });
    }
  }, 1200),
  [],
);
```

### Creating a new document

When the editor opens fresh (no `documentId`):

```ts
const createDocument = async (authorId: string) => {
  const doc = await databases.createDocument(
    DB, COL.DOCUMENTS, ID.unique(),
    {
      authorId,
      title: 'Untitled',
      subtitle: '',
      slug: 'untitled-' + Date.now(),
      version: 'v1.0.0',
      status: 'draft',
      order: 0,
      groupTitle: 'Getting Started',
    },
    // Permissions: only the author can read/update/delete
    [
      Permission.read(Role.user(authorId)),
      Permission.update(Role.user(authorId)),
      Permission.delete(Role.user(authorId)),
    ],
  );
  return doc.$id;
};
```

### Adding a block

```ts
const addBlock = async (type: BlockType, documentId: string, authorId: string) => {
  const order = blocks.length;
  const doc = await databases.createDocument(
    DB, COL.BLOCKS, ID.unique(),
    { documentId, type, text: BLOCK_DEFAULTS[type], order },
    [
      Permission.read(Role.user(authorId)),
      Permission.update(Role.user(authorId)),
      Permission.delete(Role.user(authorId)),
    ],
  );
  const newBlock: Block = { id: doc.$id, type, text: doc.text };
  setBlocks((bs) => [...bs, newBlock]);
  setSelectedBlock(doc.$id);
};
```

### `submitDoc` — creating a submission

Replace the current optimistic `enqueue` with a real Appwrite write:

```ts
const submitDoc = async (documentId: string, authorId: string, user: Models.User) => {
  // 1. Create the submission document
  const sub = await databases.createDocument(
    DB, COL.SUBMISSIONS, ID.unique(),
    {
      name:       docTitle,
      author:     user.name,
      authorId:   authorId,
      initials:   (docTitle || 'U').slice(0, 2).toUpperCase(),
      color:      '#FF4438',
      cat:        'Utilities',             // from PublishPanel form
      version:    'v1.0.0',               // from PublishPanel form
      desc:       docSubtitle,
      links:      [],                      // from PublishPanel form
      status:     'pending',
      documentId: documentId,
    },
    [
      Permission.read(Role.user(authorId)),
      Permission.read(Role.label('admin')),
      Permission.update(Role.label('admin')),
    ],
  );
  // 2. Update document status to 'submitted'
  await databases.updateDocument(DB, COL.DOCUMENTS, documentId, {
    status: 'submitted',
  });
  // 3. Update local admin queue (optimistic UI)
  enqueue({ ...sub, id: sub.$id, mine: true, status: 'pending' } as QueueItem);
  setSubmitted(sub.$id);
};
```

---

## 11. Admin Page — `useAdmin`

### Fetching the queue

```ts
// src/hooks/useAdmin.ts  (full replacement excerpt)
import { databases, realtime, DB, COL } from '../lib/appwrite';
import { Query } from 'appwrite';

export function useAdmin() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  // ...

  // Initial fetch
  useEffect(() => {
    databases.listDocuments(DB, COL.SUBMISSIONS, [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ]).then((res) => {
      setQueue(res.documents.map(mapSubmission));
    });
  }, []);

  // Realtime — subscribe to new/updated submissions
  useEffect(() => {
    const unsub = realtime.subscribe(
      `databases.${DB}.collections.${COL.SUBMISSIONS}.documents`,
      (event) => {
        const doc = event.payload as Models.Document;
        setQueue((q) => {
          const existing = q.findIndex((x) => x.id === doc.$id);
          if (existing >= 0) {
            const updated = [...q];
            updated[existing] = mapSubmission(doc);
            return updated;
          }
          return [mapSubmission(doc), ...q];
        });
      },
    );
    return unsub;
  }, []);

  // ...
}
```

### `setStatus` — persisting a decision

```ts
const setStatus = useCallback(async (id: string, status: SubmissionStatus) => {
  // Optimistic update
  setQueue((q) => q.map((x) => (x.id === id ? { ...x, status } : x)));

  // Persist to Appwrite
  await databases.updateDocument(DB, COL.SUBMISSIONS, id, {
    status,
    reviewedAt: new Date().toISOString(),
  });

  // If approved, an Appwrite Function triggers to copy the submission into
  // the `libraries` collection and publish the linked document.
  // See §15 — Appwrite Functions.
}, []);
```

### Submission mapper

```ts
// src/lib/mappers.ts  (add alongside mapLibrary)
import type { Models } from 'appwrite';
import type { QueueItem } from '../types/admin';

export function mapSubmission(doc: Models.Document): QueueItem {
  return {
    id:        doc.$id,
    name:      doc.name,
    author:    doc.author,
    authorId:  doc.authorId,
    initials:  doc.initials,
    color:     doc.color,
    cat:       doc.cat,
    version:   doc.version,
    submitted: formatRelativeTime(doc.$createdAt),
    status:    doc.status,
    desc:      doc.desc,
    links:     doc.links ?? [],
    mine:      false,  // set to true when authorId === current user $id
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

## 12. Storage (Library Avatars)

### Create a bucket

**Storage** → **Create Bucket**:

- **Name**: `avatars`
- **File size limit**: 512 KB
- **Allowed file extensions**: `jpg`, `jpeg`, `png`, `webp`
- **Permissions**: `role:any` can read. `role:member` can create. Appwrite Functions can delete.

### Upload an avatar

```ts
import { storage, BUCKET } from '../lib/appwrite';
import { ID } from 'appwrite';

async function uploadAvatar(file: File): Promise<string> {
  const result = await storage.createFile(BUCKET, ID.unique(), file);
  return result.$id;  // store this as `avatarFileId` on the library document
}
```

### Render an avatar URL

```ts
function getAvatarUrl(fileId: string): string {
  return storage.getFilePreview(
    BUCKET,
    fileId,
    128,  // width
    128,  // height
    'center',
    80,   // quality
  ).href;
}
```

Use `getAvatarUrl` in `Avatar.tsx` when a `fileId` prop is provided, falling back to the colored initials avatar.

---

## 13. Realtime Subscriptions

Appwrite Realtime uses a single persistent WebSocket. Subscribe to collection channels:

```ts
// Subscribe to all documents in a collection
realtime.subscribe(
  `databases.${DB}.collections.${COL.SUBMISSIONS}.documents`,
  callback,
);

// Subscribe to a specific document
realtime.subscribe(
  `databases.${DB}.collections.${COL.BLOCKS}.documents.${blockId}`,
  callback,
);
```

**Event types** in `event.events`:
- `databases.*.collections.*.documents.*.create`
- `databases.*.collections.*.documents.*.update`
- `databases.*.collections.*.documents.*.delete`

**Where to use realtime in StackBrix**:

| Feature | Channel | Why |
|---|---|---|
| Admin queue | `submissions` collection | Show new submissions instantly without polling |
| Editor (collaborative) | specific `blocks` document | Future: multi-cursor live editing |
| Hub page | `libraries` collection | Reflect newly approved libraries without refresh |

Always call the returned unsubscribe function in a `useEffect` cleanup.

---

## 14. Appwrite Permissions Model

Appwrite uses document-level permissions. Every document gets a `permissions` array at creation time.

### Permission helpers

```ts
import { Permission, Role } from 'appwrite';

// Any visitor can read
Permission.read(Role.any())

// Any logged-in user can create
Permission.create(Role.users())

// Only a specific user
Permission.read(Role.user(userId))
Permission.update(Role.user(userId))
Permission.delete(Role.user(userId))

// Custom label (assign via Appwrite console or Function)
Permission.read(Role.label('admin'))
Permission.update(Role.label('admin'))
```

### Assigning the `admin` label

Moderators need the `admin` label on their Appwrite user account. Do this from the Appwrite console:

**Users** → select user → **Labels** → add `admin`.

Or programmatically from an Appwrite Function (with API key):

```js
const { Users } = require('node-appwrite');
await users.updateLabels(userId, ['admin']);
```

### Recommended permissions per collection

| Collection | Any reads | Member creates | Owner updates | Admin full access |
|---|---|---|---|---|
| `libraries` | ✓ (published only via query) | — | — | ✓ |
| `submissions` | — | ✓ | ✓ own | ✓ |
| `documents` | ✓ (published) | ✓ | ✓ own | ✓ |
| `blocks` | ✓ (via published document) | ✓ | ✓ own | ✓ |
| `categories` | ✓ | — | — | ✓ (via Function only) |

---

## 15. Appwrite Functions (Server Logic)

Appwrite Functions run Node.js (or Deno/Python) server-side with a full API key — no user permission restrictions.

### Function 1: `on-submission-approved`

**Trigger**: Database event → `submissions` collection → `update` event where `status === 'approved'`

**What it does**:
1. Reads the updated `submission` document.
2. Creates a new document in the `libraries` collection using the submission data.
3. Updates the linked `documents` document `status` to `published`.
4. Increments the `count` on the matching `categories` document.
5. Sends a notification to the author (Appwrite Messaging or email via SMTP function).

```js
// functions/on-submission-approved/src/main.js
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new Databases(client);
  const payload = JSON.parse(req.body);

  if (payload.status !== 'approved') return res.send('Not approved, skipping');

  // 1. Create library document
  const lib = await db.createDocument(
    process.env.DATABASE_ID,
    process.env.COL_LIBRARIES,
    ID.unique(),
    {
      name:         payload.name,
      author:       payload.author,
      authorId:     payload.authorId,
      cat:          payload.cat,
      desc:         payload.desc,
      tags:         payload.tags ?? [],
      version:      payload.version,
      stars:        0,
      installs:     0,
      color:        payload.color,
      initials:     payload.initials,
      submissionId: payload.$id,
    },
    [Permission.read(Role.any())],
  );

  // 2. Publish the linked document
  if (payload.documentId) {
    await db.updateDocument(
      process.env.DATABASE_ID,
      process.env.COL_DOCUMENTS,
      payload.documentId,
      { status: 'published', libraryId: lib.$id },
      [Permission.read(Role.any()), Permission.update(Role.user(payload.authorId))],
    );
  }

  // 3. Increment category count
  const cats = await db.listDocuments(
    process.env.DATABASE_ID,
    process.env.COL_CATEGORIES,
    [`equal("slug", "${payload.cat}")`],
  );
  if (cats.documents.length > 0) {
    const cat = cats.documents[0];
    await db.updateDocument(
      process.env.DATABASE_ID,
      process.env.COL_CATEGORIES,
      cat.$id,
      { count: cat.count + 1 },
    );
  }

  log(`Library created: ${lib.$id}`);
  return res.send('OK');
};
```

### Function 2: `sync-github-stats`

**Trigger**: Schedule (CRON) — e.g. `0 */6 * * *` (every 6 hours)

**What it does**:
1. Lists all documents in the `libraries` collection that have a `githubUrl`.
2. Calls the GitHub REST API (`GET /repos/{owner}/{repo}`) for each.
3. Updates the `stars` field on the Appwrite document.

Keep this within GitHub's API rate limits (60 req/hour unauthenticated, 5000 with a token).

### Deploying functions

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login
appwrite login

# Deploy a function
appwrite deploy function --functionId on-submission-approved
```

Set environment variables per function in the Appwrite console under **Functions → Settings → Variables**.

---

## 16. Deployment Checklist

### Frontend (Vite → static hosting)

```bash
npm run build           # outputs to dist/
```

Deploy `dist/` to **Cloudflare Pages**, **Vercel**, or **Netlify**.

Set these environment variables in your host's dashboard (same as `.env.local` but without file):

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

Add your production domain as a **Web Platform** in Appwrite (same step as localhost in §3.2).

### Appwrite (self-hosted)

If self-hosting, use the official Docker Compose setup. Minimum recommended:

- 2 vCPU, 4 GB RAM for the Appwrite container
- Separate MariaDB + Redis containers (included in the Compose file)
- Reverse proxy (Traefik or nginx) with TLS termination
- `_APP_DOMAIN` + `_APP_DOMAIN_TARGET` env vars set to your domain

### Security hardening

1. **Never expose your Appwrite API key** to the frontend. API keys bypass all permission checks. They belong only in Appwrite Functions or your own server.
2. **Set collection-level attribute limits** (max string length, required flags) — this prevents oversized payloads.
3. **Enable rate limiting** in Appwrite console (Auth → Security) to slow brute-force login attempts.
4. **Rotate API keys** used by Functions periodically. Create function-scoped keys with only the scopes that function needs.
5. **Use HTTPS everywhere.** Appwrite's session cookie is `SameSite=Strict` and `Secure` by default — it won't work over plain HTTP in production.
6. **Validate content server-side** in your approval Function: check that `desc` length, `version` format, and `links` are safe before writing to `libraries`.
