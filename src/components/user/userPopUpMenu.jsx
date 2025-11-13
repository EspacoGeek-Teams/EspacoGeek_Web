import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { TieredMenu } from 'primereact/tieredmenu';

const UserPopUpMenu = forwardRef(({ model = undefined, children = null, breakpoint = '767px' }, ref) => {
    const menuRef = useRef(null);

    useImperativeHandle(ref, () => ({
        toggle: (e) => menuRef.current && menuRef.current.toggle(e)
    }), []);

    const handleToggle = (e) => {
        if (menuRef.current) menuRef.current.toggle(e);
    };

    return (
        <>
            {children ? children({ toggle: handleToggle }) : null}
            <TieredMenu model={model} popup ref={menuRef} breakpoint={breakpoint} />
        </>
    );
});

UserPopUpMenu.displayName = 'UserPopUpMenu';

UserPopUpMenu.propTypes = {
    model: PropTypes.array,
    children: PropTypes.func,
    breakpoint: PropTypes.string,
};

export default UserPopUpMenu;
