import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const menuRef = useRef(null);

  const items = [
    {
      label: 'English',
      icon: 'pi pi-globe',
      command: () => {
        i18n.changeLanguage('en');
      },
    },
    {
      label: 'Português',
      icon: 'pi pi-globe',
      command: () => {
        i18n.changeLanguage('pt');
      },
    },
  ];

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'pt' ? 'PT' : 'EN';
  };

  return (
    <>
      <Button
        link
        label={getCurrentLanguageLabel()}
        icon="pi pi-globe"
        className="text-white"
        onClick={(e) => menuRef.current && menuRef.current.toggle(e)}
        aria-label="Change language"
      />
      <Menu model={items} popup ref={menuRef} />
    </>
  );
}
