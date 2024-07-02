import { RemoteData } from '@beda.software/remote-data';
import { QuestionnaireResponse, Parameters } from 'fhir/r4b';

import { CursorPosition, ExpressionType } from '../CodeEditor/ContextMenu/types';

export interface ModalExpressionProps {
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    type: ExpressionType;
    expression: string;
    closeExpressionModal: () => void;
    setExpression: (expression: string) => void;
    position?: CursorPosition;
}
