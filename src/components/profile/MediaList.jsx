'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Star, LayoutGrid, List, LayoutList } from 'lucide-react';

const statusColors = {
    COMPLETED: 'text-green-400',
    IN_PROGRESS: 'text-blue-400',
    PLANNING: 'text-gray-400',
    DROPPED: 'text-red-400',
    PAUSED: 'text-yellow-400',
};

const statusDots = {
    COMPLETED: 'bg-green-400',
    IN_PROGRESS: 'bg-blue-400',
    PLANNING: 'bg-gray-400',
    DROPPED: 'bg-red-400',
    PAUSED: 'bg-yellow-400',
};

const coverGradients = {
    anime: 'from-teal-600 to-teal-900',
    series: 'from-yellow-500 to-yellow-800',
    movies: 'from-pink-500 to-pink-900',
    games: 'from-purple-500 to-purple-900',
    vn: 'from-blue-500 to-blue-900',
    books: 'from-green-500 to-green-900',
};

const categoryIcons = {
    anime: '🎌',
    series: '📺',
    movies: '🎬',
    games: '🎮',
    vn: '💬',
    books: '📖',
};

const viewModes = [
    { id: 'grid', icon: LayoutGrid, label: 'Grid' },
    { id: 'compact', icon: LayoutList, label: 'Compact' },
    { id: 'list', icon: List, label: 'List' },
];

const statusLabels = {
    COMPLETED: 'Completed',
    IN_PROGRESS: 'In Progress',
    PLANNING: 'Planning',
    DROPPED: 'Dropped',
    PAUSED: 'Paused',
};

const MediaList = ({ status, entries = [] }) => {
    const [viewMode, setViewMode] = useState('grid');

    const filtered = status ? entries.filter((e) => e.status === status) : entries;

    if (filtered.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500">
                <p className="text-lg">Nothing here yet</p>
                <p className="text-sm mt-1">Start tracking to fill this list</p>
            </div>
        );
    }

    return (
        <div>
            {/* View toggle */}
            <div className="flex items-center gap-1 mb-4 bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-1 w-fit">
                {viewModes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setViewMode(mode.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                            viewMode === mode.id
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white hover:bg-slate-700'
                        }`}
                        title={mode.label}
                    >
                        <mode.icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                ))}
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filtered.map((entry, i) => (
                        <div
                            key={entry.id}
                            className="group cursor-pointer"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br ${coverGradients[entry.category] || 'from-slate-600 to-slate-900'} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]`}>
                                <span className="absolute top-2 left-2 text-lg opacity-60">
                                    {categoryIcons[entry.category] || '🎯'}
                                </span>
                                <div className="absolute inset-0 flex items-center justify-center p-3">
                                    <p className="text-white/90 text-sm font-bold text-center leading-tight drop-shadow-md">
                                        {entry.title}
                                    </p>
                                </div>
                                <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${statusDots[entry.status] || 'bg-gray-400'} ring-2 ring-black/20`} />
                                {entry.score && (
                                    <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-semibold text-white tabular-nums">{entry.score}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-2 px-0.5">
                                <h3 className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                    {entry.title}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400">
                                    <span className={statusColors[entry.status] || 'text-gray-400'}>{statusLabels[entry.status] || entry.status}</span>
                                    {entry.progress != null && (
                                        <span>· Ep {entry.progress}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Compact View */}
            {viewMode === 'compact' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filtered.map((entry, i) => (
                        <div
                            key={entry.id}
                            className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-800 bg-opacity-50 border border-slate-700 hover:border-blue-500/30 transition-all duration-200 cursor-pointer"
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <div className={`w-10 h-14 rounded-lg bg-gradient-to-br ${coverGradients[entry.category] || 'from-slate-600 to-slate-900'} flex items-center justify-center shrink-0 shadow-sm`}>
                                <span className="text-sm opacity-80">{categoryIcons[entry.category] || '🎯'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                    {entry.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                                    <span className={statusColors[entry.status] || 'text-gray-400'}>{statusLabels[entry.status] || entry.status}</span>
                                    {entry.progress != null && (
                                        <span>· Ep {entry.progress}</span>
                                    )}
                                </div>
                            </div>
                            {entry.score && (
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs font-semibold text-white tabular-nums">{entry.score}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="border border-slate-700 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2.5 bg-slate-800 bg-opacity-50 text-xs font-semibold text-gray-400 border-b border-slate-700">
                        <span>Title</span>
                        <span className="w-20 text-center">Status</span>
                        <span className="w-16 text-center">Progress</span>
                        <span className="w-12 text-center">Score</span>
                    </div>
                    {filtered.map((entry, i) => (
                        <div
                            key={entry.id}
                            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 items-center border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30 transition-colors cursor-pointer"
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-sm shrink-0">{categoryIcons[entry.category] || '🎯'}</span>
                                <span className="text-sm font-medium text-white truncate">{entry.title}</span>
                            </div>
                            <span className={`w-20 text-center text-xs font-medium ${statusColors[entry.status] || 'text-gray-400'}`}>
                                {statusLabels[entry.status] || entry.status}
                            </span>
                            <span className="w-16 text-center text-xs text-gray-400">
                                {entry.progress != null ? `Ep ${entry.progress}` : '—'}
                            </span>
                            <div className="w-12 flex justify-center">
                                {entry.score ? (
                                    <div className="flex items-center gap-0.5">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-semibold text-white tabular-nums">{entry.score}</span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-500">—</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaList;

MediaList.propTypes = {
    status: PropTypes.string,
    entries: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            category: PropTypes.string,
            progress: PropTypes.number,
            score: PropTypes.number,
        })
    ),
};
