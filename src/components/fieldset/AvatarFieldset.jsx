import React from "react";
import PropTypes from 'prop-types';
import { Fieldset } from 'primereact/fieldset';
import { Skeleton } from "primereact/skeleton";
import { Avatar } from "primereact/avatar";

export default function AvatarFieldset({ loading, avatarURL, legend, children }) {
    const legendTemplate = (
        <div className="flex flex-row items-center gap-2 px-2">
            {loading ? <Skeleton shape="circle" size="5rem" /> : <Avatar shape="circle" label={legend?.charAt(0)} image={avatarURL} size="xlarge" />}
            <span className="font-bold">{legend}</span>
        </div>
    );

    return (
        <div className="card">
            <Fieldset legend={legendTemplate}>
                {children}
            </Fieldset>
        </div>
    );
}

AvatarFieldset.propTypes = {
    loading: PropTypes.bool,
    avatarURL: PropTypes.string,
    legend: PropTypes.node,
    children: PropTypes.node,
};

AvatarFieldset.defaultProps = {
    loading: false,
    avatarURL: '',
    legend: null,
    children: null,
};
