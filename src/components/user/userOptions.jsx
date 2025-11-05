import React, { useState, useContext } from "react";
import { Avatar } from 'primereact/avatar';
import { Button } from "primereact/button";
import { UserRegisterCard } from "./userRegisterCard";
import { Ripple } from "primereact/ripple";
import LoginButton from "./LoginButton";
import { AuthContext } from "../../contexts/AuthContext";

export function UserOptions() {
    const [visibleRegisterCard, setVisibleRegisterCard] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <>
            <UserRegisterCard visible={visibleRegisterCard} onHide={() => setVisibleRegisterCard(false)} />
            {
                isAuthenticated ? (
                    <div className="flex flex-wrap align-items-center mr-3">
                        <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
                    </div>
                ) : (
                    <div>
                        <Button
                            link
                            icon="pi pi-user-plus"
                            label="Register"
                            type="button"
                            className="text-white"
                            onClick={() => setVisibleRegisterCard(true)}>
                            <Ripple />
                        </Button>
                        <LoginButton />
                    </div>
                )
            }
        </>
    );
}