import classNames from 'classnames';
import { useContext } from 'react';
import { FCEQuestionnaireItem, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { GroupContext } from './group/context';
import s from '../QuestionnaireResponseForm.module.scss';

interface Props
    extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
    questionItem: FCEQuestionnaireItem;
}

export function QuestionLabel(props: Props) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { questionItem, ...other } = props;
    const { text, helpText, required } = questionItem;
    const readOnly = qrfContext.readOnly || questionItem.readOnly || questionItem.hidden;
    const { type: groupType } = useContext(GroupContext);

    if (groupType === 'gtable') {
        return null;
    }

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
                    {required ? <span style={{ color: 'red' }}>{`* `}</span> : null}
                    {text}
                </label>
            )}
            {helpText && <p className={s.helpText}>{helpText}</p>}
        </div>
    );
}
