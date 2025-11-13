import React from "react";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import LoginDialog from './LoginDialog';
import { useTranslation } from 'react-i18next';

export default function LoginButton() {
  const { t } = useTranslation();

  return (
    <LoginDialog>
      {({ open }) => (
        <Button link icon="pi pi-sign-in" label={t('nav.login')} type="button" className="text-white" onClick={open}>
          <Ripple />
        </Button>
      )}
    </LoginDialog>
  );
}
