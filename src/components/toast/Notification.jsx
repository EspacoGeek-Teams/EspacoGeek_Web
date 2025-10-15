import React, { useContext, useRef, useEffect } from "react";
import { Toast } from 'primereact/toast';
import { ErrorContext } from "../../contexts/ErrorContext";
import { SuccessContext } from "../../contexts/SuccessContext";

export function ErrorNotification() {
    const { errorMessage, setErrorMessage } = useContext(ErrorContext);
    const toastRef = useRef(null);
    const lastShownId = useRef(null);

    useEffect(() => {
        if (errorMessage?.text && toastRef.current) {
            if (errorMessage.id !== lastShownId.current) {
                lastShownId.current = errorMessage.id;
                toastRef.current.show({ severity: 'error', summary: 'Error', detail: errorMessage.text, life: 3000 });
                // Clear after showing to prevent duplicate renders (StrictMode) from re-showing
                setTimeout(() => setErrorMessage(null), 0);
            }
        }
    }, [errorMessage, setErrorMessage]);

    return (
        <>
            <Toast ref={toastRef} />
        </>
    );
}

export function SuccessNotification() {
    const { successMessage, setSuccessMessage } = useContext(SuccessContext);
    const toastRef = useRef(null);
    const lastShownId = useRef(null);

    useEffect(() => {
        if (successMessage?.text && toastRef.current) {
            if (successMessage.id !== lastShownId.current) {
                lastShownId.current = successMessage.id;
                toastRef.current.show({ severity: 'success', summary: 'Success',  detail: successMessage.text, life: 3000  });
                // Clear after showing to prevent duplicate renders (StrictMode) from re-showing
                setTimeout(() => setSuccessMessage(null), 0);
            }
        }
    }, [successMessage, setSuccessMessage]);

    return (
        <>
            <Toast ref={toastRef} />
        </>
    );
}
