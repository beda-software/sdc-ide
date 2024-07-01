import { useService, extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';
import { Questionnaire } from 'fhir/r4b';
import { getFHIRResources } from 'web/src/services/fhir';

export function useQuestionnaireEditor() {
    const [questionnairesRD] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Questionnaire>('Questionnaire', { _sort: 'id' }),
            (bundle) => extractBundleResources(bundle).Questionnaire,
        ),
    );

    return { questionnairesRD };
}
