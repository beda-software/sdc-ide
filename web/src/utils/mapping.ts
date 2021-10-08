import { QuestionnaireResponse } from 'shared/src/contrib/aidbox';
import { service } from 'aidbox-react/lib/services/service';

export const applyMapping = async (mappingId: string, questionnaireResponse: QuestionnaireResponse) => {
    await service({
        method: 'POST',
        url: `/Mapping/${mappingId}/$apply`,
        data: questionnaireResponse,
    });
};
