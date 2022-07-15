import { ReactChild } from 'react';
import { QRFContextData, QuestionItemProps, QuestionItemsProps } from './types';
export declare function usePreviousValue<T = any>(value: T): T | undefined;
export declare function QuestionItems(props: QuestionItemsProps): JSX.Element;
export declare function QuestionItem(props: QuestionItemProps): JSX.Element | null;
export declare function QuestionnaireResponseFormProvider({ children, ...props }: QRFContextData & {
    children: ReactChild;
}): JSX.Element;
