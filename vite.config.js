import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import * as packageJson from './package.json'
import libCss from 'vite-plugin-libcss';

import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob';

import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

const customCopyPlugin = () => {
	return {
		name: 'custom-copy-plugin',
		writeBundle: async () => {
			const filesToCopy = glob.sync('src/components/**/system.json');
			const distDir = 'dist/components';

			await Promise.all(filesToCopy.map(async file => {
				const relativePath = path.relative('src/components', file);
				const destPath = path.join(distDir, relativePath);

				await fs.mkdir(path.dirname(destPath), { recursive: true });

				await fs.copyFile(file, destPath.replace('/', '\\'));
			}));
		}
	};
}

export default defineConfig(() => ({
	plugins: [
		customCopyPlugin(),
		libCss(),
		react(),
	],
	build: {
		lib: {
			entry: resolve('src', 'library.js'),
			name: '@intenda/opus-ui-code-editor',
			formats: ['es'],
			fileName: () => `lib.js`,
		},
		rollupOptions: {
			output: {
				assetFileNames: 'lspconfig.json',
			},
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
