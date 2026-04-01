'use client';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import getUserMedia from '../apollo/schemas/queries/getUserMedia';
import { UPSERT_USER_MEDIA } from '../apollo/schemas/mutations/upsertUserMedia';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import { ErrorContext } from '../../contexts/ErrorContext';

export default function MediaList({ status }) {
    const { showError } = useContext(ErrorContext);

    const { data, loading } = useQuery(getUserMedia, {
        variables: { status },
        fetchPolicy: 'cache-and-network',
    });

    const [upsertUserMedia] = useMutation(UPSERT_USER_MEDIA, {
        onError: (err) => showError(err.message),
    });

    function handleProgressIncrement(item) {
        const total = item.media?.totalEpisodes;
        const current = item.progress ?? 0;
        if (total !== null && total !== undefined && current >= total) return;
        const newProgress = current + 1;
        upsertUserMedia({
            variables: {
                input: {
                    mediaId: item.mediaId,
                    status: item.status,
                    progress: newProgress,
                },
            },
            optimisticResponse: {
                upsertUserMedia: {
                    __typename: 'UserMedia',
                    id: item.id,
                    mediaId: item.mediaId,
                    status: item.status,
                    progress: newProgress,
                    score: item.score ?? null,
                    startDate: item.startDate ?? null,
                    finishDate: item.finishDate ?? null,
                    note: item.note ?? null,
                    customStatusId: item.customStatusId ?? null,
                    rewatchCount: item.rewatchCount ?? 0,
                    isPrivate: item.isPrivate ?? false,
                    personalNotes: item.personalNotes ?? null,
                },
            },
        });
    }

    const mediaItems = data?.getUserMedia ?? [];

    if (loading && mediaItems.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-slate-700 bg-opacity-15">
                        <Skeleton width="100%" height="10rem" className="rounded-lg" />
                        <Skeleton width="70%" height="1.2rem" />
                        <Skeleton width="40%" height="1rem" />
                    </div>
                ))}
            </div>
        );
    }

    if (!loading && mediaItems.length === 0) {
        return (
            <div className="flex justify-center items-center py-16 text-gray-400">
                <p>No media found for this status.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {mediaItems.map((item) => (
                <Card
                    key={item.id}
                    className="bg-slate-700 bg-opacity-15 border-none shadow-lg flex flex-col"
                >
                    <div className="flex flex-col gap-3">
                        {item.media?.cover && (
                            <Image
                                src={item.media.cover}
                                alt={item.media?.name ?? 'Media cover'}
                                width="200"
                                className="[&>_img]:rounded-md shadow-md mx-auto"
                                preview
                            />
                        )}
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-base line-clamp-2">
                                {item.media?.name ?? 'Unknown Media'}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {item.media?.mediaCategory?.typeCategory ?? ''}
                            </p>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-gray-300">
                                Progress:{' '}
                                <strong>
                                    {item.progress ?? 0}
                                    {item.media?.totalEpisodes ? ` / ${item.media.totalEpisodes}` : ''}
                                </strong>
                            </span>
                            <Button
                                label="+1"
                                size="small"
                                className="p-button-sm p-button-outlined p-button-info"
                                onClick={() => handleProgressIncrement(item)}
                                aria-label={`Increment progress for ${item.media?.name}`}
                            />
                        </div>
                        {item.score !== null && item.score !== undefined && (
                            <p className="text-sm text-gray-400">Score: {item.score}</p>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}

MediaList.propTypes = {
    status: PropTypes.string.isRequired,
};
