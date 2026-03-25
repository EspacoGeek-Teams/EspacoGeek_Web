import React, { useContext } from "react";
import UserLogged from "./userLogged";
import { AuthContext } from "../../contexts/AuthContext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { useTranslation } from 'react-i18next';

export function UserOptions() {
    const { t } = useTranslation();
    const { isAuthenticated, initializing, openLogin, openRegister } = useContext(AuthContext);

    return (
        <>
            {
                initializing ? (
                    <div className="flex flex-col gap-2 mr-3">
                        <ProgressSpinner className="h-7 w-7" />
                    </div>
                ) : isAuthenticated ? (
                    <UserLogged />
                ) : (
                    <div>
                        <Button
                            link
                            icon="pi pi-user-plus"
                            label={t('nav.register')}
                            type="button"
                            className="text-white"
                            onClick={openRegister}>
                            <Ripple />
                        </Button>
                        <Button
                            link
                            icon="pi pi-sign-in"
                            label={t('nav.login')}
                            type="button"
                            className="text-white"
                            onClick={openLogin}>
                            <Ripple />
                        </Button>
                    </div>
                )
            }
        </>
    );
}
