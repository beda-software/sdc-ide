import { Parameters } from 'shared/src/contrib/aidbox';

export const extractParameterName = (expression: string) => String(expression.split('.')[0]).slice(1);

export const checkParameterName = (parameterName: string, launchContext: Parameters) => {
    let result = false;
    launchContext.parameter?.map((item) => {
        if (item.name === parameterName) {
            result = true;
        }
    });
    return result;
};
