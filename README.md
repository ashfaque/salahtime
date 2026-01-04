This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## To clone the repository

```bash
git clone --recurse-submodules <repository-url>
```

If you have already cloned the repository without the `--recurse-submodules` flag, you can initialize and update the submodules with the following commands:

```bash
git submodule init
git submodule update
```
Replace `<repository-url>` with the actual URL of your repository.

---

## Migrating from `npm` to `pnpm`
If you are migrating from `npm` to `pnpm`, follow these steps:
```bash
rm -rf node_modules
git rm package-lock.json
pnpm install
```

| Action | Old `npm` Command | ✅ New `pnpm` Command |
| :--- | :--- | :--- |
| **Run your app** | `npm run dev` | `pnpm run dev` (or just `pnpm dev`) |
| **Install a package** | `npm install react` | `pnpm add react` |
| **Install dev package**| `npm install -D tailwindcss` | `pnpm add -D tailwindcss` |
| **Uninstall a package**| `npm uninstall react` | `pnpm remove react` |
| **Install all packages**| `npm install` | `pnpm install` |
| **Update packages**| `npm update` | `pnpm update` |

---

## Naming Conventions in the App Router of Next.js
This table breaks down what **must** be named a certain way (Strict) versus what you can name yourself (Flexible).

| Category | Convention (The "Thing") | The Strict Rule 📏 | Example / Purpose 💡 | Flexibility? (Your Code) 🧑‍💻 |
| :--- | :--- | :--- | :--- | :--- |
| **UI Files** 🖥️ | `page.tsx` | File *must* be named `page.tsx`. | **Makes a route public.** `app/about/page.tsx` → `/about` | **Flexible.** `export default function MyAboutPage()` |
| | `layout.tsx` | File *must* be named `layout.tsx`. | **Creates a shared, persistent UI "frame".** Must accept `children`. | **Flexible.** `export default function MainLayout({ children })` |
| | `loading.tsx` | File *must* be named `loading.tsx`. | **Automatic loading UI** (spinner, skeleton) for the route. | **Flexible.** `export default function MySpinner()` |
| | `error.tsx` | File *must* be named `error.tsx`. Must be a Client Component (`'use client'`). | **Automatic error boundary.** Catches errors in the route. | **Flexible.** `export default function MyErrorUI({ error, reset })` |
| | `not-found.tsx` | File *must* be named `not-found.tsx`. | **Shows a 404 page.** Triggered by `notFound()` or a bad URL. | **Flexible.** `export default function MyCustom404()` |
| | `template.tsx` | File *must* be named `template.tsx`. | **Rarely used.** Like a layout, but *re-mounts* on every navigation. | **Flexible.** `export default function MyTemplate({ children })` |
| | `default.tsx` | File *must* be named `default.tsx`. (Advanced) | **Fallback UI** for Parallel Routes on initial load. | **Flexible.** `export default function MySlotFallback()` |
| **Routing Folders** 📁 | `[folderName]` | Folder name *must* be in `[brackets]`. | **Dynamic Segment.** `app/blog/[slug]` → `/blog/post-1` | **Flexible.** The name inside (`slug`, `id`) becomes your `params` prop key. |
| | `(folderName)` | Folder name *must* be in `(parentheses)`. | **Route Group.** Organizes files *without* affecting the URL. `app/(marketing)/about` → `/about` | **Flexible.** The name inside (`marketing`, `shop`) is just for you. |
| | `_folderName` | Folder name *must* start with `_`. | **Private Folder.** Opts the folder *out* of routing. `app/_components/Button.tsx` → (Not a URL) | **Flexible.** The name after the `_` (`_components`, `_lib`) is up to you. |
| | `@folderName` | Folder name *must* start with `@`. (Advanced) | **Parallel Route Slot.** Renders another page in the same layout. | **Flexible.** The name after `@` (`@modal`, `@team`) becomes a prop in `layout.tsx`. |
| **API Logic** ⚡ | `route.ts` | File *must* be named `route.ts` (or `.js`). | **Creates a backend API endpoint,** not a UI page. | **Not Flexible.** This filename is the rule. |
| | `GET`, `POST`, `DELETE`, ... | Function names *inside* `route.ts`. | **Named exports** that match HTTP verbs. | **Not Flexible at All.** You *must* use `export async function GET()` etc. **No `default` export!** |

