# soajs.website

Source for www.soajs.org: the marketing pages and the SOAJS documentation. It replaces the 2015–2020 AngularJS site in `soajs.website.ui`.

Built with [Astro](https://astro.build) 7 and [Starlight](https://starlight.astro.build) for the docs. The output is plain static HTML in `dist/`.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
```

Requires Node.js 22.12 or later.

## Layout

| Path | What it is |
|---|---|
| `src/pages/` | Marketing pages: home, platform, built on SOAJS, releases, open source, 404 |
| `src/content/docs/docs/` | Documentation (Markdown). Each file becomes `/docs/<path>/` |
| `src/data/platforms.ts` | Products built on SOAJS, used by the home page and `/built-on-soajs/` |
| `src/data/versions.json` | Release manifest that `/releases/` is generated from |
| `src/layouts/`, `src/components/`, `src/styles/` | Shared layout, header, footer and styles |
| `astro.config.mjs` | Site URL, Starlight config and docs sidebar |
| `soa.json` | SOAJS descriptor: deploys `dist/` as a static resource |

## Updating content

- **Releases**: run `npm run sync:versions` to pull the latest `versions.json` from `soajs/soajs.installer.versions`, then rebuild.
- **Built on SOAJS**: edit `src/data/platforms.ts`. Only publish facts the product owner has approved; keep customer names, vendors and deployment details out.
- **Docs**: add a Markdown file under `src/content/docs/docs/<section>/`. The sidebar is generated per section; order with `sidebar.order` in frontmatter.

## Deploy

The site is hosted on Cloudflare Pages: project `soajs`, which serves `www.soajs.org`. Log in once with `wrangler login`, and set `CLOUDFLARE_ACCOUNT_ID` to the account that owns the project if your login has access to more than one.

```sh
npm run deploy:preview      # https://v2-preview.soajs.pages.dev, production untouched
npm run deploy:production   # www.soajs.org
```

Roll back from the Cloudflare dashboard: Pages → soajs → Deployments → pick a previous production deployment → Rollback.

`public/_redirects` maps the old site's routes to their new pages, and `public/_headers` sets caching and security headers. `dist/` can also be served as a SOAJS static resource (see `soa.json`).
