# Sufian Technology

Responsive static website with Supabase Auth and Postgres for its admin-managed videos, books and updates. The same static files deploy to Vercel without a build step.

## 1. Create and configure Supabase

1. Create a Supabase project.
2. In **SQL Editor**, run [`supabase/setup.sql`](supabase/setup.sql). It creates `public.site_content`, enables RLS, grants the minimum Data API privileges and restricts all writes to `developersoftware077@gmail.com`.
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

The public book catalogue supports a description, a reading preview, and WhatsApp order requests. It does not process payments or distribute full paid books.
