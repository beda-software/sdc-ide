import classNames from 'classnames';
import { useQuestionnaireResponseFormContext } from 'sdc-qrf/src';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

import s from '../QuestionnaireResponseForm.module.scss';

interface Props
    extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
    questionItem: QuestionnaireItem;
}

export function QuestionLabel(props: Props) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { questionItem, ...other } = props;
    const { text, helpText } = questionItem;
    const readOnly = qrfContext.readOnly || questionItem.readOnly || questionItem.hidden;

    if (!text && !helpText) {
        return null;
    }

    return (
        <div className={s.labelWrapper}>
            {text && (
                <label
                    className={classNames(s.label, {
                        [s._readOnly as string]: readOnly,
                    })}
                    {...other}
                >
                    {text}
                </label>
            )}
            {helpText && <p className={s.helpText}>{helpText}</p>}
        </div>
    );
}
