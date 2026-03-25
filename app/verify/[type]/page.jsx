'use client';

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Layout from "../../../src/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import verifyEmailMutation from "../../../src/components/apollo/schemas/mutations/verifyEmail";
import requestPasswordResetMutation from "../../../src/components/apollo/schemas/mutations/requestPasswordReset";
import resetPasswordMutation from "../../../src/components/apollo/schemas/mutations/resetPassword";
import verifyEmailChangeMutation from "../../../src/components/apollo/schemas/mutations/verifyEmailChange";
import PasswordInput, { isValidPassword } from "../../../src/components/user/PasswordInput";

export default function VerifyPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { t } = useTranslation();

    const type = params?.type ?? null;
    const token = searchParams?.get('token') ?? null;

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [message, setMessage] = useState(null);

    const [verifyEmailFn, { loading: loadingVerify }] = useMutation(verifyEmailMutation);
    const [requestPasswordResetFn, { loading: loadingRequest }] = useMutation(requestPasswordResetMutation);
    const [resetPasswordFn, { loading: loadingReset }] = useMutation(resetPasswordMutation);
    const [verifyEmailChangeFn, { loading: loadingVerifyChange }] = useMutation(verifyEmailChangeMutation);

    useEffect(() => {
        if (type === 'verify-email' && token) {
            setStatus(null);
            setMessage(null);
            verifyEmailFn({ variables: { token } })
                .then(() => {
                    setStatus('success');
                    setMessage(t('verify.emailVerified'));
                    setTimeout(() => router.push('/'), 3000);
                })
                .catch(err => {
                    setStatus('error');
                    setMessage(err.message ?? t('verify.invalidToken'));
                });
        }

        if (type === 'verify-email-change' && token) {
            setStatus(null);
            setMessage(null);
            verifyEmailChangeFn({ variables: { token } })
                .then(() => {
                    setStatus('success');
                    setMessage(t('verify.emailChangeVerified'));
                    setTimeout(() => router.push('/'), 3000);
                })
                .catch(err => {
                    setStatus('error');
                    setMessage(err.message ?? t('verify.invalidToken'));
                });
        }
    }, [type, token, verifyEmailFn, verifyEmailChangeFn, t, router]);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setStatus(null);
        setMessage(null);
        try {
            await requestPasswordResetFn({ variables: { email } });
            setStatus('success');
            setMessage(t('verify.resetEmailSent'));
        } catch (err) {
            setStatus('error');
            setMessage(err.message ?? t('verify.requestFailed'));
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!token) {
            setStatus('error');
            setMessage(t('verify.missingToken'));
            return;
        }
        if (!isValidPassword(newPassword)) {
            setStatus('error');
            setMessage(t('password.invalid'));
            return;
        }
        if (newPassword !== confirmPassword) {
            setStatus('error');
            setMessage(t('verify.passwordMismatch'));
            return;
        }
        setStatus(null);
        setMessage(null);
        try {
            await resetPasswordFn({ variables: { token, newPassword } });
            setStatus('success');
            setMessage(t('verify.passwordReset'));
            setTimeout(() => router.push('/'), 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.message ?? t('verify.requestFailed'));
        }
    };

    const isLoading = loadingVerify || loadingRequest || loadingReset || loadingVerifyChange;

    const showRedirectingMessage = type === 'verify-email' || type === 'verify-email-change' || type === 'reset-password';

    const cardTitle = type === 'request-password-reset'
        ? t('settings.passwordReset.title')
        : type === 'reset-password'
            ? t('verify.resetPassword')
            : t('verify.title');

    const cardDescription = type === 'request-password-reset'
        ? t('settings.passwordReset.description')
        : type === 'reset-password'
            ? t('settings.password.invalid')
            : t('verify.loading');

    return (
        <Layout>
            <div className="landing-home-theme min-h-screen relative overflow-hidden px-4 py-12">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--secondary)/0.14),_transparent_38%),radial-gradient(circle_at_bottom,_hsl(var(--primary)/0.12),_transparent_35%)]" />

                <div className="relative z-10 flex min-h-screen items-center justify-center">
                    <div className="glass-card neon-border w-full max-w-md overflow-hidden border-0 p-0">
                        <div className="px-6 py-8 sm:px-8 sm:py-10">
                            <div className="mb-8 text-center">
                                <p className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
                                    {t('verify.title')}
                                </p>
                                <h1 className="mt-4 font-display text-2xl font-bold tracking-wider text-foreground">
                                    Espaço<span className="text-secondary">Geek</span>
                                </h1>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {cardTitle}
                                </p>
                            </div>

                            {isLoading && (
                                <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/40 px-6 py-10 text-center">
                                    <i className="pi pi-spin pi-spinner text-4xl text-secondary" />
                                    <p className="text-sm text-muted-foreground">{t('verify.loading')}</p>
                                </div>
                            )}

                            {!isLoading && status === 'success' && (
                                <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-8 text-center">
                                    <i className="pi pi-check-circle text-5xl text-emerald-300" />
                                    <p className="font-medium text-emerald-100">{message}</p>
                                    {showRedirectingMessage && (
                                        <p className="text-sm text-muted-foreground">{t('verify.redirecting')}</p>
                                    )}
                                </div>
                            )}

                            {!isLoading && status === 'error' && (
                                <div className="mb-6 flex flex-col items-center gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 px-6 py-6 text-center">
                                    <i className="pi pi-times-circle text-5xl text-red-300" />
                                    <p className="font-medium text-red-100">{message}</p>
                                </div>
                            )}

                            {!isLoading && status !== 'success' && type === 'request-password-reset' && (
                                <>
                                    <p className="mb-6 text-center text-sm text-muted-foreground">{cardDescription}</p>
                                    <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
                                        <div className="floating-label-group">
                                            <InputText
                                                id="verify-reset-email"
                                                type="email"
                                                value={email}
                                                onChange={(event) => setEmail(event.target.value)}
                                                placeholder=" "
                                                autoComplete="email"
                                                required
                                                disabled={loadingRequest}
                                            />
                                            <label htmlFor="verify-reset-email">{t('settings.passwordReset.email')}</label>
                                        </div>

                                        <Button
                                            type="submit"
                                            loading={loadingRequest}
                                            label={t('settings.passwordReset.button')}
                                            className="btn-neon mt-2 w-full font-display text-sm tracking-widest uppercase"
                                        />
                                    </form>
                                </>
                            )}

                            {!isLoading && status !== 'success' && type === 'reset-password' && (
                                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                                    <p className="text-center text-sm text-muted-foreground">
                                        {t('password.requirements.title')}
                                    </p>

                                    <PasswordInput
                                        inputId="verify-new-password"
                                        label={t('verify.newPassword')}
                                        value={newPassword}
                                        onChange={(event) => setNewPassword(event.target.value)}
                                        placeholder={t('verify.newPassword')}
                                        feedback
                                        disabled={loadingReset}
                                        autoComplete="new-password"
                                        maxLength={128}
                                        className="gap-0"
                                    />

                                    <PasswordInput
                                        inputId="verify-confirm-password"
                                        label={t('verify.confirmPassword')}
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        placeholder={t('verify.confirmPassword')}
                                        feedback={false}
                                        disabled={loadingReset}
                                        autoComplete="new-password"
                                        maxLength={128}
                                        className="gap-0"
                                    />

                                    <Button
                                        type="submit"
                                        loading={loadingReset}
                                        label={t('verify.resetPassword')}
                                        className="btn-neon mt-2 w-full font-display text-sm tracking-widest uppercase"
                                    />
                                </form>
                            )}

                            {!isLoading && status !== 'success' && type !== 'request-password-reset' && type !== 'reset-password' && (
                                <div className="rounded-2xl border border-border bg-card/30 px-6 py-8 text-center">
                                    <p className="text-sm text-muted-foreground">{cardDescription}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
