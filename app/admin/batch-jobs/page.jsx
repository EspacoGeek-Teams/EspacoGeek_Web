'use client';

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../src/contexts/AuthContext";
import BatchJobsDashboard from "../../../src/containers/admin/BatchJobsDashboard";
import { ProgressSpinner } from "primereact/progressspinner";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminBatchJobsPage() {
    const { isAuthenticated, isAdmin, initializing } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!initializing && (!isAuthenticated || !isAdmin)) {
            router.replace("/");
        }
    }, [initializing, isAuthenticated, isAdmin, router]);

    if (initializing) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        // Redirect is handled by useEffect; render spinner while redirecting
        return (
            <div className="flex justify-center items-center h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    return <BatchJobsDashboard />;
}
