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
