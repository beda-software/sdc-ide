import * as path from 'path';

import { getBaseConfig } from '../vite.config';

export default getBaseConfig({
    test: {
        globals: true, // To use the Vitest APIs globally like Jest
        environment: 'jsdom', // https://vitest.dev/config/#environment
        setupFiles: 'src/setupTests.ts', //  https://vitest.dev/config/#setupfiles
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/'),
            name: 'sdc-qrf',
            fileName: 'sdc-qrf',
        },
        outDir: path.resolve(__dirname, 'build'),
    },
});
