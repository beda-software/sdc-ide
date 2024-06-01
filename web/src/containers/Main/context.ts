import { createContext } from 'react';
import { QRFormWrapper } from 'web/src/components/QRFormWrapper';

import { QRFWrapper } from './types';

export const FormRenderContext = createContext<QRFWrapper>(QRFormWrapper);
