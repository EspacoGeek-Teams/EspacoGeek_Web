'use client';

import React from 'react';
import PropTypes from 'prop-types';

const categoryIcons = {
    anime: '🎌',
    series: '📺',
    movies: '🎬',
    games: '🎮',
    vn: '💬',
    books: '📖',
};

const ActivityHistory = ({ entries = [] }) => {
    const sorted = [...entries]
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 8);

    if (sorted.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No recent activity yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {sorted.map((entry, i) => {
                const action =
                    entry.status === 'COMPLETED' ? 'Finished' :
                    entry.status === 'IN_PROGRESS' ? 'Updated' :
                    entry.status === 'PLANNING' ? 'Added' :
                    entry.status === 'PAUSED' ? 'Paused' :
                    'Dropped';

                return (
                    <div key={entry.id} className="flex items-start gap-3 py-3" style={{ animationDelay: `${i * 60}ms` }}>
                        {/* Timeline */}
                        <div className="flex flex-col items-center pt-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            {i < sorted.length - 1 && <div className="w-px flex-1 bg-slate-700 mt-1" />}
                        </div>

                        <div className="flex-1 min-w-0 pb-3">
                            <p className="text-sm text-white">
                                <span className="text-gray-400">{action}</span>{' '}
                                <span className="font-medium">{entry.title}</span>{' '}
                                <span className="text-gray-400">{categoryIcons[entry.category]}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(entry.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActivityHistory;

ActivityHistory.propTypes = {
    entries: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            category: PropTypes.string,
            lastUpdated: PropTypes.string.isRequired,
        })
    ),
};
