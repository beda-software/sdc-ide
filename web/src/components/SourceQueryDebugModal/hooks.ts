import { useCallback, useEffect, useState } from 'react';
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
    const [fullLaunchContext, setFullLaunchContext] = useState<Record<string, any>>([]);
    const [rawSourceQuery, setRawSourceQuery] = useState<Bundle>();

    useEffect(() => {
        (async () => {
            const response = await service<Record<string, any>>({
                method: 'POST',
                url: 'Questionnaire/$context',
                data: launchContext,
            });
            if (isSuccess(response)) {
                const newFullLaunchContext = response.data;
                setFullLaunchContext(newFullLaunchContext);
                setRawSourceQuery(_.find(newFullLaunchContext.Questionnaire?.contained, { id: sourceQueryId }));
            }
        })();
    }, [launchContext, sourceQueryId]);

    const onSave = () => {
        const newResource = { ...resource };
        if (newResource && newResource.contained && rawSourceQuery) {
            const indexOfContainedId = newResource.contained.findIndex((res: Resource) => res.id === sourceQueryId);
            newResource.contained[indexOfContainedId] = rawSourceQuery;
            updateQuestionnaire(newResource, false);
        }
        closeExpressionModal();
    };

    const onChangeRaw = (newRawSourceQuery: Bundle) => {
        setRawSourceQuery(newRawSourceQuery);
    };

    const onChange = useCallback(_.debounce(onChangeRaw, 1000), [onChangeRaw]);

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
    }, [rawSourceQuery]);

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
