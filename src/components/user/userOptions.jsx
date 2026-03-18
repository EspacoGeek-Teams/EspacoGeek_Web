import React, { useContext } from "react";
import LoginButton from "./userLogin";
import UserRegister from "./userRegister";
import UserLogged from "./userLogged";
import { AuthContext } from "../../contexts/AuthContext";
import { ProgressSpinner } from 'primereact/progressspinner';

export function UserOptions() {
    const { isAuthenticated, initializing } = useContext(AuthContext);

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
                        <UserRegister />
                        <LoginButton />
                    </div>
                )
            }
        </>
    );
}
