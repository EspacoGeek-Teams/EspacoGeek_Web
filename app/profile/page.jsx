'use client';

import React, { useContext, useEffect, useState } from 'react';
import { TopBar, Footer } from '../../src/components/layout/Layout';
import ProfileHeader from '../../src/components/profile/ProfileHeader';
import StatsOverview from '../../src/components/profile/StatsOverview';
import MediaList from '../../src/components/profile/MediaList';
import ActivityHistory from '../../src/components/profile/ActivityHistory';
import { AuthContext } from '../../src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { BarChart3, Clock, List } from 'lucide-react';

const STATUS_TABS = ['PLANNING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'DROPPED'];

const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'list', label: 'Library', icon: <List className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" /> },
];

export default function ProfileDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [statusFilter, setStatusFilter] = useState('IN_PROGRESS');
    const { isAuthenticated, initializing } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => { document.title = 'Profile - EspaçoGeek'; }, []);
    useEffect(() => {
        if (!initializing && !isAuthenticated) router.replace('/');
    }, [isAuthenticated, initializing, router]);

    if (initializing) return (
        <>
            <TopBar />
            <main className="px-4 md:px-16 py-8 min-h-screen" />
            <Footer />
        </>
    );

    if (!isAuthenticated) return null;

    return (
        <>
            <TopBar />
            <main className="px-4 md:px-16 py-8 min-h-screen">
                <ProfileHeader />

                {/* Tab navigation */}
                <div className="flex gap-1 bg-slate-800 bg-opacity-40 border border-slate-700 rounded-xl p-1 mb-8 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Status filter for Library tab */}
                {activeTab === 'list' && (
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {STATUS_TABS.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.96] ${
                                    statusFilter === s
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-700 bg-opacity-50 text-gray-300 hover:text-white'
                                }`}
                            >
                                {s.replace(/_/g, ' ')}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div>
                    {activeTab === 'dashboard' && <StatsOverview />}
                    {activeTab === 'list' && <MediaList status={statusFilter} />}
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
