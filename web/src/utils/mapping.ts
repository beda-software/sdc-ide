import { service } from 'aidbox-react/lib/services/service';

import { QuestionnaireResponse } from 'shared/src/contrib/aidbox';

export const applyMapping = async (mappingId: string, questionnaireResponse: QuestionnaireResponse) => {
    await service({
        method: 'POST',
        url: `/Mapping/${mappingId}/$apply`,
        data: questionnaireResponse,
    });
};
