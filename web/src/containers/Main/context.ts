import { createContext } from 'react';
import { QRFormWrapper } from 'web/src/components/QRFormWrapper';
import { RemoteDataResult } from '@beda.software/remote-data';

import { Parameters, Questionnaire, QuestionnaireResponse } from "fhir/r4b";
import { QRFWrapper } from './types';
import { assemble, populate } from 'src/services/sdc';

type AssembleService = (qId:string) => Promise<RemoteDataResult<Questionnaire>>
type PopulateService = (launchContext:Parameters) => Promise<RemoteDataResult<QuestionnaireResponse>>

interface SDCContextType {
    assemble: AssembleService
    populate: PopulateService
}

export const FormRenderContext = createContext<QRFWrapper>(QRFormWrapper);
export const SDCContext = createContext<SDCContextType>({ assemble, populate })
