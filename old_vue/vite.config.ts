// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import path from "path";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {transformAssetUrls}
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
        vuetify({
            autoImport: true
        }),
        VueI18nPlugin({
            include: [path.resolve(__dirname, "./src/locales/**")]
        })
    ],
    define:  {"process.env": {}},
    resolve: {
        alias:      {
            "@":        fileURLToPath(new URL("./src", import.meta.url)),
            "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js"
        },
        extensions: [
            ".js",
            ".json",
            ".jsx",
            ".mjs",
            ".ts",
            ".tsx",
            ".vue",
            ".yaml"
        ]
    },
    server:  {
        port: 3000
    }
});
