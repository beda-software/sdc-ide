import { RemoteDataResult } from '@beda.software/remote-data';
import { Parameters, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { createContext } from 'react';
import { QRFormWrapper } from 'web/src/components/QRFormWrapper';
import { assemble, populate } from 'web/src/services/sdc';

import { QRFWrapper } from './types';

type AssembleService = (qId: string) => Promise<RemoteDataResult<Questionnaire>>;
type PopulateService = (
    launchContext: Parameters,
) => Promise<RemoteDataResult<QuestionnaireResponse>>;

interface SDCContextType {
    assemble: AssembleService;
    populate: PopulateService;
}

export const FormRenderContext = createContext<QRFWrapper>(QRFormWrapper);
export const SDCContext = createContext<SDCContextType>({ assemble, populate });
