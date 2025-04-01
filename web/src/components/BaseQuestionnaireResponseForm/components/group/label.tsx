import { QuestionnaireItem } from '@beda.software/aidbox-types';

import s from './Group.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    questionItem?: QuestionnaireItem;
}

export function GroupLabel({ questionItem = {} as any, children }: Props) {
    const { text, helpText } = questionItem;

    if (!text && !helpText && !children) {
        return null;
    }

    return (
        <div className={s.labelWrapper}>
            {text && <p className={s.label}>{text}</p>}
            {children && <p className={s.label}>{children}</p>}
            {helpText && <p className={s.helpText}>{helpText}</p>}
        </div>
    );
}
