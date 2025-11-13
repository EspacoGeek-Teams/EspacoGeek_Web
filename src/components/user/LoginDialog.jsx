import React, { forwardRef, useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Password } from 'primereact/password';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const LoginDialog = forwardRef(({ children = null, title = null, className = '', dialogProps = {} }, ref) => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const toggle = () => setVisible(v => !v);

  useImperativeHandle(ref, () => ({ open, close, toggle, visible }), [visible]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {children ? children({ open, close, toggle, visible }) : (
        <Button link icon="pi pi-sign-in" label={t('nav.login')} className="text-white" onClick={open}><Ripple /></Button>
      )}

      <Dialog
        visible={visible}
        modal
        onHide={close}
        header={title || t('auth.login.title')}
        className={className}
        {...dialogProps}
        content={() => (
          <div className="flex flex-col p-10 gap-6 rounded-xl" style={{ backgroundImage: 'radial-gradient(circle at left top, #052f4a, #0f172b)' }}>
            <h2 className="text-2xl font-bold text-white text-center">{t('auth.login.title')}</h2>

            <IconField iconPosition="left">
              <InputText placeholder={t('auth.login.email')} value={email} className="px-12 p-4 text-xl" onInput={(e) => setEmail(e.target.value)} />
              <InputIcon className={loading ? 'pi pi-spin pi-spinner' : 'pi pi-envelope'} />
            </IconField>

            <IconField iconPosition="left">
              <Password placeholder={t('auth.login.password')} value={password} toggleMask feedback={false} inputClassName="px-12 p-4 text-xl" onInput={(e) => setPassword(e.target.value)} />
              <InputIcon className={loading ? 'pi pi-spin pi-spinner' : 'pi pi-lock'} />
            </IconField>

            <Button label={t('auth.login.button')} rounded onClick={handleLogin} />
            <Button label={t('auth.login.cancel')} onClick={close} outlined />
          </div>
        )}
      />
    </>
  );
});

LoginDialog.displayName = 'LoginDialog';

LoginDialog.propTypes = {
  children: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  dialogProps: PropTypes.object,
};

export default LoginDialog;
