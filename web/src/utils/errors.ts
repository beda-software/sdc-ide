import { OperationOutcome } from 'fhir/r4b';

import { formatError } from 'fhir-react/lib/utils/error';

export function formatFHIRError(error: any) {
    if (error) {
        if (error instanceof Object && error['resourceType'] === 'OperationOutcome') {
            const err = (error as OperationOutcome)?.issue?.[0]?.diagnostics;
            const code = (error as OperationOutcome)?.issue?.[0]?.code;
            const expressionRaw = (error as OperationOutcome)?.issue?.[0]?.expression?.[0];
            if (!expressionRaw) {
                return `${err} (${code})`;
            }
            const expressionPath = expressionRaw.endsWith('.') ? 'at root' : `at ${expressionRaw}`;

            return `${err} ${expressionPath} (${code})`;
        }
    }

    return formatError(error);
}
