/* eslint-disable max-lines-per-function */

import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import * as packageJson from './package.json';
import libCss from 'vite-plugin-libcss';

import { promises as fs } from 'fs';
import path from 'path';

import { pathToFileURL } from 'url';

import fixReactVirtualized from 'esbuild-plugin-react-virtualized';

// A helper function to recursively get all files in a directory.
const getAllFiles = async dir => {
	let files = [];
	const dirents = await fs.readdir(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const fullPath = path.join(dir, dirent.name);
		if (dirent.isDirectory())
			files = files.concat(await getAllFiles(fullPath));
		else
			files.push(fullPath);
	}

	return files;
};

const customCopyPlugin = () => {
	return {
		name: 'custom-copy-plugin',
		writeBundle: async () => {
			const copyFiles = async (srcDir, distDir, pattern) => {
				let filesToCopy = [];
				if (pattern.includes('*')) {
					//Assume the pattern means "copy all files under srcDir"
					filesToCopy = await getAllFiles(srcDir);
				} else {
					//Treat as a literal path (relative to srcDir if provided)
					filesToCopy = [srcDir ? path.join(srcDir, pattern) : pattern];
				}

				await Promise.all(
					filesToCopy.map(async filePath => {
						//Compute the relative path from the srcDir, if provided.
						const relativePath = srcDir
							? path.relative(srcDir, filePath)
							: path.basename(filePath);
						const destPath = path.join(distDir, relativePath);

						const stat = await fs.lstat(filePath);
						if (stat.isDirectory())
							await fs.mkdir(destPath, { recursive: true });
						else {
							await fs.mkdir(path.dirname(destPath), { recursive: true });
							await fs.copyFile(filePath, destPath);
						}
					})
				);
			};

			await copyFiles('src/components', 'dist/components', 'src/components/**/*');
			await copyFiles('', 'dist', 'lspconfig.json');
		}
	};
};

async function fileExists (path) {
	try {
		await fs.access(path);

		return true;
	} catch {
		return false;
	}
}

const ReactCompilerConfig = { target: '19' };

export default defineConfig(async () => {
	let monorepoAliases = {};
	let monorepoWatchPaths = [];

	const monorepoConfigPath = path.resolve(__dirname, './vite.monorepo.config.js');

	if (await fileExists(monorepoConfigPath)) {
		try {
			const monorepoConfigUrl = pathToFileURL(monorepoConfigPath).href;
			const monoRepoConfig = await import(monorepoConfigUrl);
			const monorepoAliasNames = monoRepoConfig.default;

			monorepoAliasNames.forEach(aliasName => {
				const aliasPath = path.resolve(__dirname, `../${aliasName}`);
				monorepoAliases[aliasName] = aliasPath;
			});

			monorepoWatchPaths = Object.values(monorepoAliases).map(
				aliasPath => `!${aliasPath}/**`
			);
		} catch (e) {
			console.error('Error loading monorepo config:', e);
		}
	}

	return {
		plugins: [
			libCss(),
			customCopyPlugin(),
			react({
				babel: {
					compact: true,
					plugins: [
						['babel-plugin-react-compiler', ReactCompilerConfig]
					]
				}
			})
		],
		build: {
			lib: {
				entry: resolve('src', 'library.js'),
				name: '@intenda/opus-ui-repeater-grid',
				formats: ['es'],
				fileName: () => 'lib.js'
			},
			rollupOptions: { external: [...Object.keys(packageJson.peerDependencies)] }
		},
		optimizeDeps: {
			esbuildOptions: {
				loader: { '.js': 'jsx' },
				plugins: [
					fixReactVirtualized
				]
			}
		},
		resolve: { alias: monorepoAliases },
		server: { watch: { ignored: monorepoWatchPaths } }
	};
});
