import * as React from 'react';

import { QRFContextData } from './types';

export const QRFContext = React.createContext<QRFContextData>({} as any);
