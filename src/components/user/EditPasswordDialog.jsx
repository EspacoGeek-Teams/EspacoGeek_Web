import React, { forwardRef, useState, useImperativeHandle, useContext } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useMutation } from '@apollo/client';
import EDIT_PASSWORD_USER from '../apollo/schemas/mutations/editPasswordUser';
import { useTranslation } from 'react-i18next';
import { GlobalLoadingContext } from '../../contexts/GlobalLoadingContext';
import { ErrorContext } from '../../contexts/ErrorContext';
import { SuccessContext } from '../../contexts/SuccessContext';
import PasswordInput, { isValidPassword } from './PasswordInput';

const EditPasswordDialog = forwardRef(({ children = null, title = null, className = '', dialogProps = {} }, ref) => {
    const { t } = useTranslation();
    const { setGlobalLoading } = useContext(GlobalLoadingContext);
    const { showError } = useContext(ErrorContext);
    const { showSuccess } = useContext(SuccessContext);

    const [visible, setVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [editPassword, { loading }] = useMutation(EDIT_PASSWORD_USER, {
        errorPolicy: 'all',
        onCompleted: () => {
            showSuccess(t('auth.changePassword.success'));
            resetForm();
            setVisible(false);
        },
        onError: (err) => showError(err?.graphQLErrors?.[0]?.message || err?.message || t('errors.generic')),
    });

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: () => setVisible(false),
        toggle: () => setVisible(v => !v),
        visible,
    }), [visible]);

    const handleEditPassword = async () => {
        if (!isValidPassword(newPassword)) {
            showError(t('auth.changePassword.passwordInvalid'));
            return;
        }

        if (newPassword !== confirmPassword) {
            showError(t('auth.changePassword.passwordMismatch'));
            return;
        }

        setGlobalLoading(true);
        try {
            await editPassword({ variables: { actualPassword: currentPassword, newPassword } });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleHide = () => {
        resetForm();
        setVisible(false);
    };

    return (
        <>
            {children
                ? children({ open: () => setVisible(true), close: () => setVisible(false), toggle: () => setVisible(v => !v), visible })
                : null}

            <Dialog
                visible={visible}
                modal
                onHide={handleHide}
                header={title || t('auth.changePassword.title')}
                className={className}
                {...dialogProps}
                content={() => (
                    <div className="flex flex-col p-10 gap-6 rounded-xl" style={{ backgroundImage: 'radial-gradient(circle at left top, #052f4a, #0f172b)' }}>
                        <h2 className="text-2xl font-bold text-white text-center">{t('auth.changePassword.title')}</h2>

                        <PasswordInput
                            placeholder={t('auth.changePassword.currentPassword')}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            loading={loading}
                            feedback={false}
                        />

                        <PasswordInput
                            placeholder={t('auth.changePassword.newPassword')}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            loading={loading}
                            feedback={true}
                        />

                        <PasswordInput
                            placeholder={t('auth.changePassword.confirmPassword')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            loading={loading}
                            feedback={false}
                        />

                        <Button label={t('auth.changePassword.button')} rounded onClick={handleEditPassword} />
                        <Button label={t('auth.changePassword.cancel')} onClick={handleHide} outlined />
                    </div>
                )}
            />
        </>
    );
});

EditPasswordDialog.displayName = 'EditPasswordDialog';

EditPasswordDialog.propTypes = {
    children: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    className: PropTypes.string,
    dialogProps: PropTypes.object,
};

export default EditPasswordDialog;
