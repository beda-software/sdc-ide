import { QuestionnaireResponse } from 'fhir/r4b';

import { service } from 'fhir-react/lib/services/service';

export const applyMapping = async (
    mappingId: string,
    questionnaireResponse: QuestionnaireResponse,
) => {
    await service({
        method: 'POST',
        url: `/Mapping/${mappingId}/$apply`,
        data: questionnaireResponse,
    });
};
