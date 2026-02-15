import React, { useRef, useContext } from 'react';
import { Avatar } from 'primereact/avatar';
import UserPopUpMenu from './userPopUpMenu';
import { AuthContext } from "../../contexts/AuthContext";

export default function UserLogged() {
    const menu = useRef(null);
    const { logout } = useContext(AuthContext);

    const items = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
        },
        {
            label: 'Lists',
            icon: 'pi pi-list',
        },
        {
            label: 'Notifications',
            icon: 'pi pi-bell',
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => { logout(); }
        }
    ];

    return (
        <>
            <div className="flex flex-wrap align-items-center mr-3">
                <Avatar icon="pi pi-user" className="mr-2" shape="circle" onClick={(e) => menu.current.toggle(e)} />
            </div>
            <UserPopUpMenu ref={menu} model={items} />
        </>
    );
}
