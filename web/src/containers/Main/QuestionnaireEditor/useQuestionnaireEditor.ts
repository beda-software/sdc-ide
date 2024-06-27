import { Questionnaire } from 'fhir/r4b';

import { useService, extractBundleResources } from '@beda.software/fhir-react';
import { getFHIRResources } from 'src/services/fhir';
import { mapSuccess } from '@beda.software/remote-data';

export function useQuestionnaireEditor() {
    const [questionnairesRD] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Questionnaire>('Questionnaire', { _sort: 'id' }),
            (bundle) => extractBundleResources(bundle).Questionnaire,
        ),
    );

    return { questionnairesRD };
}
