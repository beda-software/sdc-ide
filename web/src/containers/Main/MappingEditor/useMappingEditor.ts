import { Bundle, Questionnaire } from 'fhir/r4b';

import { getFHIRResources as getAidboxFHIRResources } from 'aidbox-react/lib/services/fhir';

import { useService } from 'fhir-react/lib/hooks/service';
import {
    RemoteData,
    RemoteDataResult,
    failure,
    isSuccess,
    success,
} from 'fhir-react/lib/libs/remoteData';
import { WithId, extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import { Mapping } from 'shared/src/contrib/aidbox';

import { getMappings } from '../utils';

export function useMappingEditor(questionnaireRD: RemoteData<Questionnaire>) {
    const [mappingsRD] = useService(async () => {
        if (isSuccess(questionnaireRD)) {
            let response: RemoteDataResult<Bundle<WithId<Mapping>>> = success({
                resourceType: 'Bundle',
                entry: [],
                type: 'searchset',
            });

            const ids =
                getMappings(questionnaireRD.data)?.map(
                    (ext) => ext.valueReference!.reference!.split('/')[1]!,
                ) || [];

            if (ids.length) {
                response = await getAidboxFHIRResources<Mapping>('Mapping', {
                    _sort: 'id',
                    _id: [ids.join(',')],
                });
            }

            return mapSuccess(response, (bundle) => extractBundleResources(bundle).Mapping);
        }

        return await Promise.resolve(failure({}));
    }, [questionnaireRD]);

    return { mappingsRD };
}
