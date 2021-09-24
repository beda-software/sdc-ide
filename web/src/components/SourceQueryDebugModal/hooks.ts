import { useCallback, useEffect, useState } from 'react';
import { Bundle, Parameters } from 'shared/src/contrib/aidbox/index';
import { useService } from 'aidbox-react/src/hooks/service';
import { mapSuccess, service } from 'aidbox-react/src/services/service';
import { failure, isSuccess } from 'aidbox-react/src/libs/remoteData';
import _ from 'lodash';

export function useSourceQueryDebugModal(launchContext: Parameters, sourceQueryId: string) {
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
    };
}
