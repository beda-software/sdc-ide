import { useCallback, useState } from 'react';
import { Bundle, Parameters, Questionnaire, Resource } from 'shared/src/contrib/aidbox/index';
import { useService } from 'aidbox-react/src/hooks/service';
import { mapSuccess, service } from 'aidbox-react/src/services/service';
import { failure, isSuccess } from 'aidbox-react/src/libs/remoteData';
import { updateQuestionnaire } from 'src/containers/Main/hooks';
import _ from 'lodash';

interface Props {
    launchContext: Parameters;
    sourceQueryId: string;
    resource: Questionnaire;
    closeExpressionModal: () => void;
}

export function useSourceQueryDebugModal(props: Props) {
    const { launchContext, sourceQueryId, resource, closeExpressionModal } = props;
    const [rawSourceQuery, setRawSourceQuery] = useState<Bundle>();

    const onSave = useCallback(() => {
        const newResource = { ...resource };
        if (newResource && newResource.contained && rawSourceQuery) {
            const indexOfContainedId = newResource.contained.findIndex((res: Resource) => res.id === sourceQueryId);
            newResource.contained[indexOfContainedId] = rawSourceQuery;
            updateQuestionnaire(newResource, false);
        }
        closeExpressionModal();
    }, [closeExpressionModal, rawSourceQuery, resource, sourceQueryId]);

    const onChange = _.debounce(setRawSourceQuery, 1000);

    const [fullLaunchContext] = useService(async () => {
        const response = await service<any>({
            // TODO use right type
            method: 'POST',
            url: 'Questionnaire/$context',
            data: launchContext,
        });
        if (isSuccess(response)) {
            setRawSourceQuery(_.find(response.data.Questionnaire?.contained, { id: sourceQueryId }));
            console.log(response.data);
            return response.data;
        }
        return failure(null);
    }, [launchContext, sourceQueryId]);

    const [preparedSourceQueryRD] = useService(async () => {
        if (rawSourceQuery && fullLaunchContext) {
            const response = await service<string>({
                method: 'POST',
                url: `Questionnaire/$resolve-expression`,
                data: {
                    expression: JSON.stringify(rawSourceQuery),
                    env: fullLaunchContext,
                },
            });
            return mapSuccess(response, (expression) => JSON.parse(expression));
        }
        return failure(null);
    }, [rawSourceQuery, fullLaunchContext]);

    const [bundleResultRD] = useService(async () => {
        if (isSuccess(preparedSourceQueryRD)) {
            const response = await service<Bundle>({
                method: 'POST',
                url: `/`,
                data: preparedSourceQueryRD.data,
            });
            return response;
        }
        return failure(null);
    }, [preparedSourceQueryRD]);

    return {
        bundleResultRD,
        rawSourceQuery,
        preparedSourceQueryRD,
        onChange,
        onSave,
    };
}
