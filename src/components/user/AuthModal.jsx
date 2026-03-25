'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { AuthContext } from '../../contexts/AuthContext';

export default function AuthModal() {
    const router = useRouter();
    const { t } = useTranslation();
    const { authVisible, authMode, closeAuth } = useContext(AuthContext);

    const [mode, setMode] = useState('login');
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        if (!authVisible) {
            return;
        }

        setMode(authMode === 'register' ? 'register' : 'login');
        setResetKey((current) => current + 1);
    }, [authVisible, authMode]);

    const isLogin = mode === 'login';

    const handleSwitchMode = () => {
        setMode((current) => (current === 'login' ? 'register' : 'login'));
        setResetKey((current) => current + 1);
    };

    const handleForgotPassword = () => {
        closeAuth();
        router.push('/verify/request-password-reset');
    };

    const handleSuccess = () => {
        closeAuth();
    };

    const handleHide = () => {
        closeAuth();
        setResetKey((current) => current + 1);
    };

    return (
        <Dialog
            visible={authVisible}
            modal
            dismissableMask
            draggable={false}
            resizable={false}
            showHeader={false}
            onHide={handleHide}
            className="auth-modal-shell"
            contentClassName="!p-0"
            maskClassName="auth-modal-mask"
        >
            <div className="landing-home-theme">
                <div className="auth-modal-surface glass-card neon-border overflow-hidden border-0 p-0">
                    <button type="button" className="auth-modal-close" onClick={handleHide} aria-label={t('auth.close')}>
                        <X className="h-4 w-4" />
                    </button>

                    <div className="px-6 py-8 sm:px-8 sm:py-10">
                        <div className="mb-8 text-center">
                            <h2 className="font-display text-2xl font-bold tracking-wider text-foreground">
                                Espaço<span className="text-secondary">Geek</span>
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {isLogin ? t('auth.subtitle.login') : t('auth.subtitle.register')}
                            </p>
                        </div>

                        {isLogin ? (
                            <LoginForm
                                resetKey={resetKey}
                                onSwitchMode={handleSwitchMode}
                                onForgotPassword={handleForgotPassword}
                                onSuccess={handleSuccess}
                            />
                        ) : (
                            <RegisterForm
                                resetKey={resetKey}
                                onSwitchMode={handleSwitchMode}
                                onSuccess={handleSuccess}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}