## Dynamic Routes of Next.js App Router - UI(Frontend)

| Concept | The "OOP Way" | The "Next.js Way" (Functional) | Scalable Best Practice & Why 💡 |
| :--- | :--- | :--- | :--- |
| **Core Philosophy** | **Inheritance.** Logic is shared by "extending" a base class. | **Composition.** Logic is shared by "wrapping" components. | **Always choose composition.** Wrapping a page in a layout (`<Layout>{children}</Layout>`) is more flexible and easier to debug than a deep inheritance chain. |
| **How Routes are Made** | A central `urls.py` file maps URLs to `Views` (classes). | A **folder** in `/app` becomes a URL segment. | **Rule \#1: A folder only becomes a public URL if it has a `page.tsx` file inside it.** No `page.tsx`, no route. It's that simple. |
| **Project Structure** | **Type-Based.** All views together, all models together. (`/views`, `/models`) | **Feature-Based.** All files for one feature are co-located. | **Use a "Feature-Based" (or "Domain") structure.** Create `/app/_features/auth`, `/app/_features/payments`, etc. Put the components, hooks, and logic for *that feature* inside. This is massively maintainable. |
| **Internal Logic Folders** | Any folder *not* in `urls.py` is internal. | Any folder *without* a `page.tsx` is internal. | **Use Private Folders (`_folderName`).** Create `_components`, `_hooks`, `_lib` (or put them inside `_features`). The `_` clearly signals to your team "This is not a route," and it's 100% ignored by the router. |
| **Internal Folder URL?** | `my-app.com/models/` → **404** | `my-app.com/_components/` → **404** | **This is safe.** You can have `app/_components/Button.tsx` and `app/dashboard/page.tsx` side-by-side. You `import` the button; it *never* becomes a URL. |
| **State Management** | State lives on the object (`self.user`, `this.state`). | State is decoupled from the UI via Hooks (`useState`, `useReducer`). | **1. Local State:** Use `useState` for state inside one component (e.g., "is modal open?"). <br> **2. Global State:** Use a store like **Zustand** for state needed everywhere (e.g., "current user"). It's simple and avoids "prop drilling." |
| **Backend / Business Logic** | Everything is a `class` (Views, Serializers, Services). | API endpoints are functions (`export async function GET()`). | **Use OOP for server-side logic\!** This is the "best of both worlds." Create a `class UserService` in `app/_features/users/lib/service.ts` and `import` it into your Server Components or `route.ts` files to handle complex database logic. |

---

## Environment Variables for Next.js (Frontend Only)
Next.js requires you to prefix your environment variables with `NEXT_PUBLIC_` to make them accessible on the frontend. Else they will only be available on the server side. And when used in the frontend, will return `undefined`.

This project uses a frontend-only Next.js architecture. API keys are exposed to the browser, so strict security measures are required.

| Phase | Location | Naming Convention | Action Required |
| --- | --- | --- | --- |
| **Local Dev** | `.env.local` | `NEXT_PUBLIC_API_KEY=value` | **Do not commit.** Add this file to `.gitignore`. |
| **Code Usage** | `src/...` | `process.env.NEXT_PUBLIC_API_KEY` | Must use `NEXT_PUBLIC_` prefix to be visible in browser. |
| **Prod (Store)** | GitHub Repo → Settings → Secrets | Name: `NEXT_PUBLIC_API_KEY` | Paste the raw key value here. |
| **Prod (Build)** | `.github/workflows/deploy.yml` | `env:` section | Map the secret to the variable (see snippet below). |
| **Security** | **External API Dashboard** | N/A | **Mandatory:** Restrict key usage to `your-username.github.io`. |

---

