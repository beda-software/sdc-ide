import classNames from 'classnames';
import { GroupItemProps, QuestionItems } from 'sdc-qrf/src';

import s from './Group.module.scss';
import { GroupLabel } from './label';
import { RepeatableGroupRow, RepeatableGroups } from './RepeatableGroups';

function Flex(props: GroupItemProps & { direction?: 'column' | 'row' }) {
    const { parentPath, questionItem, context, direction } = props;
    const { linkId, item, repeats } = questionItem;

    if (repeats) {
        if (direction === 'row') {
            return (
                <RepeatableGroups
                    groupItem={props}
                    renderGroup={(props) => <RepeatableGroupRow {...props} />}
                />
            );
        }

        return <RepeatableGroups groupItem={props} />;
    }

    return (
        <div className={s.group}>
            <GroupLabel questionItem={questionItem} />
            <div
                className={classNames({
                    [s.row as string]: direction === 'row',
                    [s.col as string]: direction === 'column',
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
    return <Flex {...props} direction="column" />;
}

export function Row(props: GroupItemProps) {
    return <Flex {...props} direction="row" />;
}
