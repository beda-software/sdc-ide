import { Questionnaire } from 'fhir/r4b';

import { useService } from 'fhir-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

export function useQuestionnaireEditor() {
    const [questionnairesRD] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Questionnaire>('Questionnaire', {
                _sort: 'id',
                profile: 'https://beda.software/beda-emr-questionnaire',
            }),
            (bundle) => extractBundleResources(bundle).Questionnaire,
        ),
    );

    return { questionnairesRD };
}
