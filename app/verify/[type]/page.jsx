'use client';

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Layout from "../../../src/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import verifyEmailMutation from "../../../src/components/apollo/schemas/mutations/verifyEmail";
import requestPasswordResetMutation from "../../../src/components/apollo/schemas/mutations/requestPasswordReset";
import resetPasswordMutation from "../../../src/components/apollo/schemas/mutations/resetPassword";
import verifyEmailChangeMutation from "../../../src/components/apollo/schemas/mutations/verifyEmailChange";
import PasswordInput, { isValidPassword } from "../../../src/components/user/PasswordInput";

const MIN_PASSWORD_LENGTH = 6;

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

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold mb-6 text-center">{t('verify.title')}</h1>

                    {isLoading && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <i className="pi pi-spin pi-spinner text-4xl text-blue-500" />
                            <p className="text-gray-500">{t('verify.loading')}</p>
                        </div>
                    )}

                    {!isLoading && status === 'success' && (
                        <div className="flex flex-col items-center gap-3 py-6">
                            <i className="pi pi-check-circle text-5xl text-green-500" />
                            <p className="text-center text-green-700 dark:text-green-400 font-medium">{message}</p>
                            {(type === 'verify-email' || type === 'verify-email-change' || type === 'reset-password') && (
                                <p className="text-sm text-gray-500">{t('verify.redirecting')}</p>
                            )}
                        </div>
                    )}

                    {!isLoading && status === 'error' && (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <i className="pi pi-times-circle text-5xl text-red-500" />
                            <p className="text-center text-red-700 dark:text-red-400 font-medium">{message}</p>
                        </div>
                    )}

                    {!isLoading && status !== 'success' && type === 'request-password-reset' && (
                        <form onSubmit={handleRequestReset} className="flex flex-col gap-4 mt-4">
                            <label className="flex flex-col gap-1">
                                <span className="font-medium">{t('auth.login.email')}</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={loadingRequest}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                            >
                                {t('verify.send')}
                            </button>
                        </form>
                    )}

                    {!isLoading && status !== 'success' && type === 'reset-password' && (
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-4 mt-4">
                            <label className="flex flex-col gap-1">
                                <span className="font-medium">{t('verify.newPassword')}</span>
                                <PasswordInput
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder={t('verify.newPassword')}
                                    feedback
                                    disabled={loadingReset}
                                />
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="font-medium">{t('verify.confirmPassword')}</span>
                                <PasswordInput
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t('verify.confirmPassword')}
                                    feedback={false}
                                    disabled={loadingReset}
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={loadingReset}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                            >
                                {t('verify.resetPassword')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}
