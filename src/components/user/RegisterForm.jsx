import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import CREATE_USER_MUTATION from '../apollo/schemas/mutations/createUser';
import PasswordInput, { isValidPassword } from './PasswordInput';
import { ErrorContext } from '../../contexts/ErrorContext';
import { GlobalLoadingContext } from '../../contexts/GlobalLoadingContext';
import { SuccessContext } from '../../contexts/SuccessContext';

function RegisterForm({ resetKey, onSwitchMode, onSuccess }) {
    const { t } = useTranslation();
    const { setGlobalLoading } = useContext(GlobalLoadingContext);
    const { showError } = useContext(ErrorContext);
    const { showSuccess } = useContext(SuccessContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION, {
        errorPolicy: 'all',
        onCompleted: () => showSuccess(t('auth.register.success')),
        onError: (error) => showError(error?.graphQLErrors?.[0]?.message || error?.message || t('errors.generic')),
    });

    useEffect(() => {
        setUsername('');
        setEmail('');
        setPassword('');
    }, [resetKey]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isValidPassword(password)) {
            showError(t('auth.register.passwordInvalid'));
            return;
        }

        setGlobalLoading(true);
        try {
            await createUser({
                variables: {
                    username: username.trim(),
                    email: email.trim(),
                    password,
                },
            });
            onSuccess();
        } finally {
            setGlobalLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="floating-label-group">
                    <InputText
                        id="signup-username"
                        type="text"
                        placeholder=" "
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="username"
                        maxLength={30}
                        disabled={loading}
                    />
                    <label htmlFor="signup-username">{t('auth.register.username')}</label>
                </div>

                <div className="floating-label-group">
                    <InputText
                        id="signup-email"
                        type="email"
                        placeholder=" "
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        maxLength={255}
                        disabled={loading}
                    />
                    <label htmlFor="signup-email">{t('auth.register.email')}</label>
                </div>

                <PasswordInput
                    inputId="signup-password"
                    label={t('auth.register.password')}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    maxLength={128}
                    loading={loading}
                    feedback
                    className="gap-0"
                />

                <Button
                    type="submit"
                    label={t('auth.register.button')}
                    loading={loading}
                    className="btn-neon mt-2 w-full font-display text-sm tracking-widest uppercase"
                />
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
                {t('auth.switch.promptLogin')}{' '}
                <Button
                    type="button"
                    className="auth-switch-button"
                    label={t('auth.switch.toLogin')}
                    onClick={onSwitchMode}
                />
            </p>
        </>
    );
}

RegisterForm.propTypes = {
    resetKey: PropTypes.number.isRequired,
    onSwitchMode: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default RegisterForm;