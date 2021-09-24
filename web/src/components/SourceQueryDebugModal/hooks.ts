import { Bundle, Parameters } from 'shared/src/contrib/aidbox/index';
import { useCallback, useState } from 'react';
import { useService } from 'aidbox-react/src/hooks/service';
import { service } from 'aidbox-react/src/services/service';
import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import _ from 'lodash';

export function useSourceQueryDebugModal(launchContext: Parameters, sourceQueryId: string) {
    const [fullLaunchContext, setFullLaunchContext] = useState<Record<string, any>>([]);
    const [rawSourceQuery, setRawSourceQuery] = useState<Bundle>();
    const [preparedSourceQuery, setPreparedSourceQuery] = useState<Bundle>();

    const [fullLaunchContextRD] = useService(async () => {
        const response = await service<Record<string, any>>({
            method: 'POST',
            url: 'Questionnaire/$context',
            data: launchContext,
        });
        if (isSuccess(response)) {
            const newFullLaunchContext = response.data;
            setFullLaunchContext(newFullLaunchContext);
            setRawSourceQuery(_.find(newFullLaunchContext.Questionnaire?.contained, { id: sourceQueryId }));
            await preparedSourceQueryRD();
            // prepareSourceQuery();
        }
        return response;
    }, [sourceQueryId]);

    console.log(fullLaunchContextRD);

    const preparedSourceQueryRD = useCallback(async () => {
        if (rawSourceQuery && fullLaunchContext) {
            const response = await service<string>({
                method: 'POST',
                url: `Questionnaire/$resolve-expression`,
                data: {
                    expression: JSON.stringify(rawSourceQuery),
                    env: fullLaunchContext,
                },
            });
            if (isSuccess(response)) {
                setPreparedSourceQuery(JSON.parse(response.data));
            }
        }
    }, [fullLaunchContext, rawSourceQuery]);

    // const prepareSourceQuery = async () => {
    //     if (rawSourceQuery && fullLaunchContext) {
    //         const response = await service<string>({
    //             method: 'POST',
    //             url: `Questionnaire/$resolve-expression`,
    //             data: {
    //                 expression: JSON.stringify(rawSourceQuery),
    //                 env: fullLaunchContext,
    //             },
    //         });
    //         if (isSuccess(response)) {
    //             setPreparedSourceQuery(JSON.parse(response.data));
    //         }
    //     }
    // };

    return {
        bunleResult: fullLaunchContext[sourceQueryId],
        rawSourceQuery,
        preparedSourceQuery,
        preparedSourceQueryRD,
    };
}
