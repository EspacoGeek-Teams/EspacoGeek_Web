'use client';

import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Avatar } from 'primereact/avatar';

export default function ProfileHeader() {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex items-center gap-5 p-6 bg-slate-700 bg-opacity-15 rounded-xl shadow mb-6">
            <Avatar
                label={user?.username ? user.username.charAt(0).toUpperCase() : '?'}
                size="xlarge"
                shape="circle"
                className="bg-blue-500 text-white text-2xl font-bold"
            />
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{user?.username ?? 'User'}</h2>
                <p className="text-sm text-gray-400">{user?.email ?? ''}</p>
            </div>
        </div>
    );
}
