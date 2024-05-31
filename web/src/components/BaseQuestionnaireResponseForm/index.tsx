import {
    FormWrapperProps,
    QuestionnaireResponseForm,
    questionnaireIdWOAssembleLoader,
} from '@beda.software/fhir-questionnaire';
import { QuestionnaireResponseFormProps } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/questionnaire-response-form-data';
import { ParametersParameter } from '@beda.software/fhir-questionnaire/contrib/aidbox';
import {
    FormItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import { QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';
import { useRef } from 'react';
import { Form, FormSpy } from 'react-final-form';

import {
    Col,
    GTable,
    Group,
    QuestionBoolean,
    QuestionChoice,
    QuestionDate,
    QuestionDateTime,
    QuestionDecimal,
    QuestionDisplay,
    QuestionString,
    Row,
} from './components';
import { QuestionInteger } from './components/integer';
import { QuestionReference } from './components/reference';
import s from './QuestionnaireResponseForm.module.scss';


interface Props {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    serviceProvider: QuestionnaireResponseFormProps['serviceProvider'];
    readOnly?: boolean;
    onChange?: (data: QuestionnaireResponseFormData) => any;
}

type FormValues = FormItems;

export function BaseQuestionnaireResponseForm({
    formData,
    onSubmit,
    readOnly,
    onChange,
    serviceProvider,
}: Props) {
    const previousValues = useRef<FormValues | null>(null);

    const onFormChange = (values: FormValues) => {
        if (_.isEqual(values, previousValues.current)) {
            return;
        }

        onChange?.({ ...formData, formValues: values });

        previousValues.current = values;
    };

    return (
        <QuestionnaireResponseForm
            questionnaireLoader={questionnaireIdWOAssembleLoader(
                formData.context.questionnaire.name ?? 'undefined',
            )}
            initialQuestionnaireResponse={
                formData.context.questionnaireResponse as QuestionnaireResponse
            }
            launchContextParameters={
                formData.context.launchContextParameters as ParametersParameter[]
            }
            serviceProvider={serviceProvider}
            widgetsByQuestionType={{
                date: QuestionDate,
                dateTime: QuestionDateTime,
                string: QuestionString,
                text: QuestionString,
                choice: QuestionChoice,
                boolean: QuestionBoolean,
                display: QuestionDisplay,
                decimal: QuestionDecimal,
                reference: QuestionReference,
                integer: QuestionInteger,
            }}
            widgetsByQuestionItemControl={{
                'inline-choice': QuestionChoice,
            }}
            readOnly={readOnly}
            FormWrapper={({ handleSubmit, items }) => (
                <BaseForm
                    handleSubmit={handleSubmit}
                    items={items}
                    formData={formData}
                    onSubmit={onSubmit}
                    onFormChange={onFormChange}
                />
            )}
            groupItemComponent={Group}
            widgetsByGroupQuestionItemControl={{ col: Col, row: Row, gtable: GTable }}
            autosave
        />
    );
}

interface BaseFormProps extends FormWrapperProps {
    formData: QuestionnaireResponseFormData;
    onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
    onFormChange: (values: FormItems) => void;
}

function BaseForm(props: BaseFormProps) {
    const { handleSubmit, items, formData, onSubmit, onFormChange } = props;

    return (
        <Form
            onSubmit={(values) => onSubmit({ ...formData, formValues: values })}
            initialValues={formData.formValues}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} className={s.form}>
                    <FormSpy
                        subscription={{ values: true }}
                        onChange={(formState) => {
                            return onFormChange(formState.values);
                        }}
                    />
                    {items}
                </form>
            )}
        />
    );
}

// interface Props {
//     formData: QuestionnaireResponseFormData;
//     onSubmit: (formData: QuestionnaireResponseFormData) => Promise<any>;
//     readOnly?: boolean;
//     onChange?: (data: QuestionnaireResponseFormData) => any;
// }

// type FormValues = FormItems;

// export function BaseQuestionnaireResponseForm({ formData, onSubmit, readOnly, onChange }: Props) {
//     const previousValues = useRef<FormValues | null>(null);

//     const onFormChange = (values: FormValues) => {
//         if (_.isEqual(values, previousValues.current)) {
//             return;
//         }

//         onChange?.({ ...formData, formValues: values });

//         previousValues.current = values;
//     };

//     return (
//         <Form
//             onSubmit={(values) => onSubmit({ ...formData, formValues: values })}
//             initialValues={formData.formValues}
//             render={({ handleSubmit, values, form }) => (
//                 <form onSubmit={handleSubmit} className={s.form}>
//                     <FormSpy
//                         subscription={{ values: true }}
//                         onChange={(formState) => {
//                             return onFormChange(formState.values);
//                         }}
//                     />
//                     <QuestionnaireResponseFormProvider
//                         formValues={values}
//                         setFormValues={(newValues) => form.change('', newValues)}
//                         groupItemComponent={Group}
//                         itemControlGroupItemComponents={{ col: Col, row: Row, gtable: GTable }}
//                         questionItemComponents={{
//                             date: QuestionDate,
//                             dateTime: QuestionDateTime,
//                             string: QuestionString,
//                             text: QuestionString,
//                             choice: QuestionChoice,
//                             boolean: QuestionBoolean,
//                             display: QuestionDisplay,
//                             decimal: QuestionDecimal,
//                             reference: QuestionReference,
//                             integer: QuestionInteger,
//                         }}
//                         readOnly={readOnly}
//                     >
//                         <>
//                             <QuestionItems
//                                 questionItems={formData.context.questionnaire.item!}
//                                 parentPath={[]}
//                                 context={calcInitialContext(formData.context, values)}
//                             />
//                         </>
//                     </QuestionnaireResponseFormProvider>
//                 </form>
//             )}
//         />
//     );
// }
