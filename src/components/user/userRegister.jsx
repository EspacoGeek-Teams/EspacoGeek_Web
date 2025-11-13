import React, { useContext, useEffect } from "react";
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import RegisterDialog from './RegisterDialog';
import { GlobalLoadingContext } from "../../contexts/GlobalLoadingContext";
import { useTranslation } from 'react-i18next';

export default function UserRegister() {
  const { t } = useTranslation();
  const { setGlobalLoading } = useContext(GlobalLoadingContext);

  useEffect(() => {
    return () => {
      setGlobalLoading(false);
    };
  }, [setGlobalLoading]);

  return (
    <RegisterDialog>
      {({ open }) => (
        <Button
          link
          icon="pi pi-user-plus"
          label={t('nav.register')}
          type="button"
          className="text-white"
          onClick={open}>
          <Ripple />
        </Button>
      )}
    </RegisterDialog>
  )
}
