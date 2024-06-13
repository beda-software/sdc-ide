import { createRequire } from 'module';

import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export const getBaseConfig = ({ plugins = [], build = {}, test = {} }) =>
    defineConfig(({ command }) => ({
        server: {
            port: command === 'build' ? 5000 : 3001,
        },
        plugins: [
            viteCommonjs(),
            react({
                babel: {
                    plugins: ['macros'],
                },
            }),
            ...plugins,
        ],
        define: command === 'build' ? {} : { global: {} },
        build: {
            commonjsOptions: {
                defaultIsModuleExports(id) {
                    try {
                        const module = require(id);
                        if (module?.default) {
                            return false;
                        }
                        return 'auto';
                    } catch (error) {
                        return 'auto';
                    }
                },
                transformMixedEsModules: true,
            },
            ...build,
        },
        test,
    }));
