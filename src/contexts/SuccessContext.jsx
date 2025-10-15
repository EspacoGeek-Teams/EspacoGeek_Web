import React, { createContext, useState } from 'react';

export const SuccessContext = createContext();

// eslint-disable-next-line react/prop-types
export const SuccessProvider = ({ children }) => {
    const [successMessage, _setSuccessMessage] = useState(null);

    const setSuccessMessage = (value) => {
        if (typeof value === 'string') {
            _setSuccessMessage({ id: Date.now(), text: value });
        } else if (value && typeof value === 'object') {
            const id = value.id ?? Date.now();
            const text = value.text ?? '';
            _setSuccessMessage({ id, text });
        } else {
            _setSuccessMessage(value);
        }
    };

    const showSuccess = (text) => setSuccessMessage(text);

    return (
        <SuccessContext.Provider value={{ successMessage, setSuccessMessage, showSuccess }}>
            {children}
        </SuccessContext.Provider>
    );
};
