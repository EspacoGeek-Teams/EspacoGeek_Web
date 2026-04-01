import React, { useRef, useContext } from 'react';
import { Avatar } from 'primereact/avatar';
import UserPopUpMenu from './userPopUpMenu';
import { AuthContext } from "../../contexts/AuthContext";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export default function UserLogged() {
    const menu = useRef(null);
    const { logout, user } = useContext(AuthContext);
    const { t } = useTranslation();
    const router = useRouter();

    const isAdmin = user?.roles?.includes('ROLE_admin');

    const items = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => router.push('/profile'),
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
            label: t('nav.settings'),
            icon: 'pi pi-cog',
            command: () => router.push('/settings'),
        },
        ...(isAdmin ? [
            {
                separator: true
            },
            {
                label: t('nav.adminPanel'),
                icon: 'pi pi-lock',
                command: () => router.push('/admin'),
            }
        ] : []),
        {
            separator: true
        },
        {
            label: t('nav.logout'),
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
