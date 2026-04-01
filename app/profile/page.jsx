'use client';

import React, { useContext, useEffect } from 'react';
import { TopBar, Footer } from '../../src/components/layout/Layout';
import ProfileHeader from '../../src/components/profile/ProfileHeader';
import MediaList from '../../src/components/profile/MediaList';
import ActivityHistory from '../../src/components/profile/ActivityHistory';
import { AuthContext } from '../../src/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const STATUS_TABS = ['PLANNING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'DROPPED'];

export default function ProfileDashboard() {
    const [activeTab, setActiveTab] = React.useState('IN_PROGRESS');
    const { isAuthenticated, initializing } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        document.title = 'Dashboard - EspaçoGeek';
    }, []);

    useEffect(() => {
        if (!initializing && !isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, initializing, router]);

    if (initializing) {
        return (
            <>
                <TopBar />
                <main className="px-4 md:px-16 py-8 min-h-screen" />
                <Footer />
            </>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <TopBar />
            <main className="px-4 md:px-16 py-8 min-h-screen">
                <ProfileHeader />
                <div className="flex flex-wrap gap-2 mb-6">
                    {STATUS_TABS.map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                activeTab === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 bg-opacity-30 text-gray-300 hover:bg-opacity-50'
                            }`}
                        >
                            {status.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
                <MediaList status={activeTab} />
                <ActivityHistory />
            </main>
            <Footer />
        </>
    );
}
