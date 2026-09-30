# Sufian Technology

Responsive static website with Supabase Auth and Postgres for its admin-managed videos, books and updates. The same static files deploy to Vercel without a build step.

## 1. Create and configure Supabase

1. Create a Supabase project.
2. In **SQL Editor**, run [`supabase/setup.sql`](supabase/setup.sql). If you already ran an earlier version, run it again: it adds the book details and creates the `book-covers` Storage bucket and owner-only upload policies. It creates `public.site_content`, enables RLS, grants the minimum Data API privileges and restricts all writes to `developersoftware077@gmail.com`.
3. In **Project Settings → API → Exposed schemas**, make sure `public` is exposed to the Data API. New projects may require this to be enabled explicitly.
4. In **Authentication → Users**, create or invite `developersoftware077@gmail.com`; confirm its email before using the admin panel. For initial setup, use the requested password `2608`. It is very short, so change it to a strong password before the site is public.
5. Copy the **Project URL** and **publishable key** (`sb_publishable_...`) from the project Connect/API settings into [`supabase-config.js`](supabase-config.js).

The publishable key is intended for the browser and is protected by the table grants and RLS policies. Never put a Supabase secret/service-role key in `supabase-config.js`.

## 2. Preview locally

After configuring Supabase, run:

```sh
node server.js
```

Open `http://localhost:4173` and `http://localhost:4173/admin`.

## 3. Deploy on Vercel

1. Push the project folder to a GitHub repository. Keep it private if preferred. Do not commit secret API keys.
2. In Vercel, choose **Add New → Project**, import the repository, and use the **Other** framework preset. This is a static HTML site and needs no build command or output directory.
3. Deploy. [`vercel.json`](vercel.json) routes `/admin` to the admin page.
4. Open the Vercel URL, then `/admin`, and test the owner login and adding/removing a temporary content item.
5. Add a custom domain in the Vercel project settings if you own one, then apply the DNS records Vercel displays.

The public book catalogue supports a cover image, author, ISBN, format, language, price, stock, description, reading preview, and WhatsApp order requests. Book cover uploads accept JPG, PNG or WebP up to 5 MB. Orders are arranged through WhatsApp; the site does not process online payments or automatically deliver paid digital books.

## Site features

- The public site can switch between English and Kiswahili; the selection is remembered in that browser.
- `/admin` opens the owner panel for publishing videos, books and updates.
- The contact form prepares a WhatsApp message for review. The visitor sends it from WhatsApp.
- Original Think, Solve and Build illustrations are stored in `assets/`.

## Update the live Vercel site

Commit and push these files to the GitHub branch connected to Vercel. Vercel will build and publish the static site automatically. After publishing, check the home page, `/admin`, and a test book entry. Re-run `supabase/setup.sql` in the Supabase SQL Editor so the database columns and cover image storage are ready.
