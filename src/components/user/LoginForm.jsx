import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import PasswordInput from './PasswordInput';
import { AuthContext } from '../../contexts/AuthContext';
import { ErrorContext } from '../../contexts/ErrorContext';

function LoginForm({ resetKey, onSwitchMode, onForgotPassword, onSuccess }) {
    const { t } = useTranslation();
    const { login } = useContext(AuthContext);
    const { showError } = useContext(ErrorContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setEmail('');
        setPassword('');
        setLoading(false);
    }, [resetKey]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        try {
            const loggedIn = await login(email.trim(), password);
            if (!loggedIn) {
                showError(t('errors.1001'));
                return;
            }
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="floating-label-group">
                    <InputText
                        id="auth-email"
                        type="email"
                        placeholder=" "
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        maxLength={255}
                        disabled={loading}
                    />
                    <label htmlFor="auth-email">{t('auth.login.email')}</label>
                </div>

                <PasswordInput
                    inputId="auth-password"
                    label={t('auth.login.password')}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    maxLength={128}
                    loading={loading}
                    feedback={false}
                    className="gap-0"
                />

                <div className="flex justify-end">
                    <Button
                        type="button"
                        className="auth-link-button text-xs"
                        onClick={onForgotPassword}
                        label={t('auth.login.forgotPassword')}
                    />
                </div>

                <Button
                    type="submit"
                    label={t('auth.login.button')}
                    loading={loading}
                    className="btn-neon mt-2 w-full font-display text-sm tracking-widest uppercase"
                />
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
                {t('auth.switch.promptRegister')}{' '}
                <Button
                    type="button"
                    className="auth-switch-button"
                    label={t('auth.switch.toRegister')}
                    onClick={onSwitchMode}
                />
            </p>
        </>
    );
}

LoginForm.propTypes = {
    resetKey: PropTypes.number.isRequired,
    onSwitchMode: PropTypes.func.isRequired,
    onForgotPassword: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default LoginForm;