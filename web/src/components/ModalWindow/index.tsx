import React from 'react';
import s from './ModalWindow.module.scss';

interface ModalWindowElement {
    setError: (flag: boolean) => void;
    error: boolean;
}
export default function ModalWindow({ setError, error }: ModalWindowElement) {
    return (
        <div className={s.modal}>
            <div className={s.modalWindow}>
                <div className={s.modal__cont}>
                    <div className={s.containerTextButton}>
                        <div className={s.error}>An error has occurred</div>
                        <div className={s.modalCloseBtn} onClick={() => setError(!error)}>
                            &times;
                        </div>
                    </div>
                    <div className={s.errorMessage}>
                        Failed to add mapping to mappingList.
                        <br /> Do you want to add mapping to mappingList?
                    </div>
                    <div className={s.buttons}>
                        <div className={s.buttonLeft}>
                            <div className={s.textButton}>No</div>
                        </div>
                        <div className={s.buttonRight}>
                            <div className={s.textButton}>Yes</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
