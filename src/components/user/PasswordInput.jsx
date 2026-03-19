import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Password } from 'primereact/password';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Divider } from 'primereact/divider';
import { useTranslation } from 'react-i18next';

/**
 * Backend password validation regex (mirrors UserUtils.java in EspacoGeek_API).
 * Requirements:
 *  - 8–70 characters
 *  - At least one digit
 *  - At least one lowercase letter
 *  - At least one uppercase letter
 *  - At least one special character: !*@#$%^&+=
 *  - No whitespace
 */
export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!*@#$%^&+=])(?=\S+$).{8,70}$/;

/**
 * Returns true if the given password satisfies the backend validation rules.
 */
export function isValidPassword(password) {
    return PASSWORD_REGEX.test(password);
}

// PrimeReact Password strength thresholds aligned with our requirements.
const MEDIUM_REGEX = '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})';
const STRONG_REGEX = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!*@#$%^&+=])(?=\\S+$).{8,70}$';

/**
 * Reusable password input built on PrimeReact Password.
 *
 * When `feedback` is true (default) a requirements checklist panel is shown
 * while the field is focused, giving the user real-time visual guidance.
 * An inline error message is displayed once the field has been touched and the
 * value does not satisfy the backend regex.
 *
 * When `feedback` is false the component behaves like a plain masked text
 * input with a show/hide toggle – suitable for "Current Password" or
 * "Confirm Password" fields where requirements are not relevant.
 */
function PasswordInput({
    value = '',
    onChange,
    placeholder,
    loading = false,
    feedback = true,
    inputClassName = 'px-12 p-4 text-xl',
    className = '',
    disabled = false,
}) {
    const { t } = useTranslation();
    const [touched, setTouched] = useState(false);

    const isInvalid = feedback && touched && value.length > 0 && !isValidPassword(value);

    const requirements = [
        { key: 'length', met: value.length >= 8 && value.length <= 70 },
        { key: 'uppercase', met: /[A-Z]/.test(value) },
        { key: 'lowercase', met: /[a-z]/.test(value) },
        { key: 'digit', met: /[0-9]/.test(value) },
        { key: 'special', met: /[!*@#$%^&+=]/.test(value) },
        { key: 'noSpaces', met: value.length > 0 && !/\s/.test(value) },
    ];

    const requirementsPanel = (
        <div className="mt-2 text-sm">
            <Divider />
            <p className="font-semibold mb-2">{t('password.requirements.title')}</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-1">
                {requirements.map(({ key, met }) => (
                    <li key={key} className={`flex items-center gap-2 ${met ? 'text-green-400' : 'text-surface-400'}`}>
                        <i className={`pi ${met ? 'pi-check-circle' : 'pi-circle'}`} />
                        <span>{t(`password.requirements.${key}`)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <IconField iconPosition="left">
                <Password
                    placeholder={placeholder}
                    value={value}
                    toggleMask
                    feedback={feedback}
                    footer={feedback ? requirementsPanel : null}
                    mediumRegex={MEDIUM_REGEX}
                    strongRegex={STRONG_REGEX}
                    inputClassName={inputClassName}
                    onInput={onChange}
                    onBlur={() => setTouched(true)}
                    disabled={disabled}
                    invalid={isInvalid}
                />
                <InputIcon className={loading ? 'pi pi-spin pi-spinner' : 'pi pi-lock'} />
            </IconField>
            {isInvalid && (
                <small className="p-error block">{t('password.invalid')}</small>
            )}
        </div>
    );
}

PasswordInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    loading: PropTypes.bool,
    feedback: PropTypes.bool,
    inputClassName: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default PasswordInput;
