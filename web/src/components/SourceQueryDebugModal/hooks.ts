import * as _ from 'lodash';
import { useCallback, useState } from 'react';
import { showToast, updateQuestionnaire } from 'web/src/containers/Main/hooks/index';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isFailure, success, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { mapSuccess, service } from 'aidbox-react/lib/services/service';

import { Bundle, Parameters, Questionnaire, Resource } from 'shared/src/contrib/aidbox/index';

export interface Props {
    launchContext: Parameters;
    sourceQueryId: string;
    closeExpressionModal: () => void;
    fhirMode: boolean;
}

export function useSourceQueryDebugModal(props: Props) {
    const { launchContext, sourceQueryId, closeExpressionModal, fhirMode } = props;
    const [rawSourceQuery, setRawSourceQuery] = useState<Bundle>();

    const onSave = useCallback(
        async (resource: Questionnaire) => {
            const newResource = { ...resource };
            if (newResource && newResource.contained && rawSourceQuery) {
                const indexOfContainedId = newResource.contained.findIndex(
                    (res: Resource) => res.id === sourceQueryId,
                );
                newResource.contained[indexOfContainedId] = rawSourceQuery;
                const response = await updateQuestionnaire(newResource, fhirMode);
                if (isSuccess(response)) {
                    closeExpressionModal();
                } else {
                    showToast('error', response.error);
                }
            }
        },
        [closeExpressionModal, fhirMode, rawSourceQuery, sourceQueryId],
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
