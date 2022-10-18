import { QuestionItemProps } from "sdc-qrf/src";

export function QuestionDisplay({ questionItem }: QuestionItemProps) {
    return (
        <div style={{ marginBottom: 16 }}>
            <b>{questionItem.text}</b>
        </div>
    );
}
