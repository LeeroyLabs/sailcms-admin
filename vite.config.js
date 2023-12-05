import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import ViteYaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
	plugins: [sveltekit(), purgeCss(), ViteYaml()],
	build: {
		minify: true,
		cssCodeSplit: true
	},
	resolve: {
		alias: {
			"@components": path.resolve(__dirname, "/src/components"),
			"@directives": path.resolve(__dirname, "/src/directives"),
			"@graphql": path.resolve(__dirname, "/src/graphql"),
			"@helpers": path.resolve(__dirname, "/src/helpers"),
			"@stores": path.resolve(__dirname, "/src/stores"),
			"@data": path.resolve(__dirname, "/src/data"),
			"@": path.resolve(__dirname, "/src")
		}
	}
});
