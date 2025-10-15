import React from 'react';
import { createContext, useState } from "react";

const ErrorContext = createContext();

// eslint-disable-next-line react/prop-types
const ErrorProvider = ({ children }) => {
    const [errorMessage, _setErrorMessage] = useState(null);

    const setErrorMessage = (value) => {
        if (typeof value === 'string') {
            _setErrorMessage({ id: Date.now(), text: value });
        } else if (value && typeof value === 'object') {
            const id = value.id ?? Date.now();
            const text = value.text ?? '';
            _setErrorMessage({ id, text });
        } else {
            _setErrorMessage(value);
        }
    };

    const showError = (text) => setErrorMessage(text);

    return (
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage, showError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export { ErrorProvider, ErrorContext };
