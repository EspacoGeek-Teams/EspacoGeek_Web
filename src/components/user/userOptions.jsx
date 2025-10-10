import React, { useState } from "react";
import { Avatar } from 'primereact/avatar';
import { UserRegisterCard } from "./userRegisterCard";

export function UserOptions() {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <UserRegisterCard visible={visible} />
            <div className="flex flex-wrap align-items-center">
                <Avatar icon="pi pi-user" className="mr-2" shape="circle" onClick={() => setVisible(true)} />
            </div>
        </>
    );
}