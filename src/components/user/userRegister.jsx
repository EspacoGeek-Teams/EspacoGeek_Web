import React, { useState, useContext, useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useMutation } from "@apollo/client";
import CREATE_USER_MUTATION from "../apollo/schemas/mutations/createUser";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Ripple } from 'primereact/ripple';
import { GlobalLoadingContext } from "../../contexts/GlobalLoadingContext";
import { ErrorContext } from "../../contexts/ErrorContext";
import { SuccessContext } from "../../contexts/SuccessContext";
import { Password } from "primereact/password";
import { useTranslation } from 'react-i18next';

export default function UserRegister() {
    const { t } = useTranslation();
    // Make contexts available for useMutation callbacks
    const { setGlobalLoading } = useContext(GlobalLoadingContext);
    const { showError } = useContext(ErrorContext);
    const { showSuccess } = useContext(SuccessContext);
    const [visibleRegisterCard, setVisibleRegisterCard] = useState(false);

    const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION, {
        errorPolicy: 'all',
        onCompleted: () => {
            showSuccess(t('auth.register.success'));
        },
        onError: (err) => {
            showError(err?.graphQLErrors?.[0]?.message || err?.message || 'Erro inesperado');
        }
    });

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        setGlobalLoading(loading);
    }, [loading, setGlobalLoading]);

    const handleCreateUser = async (username, email, password) => {
        await createUser({
            variables: {
                username,
                email,
                password,
            },
        });
    };

    return (
        <>
            <Button
                link
                icon="pi pi-user-plus"
                label={t('nav.register')}
                type="button"
                className="text-white"
                onClick={() => setVisibleRegisterCard(true)}>
                <Ripple />
            </Button>

            <Dialog
                visible={visibleRegisterCard}
                modal
                onHide={() => setVisibleRegisterCard(false)}
                content={() => (
                    <div className="flex flex-col p-10 gap-6 rounded-xl" style={{ backgroundImage: 'radial-gradient(circle at left top, #052f4a, #0f172b)' }}>
                        <h2 className="text-2xl font-bold text-white text-center">{t('auth.register.title')}</h2>

                        <IconField iconPosition="left">
                            <InputText
                                placeholder={t('auth.register.username')}
                                value={username}
                                autoFocus
                                className="px-12 p-4 text-xl"
                                onInput={(e) => { setUsername(e.target.value); }} />
                            <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-search"} />
                        </IconField>

                        <IconField iconPosition="left">
                            <InputText
                                placeholder={t('auth.register.email')}
                                value={email}
                                className="px-12 p-4 text-xl"
                                onInput={(e) => { setEmail(e.target.value); }} />
                            <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-envelope"} />
                        </IconField>

                        <IconField iconPosition="left">
                            <Password
                                placeholder={t('auth.register.password')}
                                value={password}
                                toggleMask
                                feedback={false} 
                                inputClassName="px-12 p-4 text-xl"
                                onInput={(e) => { setPassword(e.target.value); }} />
                            <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-lock"} />
                        </IconField>

                        <IconField iconPosition="left">
                            <Password
                                placeholder={t('auth.register.confirmPassword')}
                                value={confirmPassword}
                                toggleMask
                                feedback={false} 
                                inputClassName="px-12 p-4 text-xl"
                                onInput={(e) => { setConfirmPassword(e.target.value); }} />
                            <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-lock"} />
                        </IconField>

                        <Button label={t('auth.register.button')} rounded onClick={() => handleCreateUser(username, email, password)} />

                        <Button label={t('auth.register.cancel')} onClick={() => setVisibleRegisterCard(false)} outlined />
                    </div>
                )}
            />
        </>
    )
}
