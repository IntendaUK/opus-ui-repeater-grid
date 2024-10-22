import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import * as packageJson from './package.json'
import libCss  from 'vite-plugin-libcss';

import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob';

import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

const customCopyPlugin = () => {
	return {
		name: 'custom-copy-plugin',
		writeBundle: async () => {
			const copyFiles = async (srcDir, distDir, globPattern) => {
				const filesToCopy = glob.sync(globPattern);

				await Promise.all(filesToCopy.map(async dirent => {
					const relativePath = path.relative(srcDir, dirent);
					const destPath = path.join(distDir, relativePath);

					if ((await fs.lstat(dirent)).isDirectory()) {
						await fs.mkdir(destPath, { recursive: true });
					} else {
						await fs.mkdir(path.dirname(destPath), { recursive: true });

						await fs.copyFile(dirent, destPath);
					}
				}));
			};


			await copyFiles('src/components', 'dist/components', 'src/components/**/*');
			await copyFiles('', 'dist', 'lspconfig.json');
		}
	};
}

export default defineConfig(() => ({
	plugins: [
		libCss(),
		customCopyPlugin(),
		react(),
	],
	build: {
		lib: {
			entry: resolve('src', 'library.js'),
			name: '@intenda/opus-ui-repeater-grid',
			formats: ['es'],
			fileName: () => `lib.js`,
		},
		rollupOptions: {
			external: [...Object.keys(packageJson.peerDependencies)],
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			plugins: [
				fixReactVirtualized
			]
		}
	}
}));
