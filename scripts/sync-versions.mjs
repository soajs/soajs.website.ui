// Refreshes src/data/versions.json from the published release manifest.
// Usage: npm run sync:versions
import { writeFile } from 'node:fs/promises';

const SOURCE = 'https://raw.githubusercontent.com/soajs/soajs.installer.versions/master/versions.json';
const TARGET = new URL('../src/data/versions.json', import.meta.url);

const res = await fetch(SOURCE);
if (!res.ok) {
	console.error(`Failed to fetch ${SOURCE}: ${res.status}`);
	process.exit(1);
}
const data = await res.json();
if (!Array.isArray(data.releases) || !data.latest) {
	console.error('Unexpected manifest shape: missing releases or latest');
	process.exit(1);
}
await writeFile(TARGET, JSON.stringify(data, null, 2) + '\n');
console.log(`versions.json updated: latest ${data.latest} ${data.patch}, ${data.releases.length} releases`);
