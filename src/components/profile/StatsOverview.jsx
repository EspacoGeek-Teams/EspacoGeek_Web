'use client';

import React from 'react';

const categoryColorMap = {
    anime: 'bg-teal-500',
    series: 'bg-yellow-500',
    movies: 'bg-pink-500',
    games: 'bg-purple-500',
    vn: 'bg-blue-500',
    books: 'bg-green-500',
};

const categoryLabels = {
    anime: 'Anime',
    series: 'Series',
    movies: 'Movies',
    games: 'Games',
    vn: 'Visual Novels',
    books: 'Books',
};

const categoryIcons = {
    anime: '🎌',
    series: '📺',
    movies: '🎬',
    games: '🎮',
    vn: '💬',
    books: '📖',
};

const StatsOverview = () => {
    const categories = Object.keys(categoryLabels);

    return (
        <div className="space-y-6">
            <p className="text-xs text-gray-500 italic">Stats will load from your account once API integration is complete.</p>
            {/* Global stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-800 bg-opacity-50 p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Total Completed</p>
                    <p className="text-3xl font-bold tabular-nums mt-1 text-white">—</p>
                </div>
                <div className="rounded-xl bg-slate-800 bg-opacity-50 p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Hours Tracked</p>
                    <p className="text-3xl font-bold tabular-nums mt-1 text-white">—</p>
                </div>
            </div>

            {/* Per-category breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                    <div key={cat} className="rounded-xl bg-slate-800 bg-opacity-50 border border-slate-700 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 rounded-full ${categoryColorMap[cat]}`} />
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                {categoryIcons[cat]} {categoryLabels[cat]}
                            </span>
                        </div>
                        <p className="text-2xl font-bold tabular-nums text-white">—</p>
                        <p className="text-xs text-gray-500 mt-1">— active · — planned</p>
                        <div className="mt-3 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                            <div className={`h-full rounded-full ${categoryColorMap[cat]} transition-all duration-500`} style={{ width: '0%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsOverview;
