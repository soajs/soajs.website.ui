// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// This repo lives under /opt/soajs/node_modules/, and Vite's watcher always
// ignores '**/node_modules/**', so it never sees edits here. Watch src/
// ourselves and forward events to Vite so dev-server reload keeps working.
function watchSrc() {
	return {
		name: 'soajs-watch-src',
		/** @param {import('vite').ViteDevServer} server */
		configureServer(server) {
			const root = fileURLToPath(new URL('./src/', import.meta.url));
			const hot = server.environments?.client?.hot ?? server.ws;
			/** @type {NodeJS.Timeout | undefined} */
			let reload;
			const watcher = fs.watch(root, { recursive: true }, (event, file) => {
				if (!file) return;
				const abs = path.join(root, file.toString());
				const exists = fs.existsSync(abs);
				server.watcher.emit(event === 'rename' ? (exists ? 'add' : 'unlink') : 'change', abs);
				// Vite does not push HMR for files outside its own watcher, so reload open tabs.
				clearTimeout(reload);
				reload = setTimeout(() => hot.send({ type: 'full-reload', path: '*' }), 150);
			});
			server.httpServer?.on('close', () => watcher.close());
		},
	};
}

// Marketing pages live in src/pages; documentation is served by Starlight
// from src/content/docs/docs/** so that every doc URL sits under /docs/.
export default defineConfig({
	site: 'https://www.soajs.org',
	trailingSlash: 'ignore',
	vite: { plugins: [watchSrc()] },
	integrations: [
		starlight({
			title: 'SOAJS Docs',
			description: 'Documentation for SOAJS, the open-source multi-tenant API gateway and microservice platform.',
			logo: { light: './src/assets/soajs-logo.png', dark: './src/assets/soajs-logo-white.png', replacesTitle: true, alt: 'SOAJS' },
			favicon: '/favicon.png',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/soajs' }],
			disable404Route: true,
			customCss: ['./src/styles/docs.css'],
			sidebar: [
				{ label: 'Introduction', link: '/docs/' },
				{ label: 'Getting started', items: [{ autogenerate: { directory: 'docs/getting-started' } }] },
				{ label: 'Concepts', items: [{ autogenerate: { directory: 'docs/concepts' } }] },
				{ label: 'Security', items: [{ autogenerate: { directory: 'docs/security' } }] },
				{ label: 'Traffic', items: [{ autogenerate: { directory: 'docs/traffic' } }] },
				{ label: 'SDKs', items: [{ autogenerate: { directory: 'docs/sdks' } }] },
				{ label: 'Deploy', items: [{ autogenerate: { directory: 'docs/deploy' } }] },
			],
		}),
	],
});
