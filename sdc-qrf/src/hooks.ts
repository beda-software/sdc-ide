import { useContext } from 'react';

import { QRFContext } from './context';

export function useQuestionnaireResponseFormContext() {
    return useContext(QRFContext);
}
