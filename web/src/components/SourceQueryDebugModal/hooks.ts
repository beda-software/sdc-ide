import { Questionnaire, Parameters, Bundle, Resource } from 'fhir/r4b';
import * as _ from 'lodash';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { useService } from 'fhir-react/lib/hooks/service';
import { isFailure, success, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { saveFHIRResource } from 'fhir-react/lib/services/fhir';
import { mapSuccess, service } from 'fhir-react/lib/services/service';
import { formatError } from 'fhir-react/lib/utils/error';

export interface Props {
    launchContext: Parameters;
    sourceQueryId: string;
    closeExpressionModal: () => void;
}

export function useSourceQueryDebugModal(props: Props) {
    const { launchContext, sourceQueryId, closeExpressionModal } = props;
    const [rawSourceQuery, setRawSourceQuery] = useState<Bundle>();

    const onSave = useCallback(
        async (resource: Questionnaire) => {
            const newResource = { ...resource };
            if (newResource && newResource.contained && rawSourceQuery) {
                const indexOfContainedId = newResource.contained.findIndex(
                    (res: Resource) => res.id === sourceQueryId,
                );
                newResource.contained[indexOfContainedId] = rawSourceQuery;
                const response = await saveFHIRResource(newResource);

                if (isSuccess(response)) {
                    closeExpressionModal();
                } else {
                    toast.error('An error occurred: ' + formatError(response.error));
                }
            }
        },
        [closeExpressionModal, rawSourceQuery, sourceQueryId],
    );

    const onChange = _.debounce(setRawSourceQuery, 1000);

    const [response] = useService(async () => {
        const fullLaunchContextRD = await service({
            method: 'POST',
            url: 'Questionnaire/$context',
            data: launchContext,
        });

        if (isFailure(fullLaunchContextRD)) {
            return fullLaunchContextRD;
        }

        const sourceQuery = rawSourceQuery
            ? rawSourceQuery
            : _.find(fullLaunchContextRD.data.Questionnaire?.contained, { id: sourceQueryId });

        setRawSourceQuery(sourceQuery);

        const preparedSourceQueryRD = mapSuccess(
            await service({
                method: 'POST',
                url: `Questionnaire/$resolve-expression`,
                data: {
                    expression: JSON.stringify(sourceQuery),
                    env: fullLaunchContextRD.data,
                },
            }),
            (expression) => JSON.parse(expression),
        );

        if (isFailure(preparedSourceQueryRD)) {
            return preparedSourceQueryRD;
        }

        const bundleResultRD = await service<Bundle>({
            method: 'POST',
            url: `/`,
            data: preparedSourceQueryRD.data,
        });

        if (isFailure(bundleResultRD)) {
            return bundleResultRD;
        }

        return success({
            bundleResult: bundleResultRD.data,
            preparedSourceQuery: preparedSourceQueryRD.data,
            launchContextResponse: fullLaunchContextRD.data,
        });
    }, [sourceQueryId, rawSourceQuery]);

    return {
        response,
        rawSourceQuery,
        onChange,
        onSave,
    };
}
