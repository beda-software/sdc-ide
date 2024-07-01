// eslint-disable-next-line import/named
import { Field, FieldProps } from 'react-final-form';

import s from '../QuestionnaireResponseForm.module.scss';

interface Props extends FieldProps<any, any> {}

export function QuestionField(props: Props) {
    const { children, ...other } = props;

    return (
        <Field {...other}>
            {children instanceof Function ? (
                (props) => <div className={s.field}>{children(props)}</div>
            ) : (
                <div className={s.field}>{children}</div>
            )}
        </Field>
    );
}
