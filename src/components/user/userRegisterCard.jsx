import React, { useState, useContext, useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import CREATE_USER_MUTATION from "../apollo/schemas/mutations/createUser";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { GlobalLoadingContext } from "../../contexts/GlobalLoadingContext";
import { ErrorContext } from "../../contexts/ErrorContext";
import { SuccessContext } from "../../contexts/SuccessContext";
import { Password } from "primereact/password";

export function UserRegisterCard({ visible, onHide }) {
    // Make contexts available for useMutation callbacks
    const { setGlobalLoading } = useContext(GlobalLoadingContext);
    const { showError } = useContext(ErrorContext);
    const { showSuccess } = useContext(SuccessContext);

    const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION, {
        errorPolicy: 'all',
        onCompleted: () => {
            showSuccess("User registered successfully!");
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
        <div className="card flex justify-content-center">
            <Dialog
                visible={visible}
                modal
                onHide={() => onHide?.()}
                content={() => (
                    <div className="flex flex-col p-10 gap-6 rounded-xl" style={{ backgroundImage: 'radial-gradient(circle at left top, #052f4a, #0f172b)' }}>
                        <h2 className="text-2xl font-bold text-white text-center">Register</h2>

                        <IconField iconPosition="left">
                            <InputText
                                placeholder="Username"
                                value={username}
                                autoFocus
                                className="px-12 p-4 text-xl"
                                onInput={(e) => { setUsername(e.target.value); }} />
                            <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-search"} />
                        </IconField>

                        <IconField iconPosition="left">
                            <InputText
                                placeholder="Email"
                                value={email}
                                className="px-12 p-4 text-xl"
                                onInput={(e) => { setEmail(e.target.value); }} />
                            <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-envelope"} />
                        </IconField>

                        <IconField iconPosition="left">
                            <Password
                                placeholder="Password"
                                value={password}
                                toggleMask
                                feedback={false} 
                                inputClassName="px-12 p-4 text-xl"
                                onInput={(e) => { setPassword(e.target.value); }} />
                            <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-lock"} />
                        </IconField>

                        <IconField iconPosition="left">
                            <Password
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                toggleMask
                                feedback={false} 
                                inputClassName="px-12 p-4 text-xl"
                                onInput={(e) => { setConfirmPassword(e.target.value); }} />
                            <InputIcon className={loading ? "pi pi-spin pi-spinner" : "pi pi-lock"} />
                        </IconField>

                        <Button label="Register" rounded onClick={() => handleCreateUser(username, email, password)} />

                        <Button label="Cancel" onClick={() => onHide?.()} outlined />
                    </div>
                )}
            />
        </div>
    )
}

UserRegisterCard.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func
}
