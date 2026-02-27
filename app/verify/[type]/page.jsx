'use client';

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from 'next/navigation';
import Layout from "../../../src/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import requestPasswordReset from "../../../src/components/apollo/schemas/mutations/requestPasswordReset";
import resetPasswordMutation from "../../../src/components/apollo/schemas/mutations/resetPassword";
import verifyEmailChangeMutation from "../../../src/components/apollo/schemas/mutations/verifyEmailChange";

export default function VerifyAccount() {
    const params = useParams();
    const searchParams = useSearchParams();
    const { t } = useTranslation();

    const type = params?.type ?? null;
    const token = searchParams?.get('token') ?? null;

    const [collected, setCollected] = useState({ type: null, token: null });
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const [requestPasswordResetFn, { loading: loadingRequest }] = useMutation(requestPasswordReset);
    const [resetPasswordFn, { loading: loadingReset }] = useMutation(resetPasswordMutation);
    const [verifyEmailChangeFn, { loading: loadingVerify }] = useMutation(verifyEmailChangeMutation);

    useEffect(() => {
        setCollected({ type, token });
        // Aqui você pode acionar a verificação com o backend usando `type` e `token`
        // Exemplo: chamar uma função `verifyAccount(type, token)`
    }, [type, token]);

    useEffect(() => {
        // If the route is verify-email-change and we have a token, call the mutation automatically
        if (type === 'verify-email-change' && token) {
            setMessage(null);
            verifyEmailChangeFn({ variables: { token } })
                .then(res => setMessage(res?.data?.verifyEmailChange ?? 'Verificação concluída'))
                .catch(err => setMessage(err.message));
        }
    }, [type, token]);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const res = await requestPasswordResetFn({ variables: { email } });
            setMessage(res?.data?.requestPasswordReset ?? 'Solicitação enviada');
        } catch (err) {
            setMessage(err.message);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!token) return setMessage('Token ausente');
        if (newPassword.length < 6) return setMessage('Senha muito curta');
        if (newPassword !== confirmPassword) return setMessage('Senhas não coincidem');
        setMessage(null);
        try {
            const res = await resetPasswordFn({ variables: { token, newPassword } });
            setMessage(res?.data?.resetPassword ?? 'Senha alterada com sucesso');
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <Layout>
            <div style={{ padding: 16, maxWidth: 680, margin: '0 auto' }}>
                <h1>{t('verify.title', 'Verificação')}</h1>

                <p><strong>Tipo:</strong> {collected.type ?? 'não informado'}</p>
                <p><strong>Token:</strong> {collected.token ?? 'não informado'}</p>

                {message && <div style={{ margin: '12px 0', color: 'var(--accent)' }}>{message}</div>}

                {type === 'request-password-reset' && (
                    <form onSubmit={handleRequestReset}>
                        <label>
                            {t('auth.email', 'Email')}
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </label>
                        <div style={{ marginTop: 8 }}>
                            <button type="submit" disabled={loadingRequest}>{loadingRequest ? t('loading', 'A enviar...') : t('send', 'Enviar')}</button>
                        </div>
                    </form>
                )}

                {type === 'reset-password' && (
                    <form onSubmit={handleResetPassword}>
                        <label>
                            {t('auth.newPassword', 'Nova senha')}
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                        </label>
                        <label>
                            {t('auth.confirmPassword', 'Confirmar senha')}
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        </label>
                        <div style={{ marginTop: 8 }}>
                            <button type="submit" disabled={loadingReset}>{loadingReset ? t('loading', 'Processando...') : t('auth.resetPassword', 'Resetar senha')}</button>
                        </div>
                    </form>
                )}

                {type === 'verify-email-change' && (
                    <div>
                        <p>{t('verify.verifyEmailChangeInfo', 'Verificando alteração de email...')}</p>
                        {loadingVerify && <p>{t('loading', 'Carregando...')}</p>}
                    </div>
                )}
            </div>
        </Layout>
    );
}