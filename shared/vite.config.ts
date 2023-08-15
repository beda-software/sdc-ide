import * as path from 'path';

import { getBaseConfig } from '../vite.config';

export default getBaseConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/'),
            name: 'shared',
            fileName: 'shared',
        },
        outDir: path.resolve(__dirname, 'lib'),
    },
});
