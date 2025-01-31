import {
    Reference as FHIRReference,
    Extension as FHIRExtension,
    QuestionnaireItem as FHIRQuestionnaireItem,
} from 'fhir/r4b';

import {
    Extension as FCEExtension,
    QuestionnaireItem as FCEQuestionnaireItem,
    InternalReference,
} from 'shared/src/contrib/aidbox';

import { ExtensionIdentifier, extensionTransformers } from './extensions';
import { fromFirstClassExtension, fromFirstClassExtensionV2 } from './fceToFhir';
import { toFirstClassExtension, toFirstClassExtensionV2 } from './fhirToFce';
import { processLaunchContext as processLaunchContextToFce } from './fhirToFce/questionnaire/processExtensions';
export * from './utils';

export function convertFromFHIRExtension(
    extensions: FHIRExtension[],
): Partial<FCEQuestionnaireItem> | undefined {
    const identifier = extensions[0]!.url;
    const transformer = extensionTransformers[identifier as ExtensionIdentifier];
    if (transformer !== undefined) {
        if ('transform' in transformer) {
            return transformer.transform.fromExtensions(extensions);
        } else {
            return {
                [transformer.path.questionnaire]: transformer.path.isCollection
                    ? extensions.map((extension) => extension[transformer.path.extension])
                    : extensions[0]![transformer.path.extension],
            };
        }
    }
}

export function convertToFHIRExtension(item: FCEQuestionnaireItem): FHIRExtension[] {
    const extensions: FHIRExtension[] = [];
    Object.values(ExtensionIdentifier).forEach((identifier) => {
        const transformer = extensionTransformers[identifier];
        if ('transform' in transformer) {
            extensions.push(...transformer.transform.toExtensions(item));
        } else {
            const value = item[transformer.path.questionnaire];
            if (value !== undefined) {
                const valueArray = Array.isArray(value) ? value : [value];

                extensions.push(
                    ...valueArray.map((extensionValue) => ({
                        [transformer.path.extension]: extensionValue,
                        url: identifier,
                    })),
                );
            }
        }
    });
    return extensions;
}

export function extractExtension(extension: FCEExtension[] | undefined, url: 'ex:createdAt') {
    return extension?.find((e) => e.url === url)?.valueInstant;
}

export function filterExtensions(item: FHIRQuestionnaireItem, url: string) {
    return item.extension?.filter((ext) => ext.url === url);
}

export function fromFHIRReference(r?: FHIRReference): InternalReference | undefined {
    if (!r || !r.reference) {
        return undefined;
    }

    // We remove original reference from r in this "strange" way
    // TODO: re-write omitting
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reference: literalReference, ...commonReferenceProperties } = r;
    const isHistoryVersionLink = r.reference.split('/').slice(-2, -1)[0] === '_history';

    if (isHistoryVersionLink) {
        const [, , id, resourceType] = r.reference.split('/').reverse();

        return {
            ...commonReferenceProperties,
            id: id!,
            resourceType,
        };
    } else {
        const [id, resourceType] = r.reference.split('/').reverse();

        return {
            ...commonReferenceProperties,
            id: id!,
            resourceType,
        };
    }
}

export function toFHIRReference(r?: InternalReference): FHIRReference | undefined {
    if (!r) {
        return undefined;
    }

    const { id, resourceType, ...commonReferenceProperties } = r;

    delete commonReferenceProperties.resource;

    return {
        ...commonReferenceProperties,
        reference: `${resourceType}/${id}`,
    };
}

export {
    toFirstClassExtension,
    toFirstClassExtensionV2,
    fromFirstClassExtension,
    fromFirstClassExtensionV2,
    processLaunchContextToFce,
};
