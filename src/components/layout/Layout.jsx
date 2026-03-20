'use client';

import React, { useState, useContext, useRef } from "react";
import SearchBar from "./SearchBar";
import { Toolbar } from "primereact/toolbar";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { SpeedDial } from "primereact/speeddial";
import { ScrollTop } from 'primereact/scrolltop';
import { ProgressBar } from 'primereact/progressbar';
import { GlobalLoadingContext } from "../../contexts/GlobalLoadingContext";
import { UserOptions } from "../user/userOptions";
import { AuthContext } from "../../contexts/AuthContext";
import UserPopUpMenu from "../user/userPopUpMenu";
import { useTranslation } from 'react-i18next';
import { apiUri } from "../apollo/config";
import Image from "next/image";
import Link from "next/link";
import PropTypes from 'prop-types';
// import LanguageSwitcher from "../language/LanguageSwitcher";

export function TopBar() {
    const router = useRouter();
    const { t } = useTranslation();

    const [SearchComponent, setSearchComponent] = useState(false);

    const handleSearchClose = () => setSearchComponent(false);
    const handleSearchShow = () => setSearchComponent(true);

    const handleNavToHome = () => router.push("/");

    const { globalLoading } = useContext(GlobalLoadingContext);
    const { isAuthenticated, initializing, logout, user } = useContext(AuthContext);

    const userMenuRef = useRef(null);
    const registerDialogRef = useRef(null);
    const loginDialogRef = useRef(null);

    const startContent = (
        <div className="flex flex-wrap align-items-center pl-5">
            <Image src="/logo1.png" alt="Logo" className="w-14 h-14" width={56} height={56} />
        </div>
    );

    const centerContent = (
        <div className="flex flex-wrap align-items-center">
            <Button
                onClick={handleNavToHome}
                link
                label={t('nav.home')}
                className="text-white"
                type="button"
                icon="pi pi-home">
                <Ripple />
            </Button>
            <Button
                link
                className="text-white"
                label={t('nav.search')}
                icon="pi pi-search"
                type="button"
                onClick={handleSearchShow}>
                <Ripple />
            </Button>
        </div>
    );

    const finalContent = (
        <div className="flex flex-wrap align-items-center pr-5 gap-2">
            {/* <LanguageSwitcher /> */}
            <UserOptions />
        </div>
    );

    const items = [
        {
            label: t('nav.home'),
            icon: "pi pi-home",
            command: () => handleNavToHome(),
        },
        {
            label: t('nav.search'),
            icon: "pi pi-search",
            command: () => handleSearchShow(),
        },
        ...(initializing ? [] : isAuthenticated ? [
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
            ...(user?.roles?.includes('ROLE_admin') ? [{
                label: t('nav.adminPanel'),
                icon: 'pi pi-lock',
                command: () => router.push('/admin'),
            }] : []),
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => { logout(); }
            }
        ] : [
            {
                label: t('nav.register'),
                icon: "pi pi-user-plus",
                command: () => {
                    registerDialogRef.current && registerDialogRef.current.open();
                },
            },
            {
                label: t('nav.login'),
                icon: "pi pi-sign-in",
                command: () => {
                    loginDialogRef.current && loginDialogRef.current.open();
                },
            }
        ])
    ];

    function pageIsLoading() {
        return document.readyState !== 'complete';
    }

    return (
        <>
            <ProgressBar mode="indeterminate" className="w-full z-40 h-1 fixed top-0 opacity-55" hidden={!pageIsLoading() || !globalLoading} />
            <div className="card pt-2 pl-2 pr-2 hidden md:block">
                <Toolbar
                    start={startContent}
                    center={centerContent}
                    end={finalContent}
                    className="z-40 bg-slate-500 bg-opacity-10 backdrop-blur-sm rounded-full fixed top-2 left-2 right-2 m-0 p-0"
                />
            </div>

            <div className="card block md:hidden fixed right-4 bottom-4 z-50">
                <SpeedDial
                    mask
                    showIcon="pi pi-bars"
                    hideIcon="pi pi-times"
                    className="speeddial-bottom-left right-2 bottom-2 [&_*_.p-speeddial-action]:text-black z-40"
                    buttonClassName="p-button-outlined"
                    transitionDelay={80}
                    model={items}
                    radius={120}
                    direction="up"
                />
            </div>

            {SearchComponent && <SearchBar handleClose={handleSearchClose} />}

            <UserPopUpMenu ref={userMenuRef} />

            <div>
                <ScrollTop className="left-4 md:left-auto md:right-4" />
            </div>
        </>
    );
}

export function Footer() {
    const { t } = useTranslation();
    
    return (
        <footer className="bg-white dark:bg-gray-900 bottom-0 right-0 left-0 !z-40 mt-10 relative">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0 flex items-center">
                        <a href="/" className="flex items-center">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">EG</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-semibold text-gray-900 uppercase dark:text-white">{t('footer.information')}</h2>
                            <Link target="_blank" rel="noreferrer" href={`${apiUri}/graphiql?path=/`} className="hover:underline text-gray-500 dark:text-gray-400 font-medium">{t('footer.api')}</Link>
                            <Link target="_blank" rel="noreferrer" href='/about' className="hover:underline text-gray-500 dark:text-gray-400 font-medium">{t('footer.about')}</Link>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-semibold text-gray-900 uppercase dark:text-white">{t('footer.followUs')}</h2>
                            <Link target="_blank" rel="noreferrer" href="https://github.com/EspacoGeek-Teams" className="hover:underline text-gray-500 dark:text-gray-400 font-medium">{t('footer.github')}</Link>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {new Date().getFullYear()} EspaçoGeek. {t('footer.copyright')}
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default function Layout({ children }) {
    const { t } = useTranslation();
    
    return <>
        <TopBar />
        
        <div className="min-h-screen">
            {children}
        </div>

        <Footer />
    </>
}

Layout.propTypes = {
    children: PropTypes.node
};
