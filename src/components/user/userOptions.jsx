import React, { useState } from "react";
import { Avatar } from 'primereact/avatar';
import { Button } from "primereact/button";
import { UserRegisterCard } from "./userRegisterCard";
import { Ripple } from "primereact/ripple";

export function UserOptions() {
    const [visibleRegisterCard, setVisibleRegisterCard] = useState(false);

    return (
        <>
            <UserRegisterCard visible={visibleRegisterCard} onHide={() => setVisibleRegisterCard(false)} />
            
            {
                // TODO condition for logged in user
                false ? (
                    <div className="flex flex-wrap align-items-center mr-3">
                        <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
                    </div>
                )
                :
                (
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
                        <Button
                            link
                            icon="pi pi-sign-in"
                            label="Login"
                            type="button"
                            className="text-white">
                            <Ripple />
                        </Button>
                    </div>   
                )
            }
        
        </>
    );
}