import React, { useContext, useState } from "react";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Password } from "primereact/password";
import { AuthContext } from "../../contexts/AuthContext";
import { useTranslation } from 'react-i18next';

export default function LoginButton() {
  const { login, openLogin, closeLogin, loginVisible } = useContext(AuthContext);
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button link icon="pi pi-sign-in" label={t('nav.login')} type="button" className="text-white" onClick={openLogin}>
        <Ripple />
      </Button>

      <Dialog
        visible={loginVisible}
        modal
        onHide={closeLogin}
        content={() => (
          <div className="flex flex-col p-10 gap-6 rounded-xl" style={{ backgroundImage: 'radial-gradient(circle at left top, #052f4a, #0f172b)' }}>
            <h2 className="text-2xl font-bold text-white text-center">{t('auth.login.title')}</h2>

            <IconField iconPosition="left">
              <InputText
                placeholder={t('auth.login.email')}
                value={email}
                className="px-12 p-4 text-xl"
                onInput={(e) => { setEmail(e.target.value); }} />
              <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-envelope"} />
            </IconField>

            <IconField iconPosition="left">
              <Password
                placeholder={t('auth.login.password')}
                value={password}
                toggleMask
                feedback={false} 
                inputClassName="px-12 p-4 text-xl"
                onInput={(e) => { setPassword(e.target.value); }} />
              <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-lock"} />
            </IconField>

            <Button label={t('auth.login.button')} rounded onClick={() => handleLogin()} />

            <Button label={t('auth.login.cancel')} onClick={closeLogin} outlined />
          </div>
        )}
      />
    </>
  );
}
