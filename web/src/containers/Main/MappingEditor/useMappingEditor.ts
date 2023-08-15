import { Questionnaire } from 'fhir/r4b';

import { getFHIRResources as getAidboxFHIRResources } from 'aidbox-react/lib/services/fhir';

import { useService } from 'fhir-react/lib/hooks/service';
import { RemoteData, failure, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { Mapping } from 'shared/src/contrib/aidbox';

import { getMappings } from '../utils';

export function useMappingEditor(questionnaireRD: RemoteData<Questionnaire>) {
    const [mappingsRD] = useService(async () => {
        if (isSuccess(questionnaireRD)) {
            const ids =
                getMappings(questionnaireRD.data)?.map(
                    (ext) => ext.valueReference!.reference!.split('/')[1]!,
                ) || [];
            const response = await getAidboxFHIRResources<Mapping>('Mapping', {
                _sort: 'id',
                _id: [ids.join(',')],
            });

            return mapSuccess(response, (bundle) => extractBundleResources(bundle).Mapping);
        }

        return await Promise.resolve(failure({}));
    }, [questionnaireRD]);

    return { mappingsRD };
}
