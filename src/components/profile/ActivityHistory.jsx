'use client';

import React from 'react';
import { Card } from 'primereact/card';

export default function ActivityHistory() {
    return (
        <Card className="bg-slate-700 bg-opacity-15 border-none shadow-lg mt-6">
            <h3 className="text-lg font-bold mb-4">Activity History</h3>
            <p className="text-gray-400 text-sm">No recent activity to display.</p>
        </Card>
    );
}
