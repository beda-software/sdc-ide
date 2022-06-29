import { createContext } from 'react';

import { QRFContextData } from './types';

export const QRFContext = createContext<QRFContextData>({} as any);
