'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { TopBar, Footer } from '../../../src/components/layout/Layout';
import ProfileHeader from '../../../src/components/profile/ProfileHeader';
import StatsOverview from '../../../src/components/profile/StatsOverview';
import MediaList from '../../../src/components/profile/MediaList';
import ActivityHistory from '../../../src/components/profile/ActivityHistory';
import findUserQuery from '../../../src/components/apollo/schemas/queries/findUser';
import { AuthContext } from '../../../src/contexts/AuthContext';
import { BarChart3, Clock, List } from 'lucide-react';

const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'list', label: 'Library', icon: <List className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" /> },
];

export default function UserProfilePage() {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState('dashboard');
    const { initializing } = useContext(AuthContext);

    const { data, loading, error } = useQuery(findUserQuery, {
        variables: { username },
        skip: !username || initializing,
        context: { suppressErrors: true },
    });

    useEffect(() => {
        document.title = username ? `${username} - EspaçoGeek` : 'Profile - EspaçoGeek';
    }, [username]);

    const profileUser = Array.isArray(data?.findUser)
        ? data.findUser[0] ?? null
        : data?.findUser ?? null;

    if (loading) return (
        <>
            <TopBar />
            <main className="px-4 md:px-16 py-8 min-h-screen" />
            <Footer />
        </>
    );

    if (error || (!loading && !profileUser)) return (
        <>
            <TopBar />
            <main className="px-4 md:px-16 py-8 min-h-screen flex items-center justify-center">
                <p className="text-gray-400 text-lg">User not found.</p>
            </main>
            <Footer />
        </>
    );

    return (
        <>
            <TopBar />
            <main className="px-4 md:px-16 py-8 min-h-screen">
                <ProfileHeader profileUser={profileUser} />

                {/* Tab navigation */}
                <div className="flex gap-1 bg-slate-800 bg-opacity-40 border border-slate-700 rounded-xl p-1 mb-8 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                                activeTab === tab.id
                                    ? 'bg-teal-400 text-slate-900 shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                {/* TODO: StatsOverview and ActivityHistory currently fetch data for the
                    authenticated user. Future work should update them to accept a username
                    and fetch data for the viewed user instead. */}
                <div>
                    {activeTab === 'dashboard' && <StatsOverview />}
                    {activeTab === 'list' && <MediaList />}
                    {activeTab === 'history' && (
                        <div className="max-w-2xl">
                            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                            <ActivityHistory />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

