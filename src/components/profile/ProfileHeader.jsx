'use client';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { CalendarDays } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

const ProfileHeader = ({ profileUser }) => {
    const { user: authUser } = useContext(AuthContext);
    const user = profileUser || authUser;

    const displayName = user?.displayName || user?.username || 'User';
    const username = user?.username || '';
    const joinedAt = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null;
    const initials = displayName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="relative mb-8">
            {/* Banner placeholder */}
            <div className="h-48 sm:h-64 w-full overflow-hidden relative rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>

            {/* Profile info */}
            <div className="relative -mt-16 sm:-mt-20 pb-6 px-4">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    {/* Avatar placeholder */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-slate-700 border-4 border-slate-950 flex items-center justify-center text-2xl sm:text-3xl font-bold text-blue-400 shadow-xl shrink-0">
                        {initials || '?'}
                    </div>

                    <div className="flex-1 pt-0 sm:pt-6 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                            {displayName}
                        </h1>
                        {username && (
                            <p className="text-gray-400 text-sm mt-0.5">@{username}</p>
                        )}
                        {/* Bio placeholder — API doesn't support it yet */}
                        <p className="text-gray-500 text-sm mt-3 max-w-xl leading-relaxed italic">
                            Bio not available yet.
                        </p>
                        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>{joinedAt ? `Joined ${joinedAt}` : 'Join date not available yet'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProfileHeader.propTypes = {
    profileUser: PropTypes.shape({
        displayName: PropTypes.string,
        username: PropTypes.string,
        createdAt: PropTypes.string,
    }),
};

ProfileHeader.defaultProps = {
    profileUser: null,
};

export default ProfileHeader;
