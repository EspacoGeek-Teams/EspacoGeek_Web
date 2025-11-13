import React, { useState, useContext, useRef } from "react";
import SearchBar from "./SearchBar";
import { Toolbar } from "primereact/toolbar";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { SpeedDial } from "primereact/speeddial";
import { ScrollTop } from 'primereact/scrolltop';
import { ProgressBar } from 'primereact/progressbar';
import { GlobalLoadingContext } from "../../contexts/GlobalLoadingContext";
import { UserOptions } from "../user/userOptions";
import logo1 from '../../assets/logos/logo1.png';
import { Image } from 'primereact/image';
import { AuthContext } from "../../contexts/AuthContext";
import UserPopUpMenu from "../user/userPopUpMenu";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../language/LanguageSwitcher";

export function TopBar() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [SearchComponent, setSearchComponent] = useState(false);

    const handleSearchClose = () => setSearchComponent(false);
    const handleSearchShow = () => setSearchComponent(true);

    const handleNavToHome = () => navigate("/");

    const { globalLoading } = useContext(GlobalLoadingContext);
    const { isAuthenticated, initializing } = useContext(AuthContext);

    const userMenuRef = useRef(null);

    const startContent = (
        <div className="flex flex-wrap align-items-center pl-5">
            <Image src={logo1} alt="Logo" className="w-14 h-14 pt-3" />
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
            command: () => {
                handleNavToHome();
            },
        },
        {
            label: t('nav.search'),
            icon: "pi pi-search",
            command: () => {
                handleSearchShow();
            },
        },
        isAuthenticated && !initializing ? (
            {
                label: t('nav.user'),
                icon: "pi pi-user",
                command: (e) => {
                    userMenuRef.current && userMenuRef.current.toggle(e);
                },
            }
        ) : (
            {
                label: t('nav.register'),
                icon: "pi pi-user-plus",
                command: () => {

                },
            },
            {
                label: t('nav.login'),
                icon: "pi pi-sign-in",
                command: () => {

                },
            }
        ),
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

            <div className="card block md:hidden fixed right-0 bottom-0 z-40">
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
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <a href="/" className="flex items-center">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">EG</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">{t('footer.information')}</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="/api" className="hover:underline">{t('footer.api')}</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">{t('footer.followUs')}</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a target="_blank" rel="noreferrer" href="https://github.com/EspacoGeek-Teams/espacogeek" className="hover:underline ">{t('footer.github')}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://flowbite.com/" className="hover:underline">EspaçoGeek</a>. {t('footer.copyright')}
                    </span>
                </div>
            </div>
        </footer>
    )
}
