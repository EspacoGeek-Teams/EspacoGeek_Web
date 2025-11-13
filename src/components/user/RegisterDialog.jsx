import React, { forwardRef, useState, useImperativeHandle, useContext } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Password } from 'primereact/password';
import { useMutation } from '@apollo/client';
import CREATE_USER_MUTATION from '../apollo/schemas/mutations/createUser';
import { useTranslation } from 'react-i18next';
import { GlobalLoadingContext } from '../../contexts/GlobalLoadingContext';
import { ErrorContext } from '../../contexts/ErrorContext';
import { SuccessContext } from '../../contexts/SuccessContext';

const RegisterDialog = forwardRef(({ children = null, title = null, className = '', dialogProps = {} }, ref) => {
    const { t } = useTranslation();
    const { setGlobalLoading } = useContext(GlobalLoadingContext);
    const { showError } = useContext(ErrorContext);
    const { showSuccess } = useContext(SuccessContext);

    const [visible, setVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION, {
        errorPolicy: 'all',
        onCompleted: () => showSuccess(t('auth.register.success')),
        onError: (err) => showError(err?.graphQLErrors?.[0]?.message || err?.message || 'Erro inesperado'),
    });

    useImperativeHandle(ref, () => ({ open: () => setVisible(true), close: () => setVisible(false), toggle: () => setVisible(v => !v), visible }), [visible]);

    const handleCreateUser = async () => {
        if (password !== confirmPassword) {
            showError(t('auth.register.passwordMismatch') || 'Passwords do not match');
            return;
        }

        setGlobalLoading(true);
        try {
            await createUser({ variables: { username, email, password } });
            setVisible(false);
        } finally {
            setGlobalLoading(false);
        }
    };

    return (
        <>
            {children ? children({ open: () => setVisible(true), close: () => setVisible(false), toggle: () => setVisible(v => !v), visible }) : (
                <Button link icon="pi pi-user-plus" label={t('nav.register')} className="text-white" onClick={() => setVisible(true)}><Ripple /></Button>
            )}

            <Dialog visible={visible}
                modal
                onHide={() => setVisible(false)}
                header={title || t('auth.register.title')}
                className={className} {...dialogProps}
                content={() => (
                    <div className="flex flex-col p-10 gap-6 rounded-xl" style={{ backgroundImage: 'radial-gradient(circle at left top, #052f4a, #0f172b)' }}>
                        <h2 className="text-2xl font-bold text-white text-center">{t('auth.register.title')}</h2>

                        <IconField iconPosition="left">
                            <InputText placeholder={t('auth.register.username')} value={username} autoFocus className="px-12 p-4 text-xl" onInput={(e) => setUsername(e.target.value)} />
                            <InputIcon className={loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'} />
                        </IconField>

                        <IconField iconPosition="left">
                            <InputText placeholder={t('auth.register.email')} value={email} className="px-12 p-4 text-xl" onInput={(e) => setEmail(e.target.value)} />
                            <InputIcon className={loading ? 'pi pi-spin pi-spinner' : 'pi pi-envelope'} />
                        </IconField>

                        <IconField iconPosition="left">
                            <Password placeholder={t('auth.register.password')} value={password} toggleMask feedback={false} inputClassName="px-12 p-4 text-xl" onInput={(e) => setPassword(e.target.value)} />
                            <InputIcon className={loading ? 'pi pi-spin pi-spinner' : 'pi pi-lock'} />
                        </IconField>

                        <IconField iconPosition="left">
                            <Password placeholder={t('auth.register.confirmPassword')} value={confirmPassword} toggleMask feedback={false} inputClassName="px-12 p-4 text-xl" onInput={(e) => setConfirmPassword(e.target.value)} />
                            <InputIcon className={loading ? 'pi pi-spin pi-spinner' : 'pi pi-lock'} />
                        </IconField>

                        <Button label={t('auth.register.button')} rounded onClick={handleCreateUser} />
                        <Button label={t('auth.register.cancel')} onClick={() => setVisible(false)} outlined />
                    </div>
                )}
             />
        </>
    );
});

RegisterDialog.displayName = 'RegisterDialog';

RegisterDialog.propTypes = {
    children: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    className: PropTypes.string,
    dialogProps: PropTypes.object,
};

export default RegisterDialog;
