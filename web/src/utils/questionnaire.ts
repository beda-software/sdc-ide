import _ from 'lodash';
import { AnswerValue } from 'sdc-qrf';

export function getDisplay(value: AnswerValue): string {
    const valueType = _.keys(value)[0];

    // if (valueType === 'Attachment') {
    //     return oc(value).Attachment.title() || oc(value).Attachment.url() || '';
    // }
    //
    // if (valueType === 'Reference') {
    //     return oc(value).Reference.display('');
    // }
    //
    // if (valueType === 'Coding') {
    //     return oc(value).Coding.display('');
    // }
    //
    // if (valueType === 'CodeableConcept') {
    //     return oc(value).CodeableConcept.coding[0].display('');
    // }
    //
    // if (valueType === 'Quantity') {
    //     const code = {
    //         system: value.Quantity!.system!,
    //         code: value.Quantity!.code!,
    //     };
    //     return `${oc(value).Quantity.value()} ${code ? code : oc(value).Quantity.code()}`;
    // }
    //@ts-ignore
    const output = value[valueType];
    return output;
}

export function getAnswerDisplay(o?: AnswerValue) {
    if (!o) {
        return '';
    }

    if (o?.Coding) {
        return o.Coding.display!;
    }

    if (o?.string) {
        return o.string;
    }

    if (o?.Reference) {
        return o.Reference.display ?? '';
    }

    return JSON.stringify(o);
}

export function getAnswerCode(o?: AnswerValue) {
    if (!o) {
        return '';
    }

    if (o?.Coding) {
        return o.Coding.code!;
    }

    if (o?.string) {
        return o.string;
    }

    if (o?.Reference) {
        return o.Reference.reference!;
    }

    return JSON.stringify(o);
}
