import fs from 'node:fs';
const [publisher, repository] = process.argv.slice(2);
if (!publisher || !/^[a-z0-9][a-z0-9-]*$/i.test(publisher)) throw new Error('Supply the real Marketplace publisher ID: npm run release:configure -- PUBLISHER_ID https://github.com/OWNER/REPOSITORY');
const url = new URL(repository);
if (url.protocol !== 'https:' || url.hostname !== 'github.com' || !/^\/[\w.-]+\/[\w.-]+\/?$/.test(url.pathname) || url.username || url.password || url.search || url.hash)
  throw new Error('Supply the actual GitHub repository HTTPS URL without credentials, query or fragment.');
const canonical = `https://github.com${url.pathname.replace(/\/$/, '').replace(/\.git$/, '')}`;
const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
manifest.publisher = publisher;
manifest.repository = { type: 'git', url: `${canonical}.git` };
manifest.homepage = `${canonical}#readme`;
manifest.bugs = { url: `${canonical}/issues` };
fs.writeFileSync('package.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Configured supplied publisher and repository metadata. Version and theme/icon contributions are unchanged. Nothing was published.');
