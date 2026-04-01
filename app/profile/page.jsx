'use client';

import React, { useContext, useEffect } from 'react';
import { TopBar, Footer } from '../../src/components/layout/Layout';
import { AuthContext } from '../../src/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
    const { isAuthenticated, initializing, user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => { document.title = 'Profile - EspaçoGeek'; }, []);
    useEffect(() => {
        if (!initializing) {
            if (!isAuthenticated || !user?.username) {
                router.replace('/');
            } else {
                router.replace(`/profile/${user.username}`);
            }
        }
    }, [isAuthenticated, initializing, user, router]);

    return (
        <>
            <TopBar />
            <main className="px-4 md:px-16 py-8 min-h-screen" />
            <Footer />
        </>
    );
}

