import _ from 'lodash';
import { Field } from 'react-final-form';
import { GroupItemProps, QuestionItems } from 'sdc-qrf/src';

import s from './Group.module.scss';

export function Group({ parentPath, questionItem, context }: GroupItemProps) {
    const { linkId, item, text, repeats, required } = questionItem;

    if (item) {
        const baseFieldPath = [...parentPath, linkId];

        if (repeats) {
            return (
                <Field name={baseFieldPath.join('.')}>
                    {({ input }) => {
                        return (
                            <div>
                                <p className={s.questLabel}>{text}</p>
                                <div className={s.repeatsGroupItemsContainer}>
                                    {_.map(
                                        input.value.items && input.value.items.length
                                            ? input.value.items
                                            : required
                                            ? [{}]
                                            : [],
                                        (_elem, index: number) => {
                                            if (!input.value.items[index]) {
                                                return null;
                                            }
                                            return (
                                                <div
                                                    key={index}
                                                    className={s.repeatsGroupItemTitle}
                                                >
                                                    <div className={s.repeatsGroupItemHeader}>
                                                        <span
                                                            className={s.repeatsGroupItemTitle}
                                                        >{`${questionItem.text} #${
                                                            index + 1
                                                        }`}</span>
                                                        <div
                                                            onClick={() => {
                                                                const filteredArray = _.filter(
                                                                    input.value.items,
                                                                    (_val, valIndex: number) =>
                                                                        valIndex !== index,
                                                                );
                                                                input.onChange({
                                                                    items: [...filteredArray],
                                                                });
                                                            }}
                                                            className={
                                                                s.repeatsGroupRemoveItemButton
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    s.repeatsGroupRemoveItemButtonTitle
                                                                }
                                                            >
                                                                Remove
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={s.repeatsGroupItemBody}>
                                                        <QuestionItems
                                                            questionItems={item!}
                                                            parentPath={[
                                                                ...parentPath,
                                                                linkId,
                                                                'items',
                                                                index.toString(),
                                                            ]}
                                                            context={context[0]!}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                                <div
                                    className={s.repeatsGroupAddItemButton}
                                    onClick={() => {
                                        const existingItems = input.value.items || [];
                                        const updatedInput = { items: [...existingItems, {}] };
                                        input.onChange(updatedInput);
                                    }}
                                >
                                    <p
                                        className={s.repeatsGroupAddItemButtonTitle}
                                    >{`+ Add another ${text}`}</p>
                                </div>
                            </div>
                        );
                    }}
                </Field>
            );
        }
        return (
            <div className={s.group}>
                <p className={s.questLabel}>{text}</p>
                <QuestionItems
                    questionItems={item!}
                    parentPath={[...parentPath, linkId, 'items']}
                    context={context[0]!}
                />
            </div>
        );
    }
    return null;
}

export { Row, Col } from './flex';
