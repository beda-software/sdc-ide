import s from './ErrorButton.module.scss';

interface ErrorButtonProps {
    count?: number;
    showError: () => void;
}

export function ErrorButton({ showError, count }: ErrorButtonProps) {
    if (count) {
        return (
            <span className={s.error} onClick={showError}>
                <span className={s.count}>{count}</span>
                ERR!
            </span>
        );
    } else return <></>;
}
