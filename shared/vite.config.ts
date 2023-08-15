import * as path from 'path';

import { getBaseConfig } from '../vite.config';

export default getBaseConfig({
    build: {
        outDir: path.resolve(__dirname, 'lib'),
    },
});
