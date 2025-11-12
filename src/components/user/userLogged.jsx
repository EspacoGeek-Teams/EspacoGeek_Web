import React from "react";
import { Avatar } from 'primereact/avatar';

export default function UserLogged() {
    return (
        <div className="flex flex-wrap align-items-center mr-3">
            <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
        </div>
    );
}
