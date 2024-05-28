import { GroupItemProps } from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import classNames from 'classnames';

import { GroupContext } from './context';
import s from './Group.module.scss';
import { GTable as GTableControl } from './GTable';
import { GroupLabel } from './label';
import { RepeatableGroupRow, RepeatableGroups } from './RepeatableGroups';
import { QuestionItems } from '../questionItems';

function Flex(props: GroupItemProps & { type?: 'col' | 'row' | 'gtable' }) {
    const { parentPath, questionItem, context, type = 'col' } = props;
    const { linkId, item, repeats } = questionItem;

    const renderRepeatableGroup = () => {
        if (type === 'gtable') {
            return <GTableControl groupItem={props} />;
        }

        if (type === 'row') {
            return (
                <RepeatableGroups
                    groupItem={props}
                    renderGroup={(props) => <RepeatableGroupRow {...props} />}
                />
            );
        }

        return <RepeatableGroups groupItem={props} />;
    };

    if (repeats) {
        return (
            <GroupContext.Provider value={{ type }}>
                {renderRepeatableGroup()}
            </GroupContext.Provider>
        );
    }

    return (
        <div className={s.group}>
            <GroupLabel questionItem={questionItem} />
            <div
                className={classNames({
                    [s.row as string]: type === 'row',
                    [s.col as string]: type === 'col',
                })}
            >
                {item && (
                    <QuestionItems
                        questionItems={item}
                        parentPath={[...parentPath, linkId, 'items']}
                        context={context[0]!}
                    />
                )}
            </div>
        </div>
    );
}

export function Col(props: GroupItemProps) {
    return <Flex {...props} type="col" />;
}

export function Row(props: GroupItemProps) {
    return <Flex {...props} type="row" />;
}

export function GTable(props: GroupItemProps) {
    return <Flex {...props} type="gtable" />;
}
