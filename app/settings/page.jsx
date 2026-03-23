'use client';

import React, { useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import GenericTextPage from '../../src/containers/about/GenericTextPage';
import { AuthContext } from '../../src/contexts/AuthContext';
import { ErrorContext } from '../../src/contexts/ErrorContext';
import { SuccessContext } from '../../src/contexts/SuccessContext';
import { GlobalLoadingContext } from '../../src/contexts/GlobalLoadingContext';
import PasswordInput, { isValidPassword } from '../../src/components/user/PasswordInput';
import EDIT_USERNAME_USER from '../../src/components/apollo/schemas/mutations/editUsernameUser';
import EDIT_EMAIL_USER from '../../src/components/apollo/schemas/mutations/editEmailUser';
import EDIT_PASSWORD_USER from '../../src/components/apollo/schemas/mutations/editPasswordUser';
import REQUEST_PASSWORD_RESET from '../../src/components/apollo/schemas/mutations/requestPasswordReset';
import DELETE_USER from '../../src/components/apollo/schemas/mutations/deleteUser';

export default function SettingsPage() {
    const { t } = useTranslation();
    const { isAuthenticated, initializing, user, logout } = useContext(AuthContext);
    const { showError } = useContext(ErrorContext);
    const { showSuccess } = useContext(SuccessContext);
    const { setGlobalLoading } = useContext(GlobalLoadingContext);
    const router = useRouter();

    // Username section
    const [newUsername, setNewUsername] = useState('');

    // Email section
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');

    // Password section
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Password reset section
    const [resetEmail, setResetEmail] = useState('');

    // Delete account section
    const [deletePassword, setDeletePassword] = useState('');

    const [editUsername, { loading: loadingUsername }] = useMutation(EDIT_USERNAME_USER, {
        errorPolicy: 'all',
        onCompleted: () => {
            showSuccess(t('settings.username.success'));
            setNewUsername('');
        },
        onError: (err) => showError(err?.graphQLErrors?.[0]?.message || err?.message || t('errors.generic')),
    });

    const [editEmail, { loading: loadingEmail }] = useMutation(EDIT_EMAIL_USER, {
        errorPolicy: 'all',
        onCompleted: () => {
            showSuccess(t('settings.email.success'));
            setNewEmail('');
            setEmailPassword('');
        },
        onError: (err) => showError(err?.graphQLErrors?.[0]?.message || err?.message || t('errors.generic')),
    });

    const [editPassword, { loading: loadingPassword }] = useMutation(EDIT_PASSWORD_USER, {
        errorPolicy: 'all',
        onCompleted: () => {
            showSuccess(t('settings.password.success'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        },
        onError: (err) => showError(err?.graphQLErrors?.[0]?.message || err?.message || t('errors.generic')),
    });

    const [requestPasswordReset, { loading: loadingReset }] = useMutation(REQUEST_PASSWORD_RESET, {
        errorPolicy: 'all',
        onCompleted: () => {
            showSuccess(t('settings.passwordReset.success'));
            setResetEmail('');
        },
        onError: (err) => showError(err?.graphQLErrors?.[0]?.message || err?.message || t('errors.generic')),
    });

    const [deleteUser, { loading: loadingDelete }] = useMutation(DELETE_USER, {
        errorPolicy: 'all',
        onCompleted: () => {
            showSuccess(t('settings.deleteAccount.success'));
            logout();
            router.push('/');
        },
        onError: (err) => showError(err?.graphQLErrors?.[0]?.message || err?.message || t('errors.generic')),
    });

    const handleUpdateUsername = async () => {
        if (!newUsername.trim()) {
            showError(t('settings.username.required'));
            return;
        }
        setGlobalLoading(true);
        try {
            await editUsername({ variables: { newUsername: newUsername.trim() } });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!newEmail.trim()) {
            showError(t('settings.email.required'));
            return;
        }
        if (!emailPassword) {
            showError(t('settings.email.passwordRequired'));
            return;
        }
        setGlobalLoading(true);
        try {
            await editEmail({ variables: { newEmail: newEmail.trim(), password: emailPassword } });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!isValidPassword(newPassword)) {
            showError(t('settings.password.invalid'));
            return;
        }
        if (newPassword !== confirmPassword) {
            showError(t('settings.password.mismatch'));
            return;
        }
        setGlobalLoading(true);
        try {
            await editPassword({ variables: { actualPassword: currentPassword, newPassword } });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleRequestPasswordReset = async () => {
        if (!resetEmail.trim()) {
            showError(t('settings.passwordReset.required'));
            return;
        }
        setGlobalLoading(true);
        try {
            await requestPasswordReset({ variables: { email: resetEmail.trim() } });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        if (!deletePassword) {
            showError(t('settings.deleteAccount.required'));
            return;
        }
        confirmDialog({
            message: t('settings.deleteAccount.confirm'),
            header: t('settings.deleteAccount.title'),
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                setGlobalLoading(true);
                try {
                    await deleteUser({ variables: { password: deletePassword } });
                } finally {
                    setGlobalLoading(false);
                }
            },
        });
    };

    if (initializing) {
        return (
            <GenericTextPage>
                <div className="flex justify-center items-center py-10">
                    <ProgressSpinner />
                </div>
            </GenericTextPage>
        );
    }

    if (!isAuthenticated) {
        return (
            <GenericTextPage>
                <div className="flex flex-col items-center gap-4 py-10">
                    <i className="pi pi-lock text-4xl text-gray-400" />
                    <p className="text-lg">{t('settings.accessDenied')}</p>
                    <Button
                        label={t('nav.home')}
                        icon="pi pi-home"
                        onClick={() => router.push('/')}
                    />
                </div>
            </GenericTextPage>
        );
    }

    const sectionClass = "flex flex-col gap-4 p-6 rounded-xl border border-gray-700 bg-[--bg-second]";
    const sectionTitleClass = "text-xl font-semibold mb-2";

    return (
        <GenericTextPage>
            <ConfirmDialog />
            <h2 className="text-2xl font-bold mb-8">{t('settings.title')}</h2>

            {user?.username && (
                <p className="text-gray-400 mb-6">{user.username}</p>
            )}

            <div className="flex flex-col gap-6">

                {/* Change Username */}
                <div className={sectionClass}>
                    <h3 className={sectionTitleClass}>{t('settings.username.title')}</h3>
                    <InputText
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder={t('settings.username.newUsername')}
                        disabled={loadingUsername}
                        className="w-full"
                    />
                    <Button
                        label={t('settings.username.button')}
                        icon="pi pi-user-edit"
                        onClick={handleUpdateUsername}
                        loading={loadingUsername}
                        className="w-full md:w-auto"
                    />
                </div>

                {/* Change Email */}
                <div className={sectionClass}>
                    <h3 className={sectionTitleClass}>{t('settings.email.title')}</h3>
                    <InputText
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={t('settings.email.newEmail')}
                        type="email"
                        disabled={loadingEmail}
                        className="w-full"
                    />
                    <PasswordInput
                        placeholder={t('settings.email.password')}
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        loading={loadingEmail}
                        feedback={false}
                        inputClassName="w-full"
                    />
                    <Button
                        label={t('settings.email.button')}
                        icon="pi pi-envelope"
                        onClick={handleUpdateEmail}
                        loading={loadingEmail}
                        className="w-full md:w-auto"
                    />
                </div>

                {/* Change Password */}
                <div className={sectionClass}>
                    <h3 className={sectionTitleClass}>{t('settings.password.title')}</h3>
                    <PasswordInput
                        placeholder={t('settings.password.currentPassword')}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        loading={loadingPassword}
                        feedback={false}
                    />
                    <PasswordInput
                        placeholder={t('settings.password.newPassword')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        loading={loadingPassword}
                        feedback={true}
                    />
                    <PasswordInput
                        placeholder={t('settings.password.confirmPassword')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        loading={loadingPassword}
                        feedback={false}
                    />
                    <Button
                        label={t('settings.password.button')}
                        icon="pi pi-key"
                        onClick={handleUpdatePassword}
                        loading={loadingPassword}
                        className="w-full md:w-auto"
                    />
                </div>

                {/* Password Reset */}
                <div className={sectionClass}>
                    <h3 className={sectionTitleClass}>{t('settings.passwordReset.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('settings.passwordReset.description')}</p>
                    <InputText
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder={t('settings.passwordReset.email')}
                        type="email"
                        disabled={loadingReset}
                        className="w-full"
                    />
                    <Button
                        label={t('settings.passwordReset.button')}
                        icon="pi pi-send"
                        onClick={handleRequestPasswordReset}
                        loading={loadingReset}
                        severity="secondary"
                        className="w-full md:w-auto"
                    />
                </div>

                {/* Delete Account */}
                <div className={sectionClass} style={{ borderColor: 'var(--red-400, #f87171)' }}>
                    <h3 className={`${sectionTitleClass} text-red-400`}>{t('settings.deleteAccount.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('settings.deleteAccount.description')}</p>
                    <PasswordInput
                        placeholder={t('settings.deleteAccount.password')}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        loading={loadingDelete}
                        feedback={false}
                    />
                    <Button
                        label={t('settings.deleteAccount.button')}
                        icon="pi pi-trash"
                        onClick={handleDeleteAccount}
                        loading={loadingDelete}
                        severity="danger"
                        className="w-full md:w-auto"
                    />
                </div>

            </div>
        </GenericTextPage>
    );
}
