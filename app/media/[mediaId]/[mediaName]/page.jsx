'use client';

import React, { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { TopBar, Footer } from "../../../../src/components/layout/Layout";
import { useQuery, useMutation } from "@apollo/client";
import mediaQuery from "../../../../src/components/apollo/schemas/queries/mediaQuery";
import { UPSERT_USER_MEDIA } from "../../../../src/components/apollo/schemas/mutations/upsertUserMedia";
import '../../../../src/containers/media/media.css';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import { GlobalLoadingContext } from "../../../../src/contexts/GlobalLoadingContext";
import { ScrollPanel } from 'primereact/scrollpanel';
import YouTube from "../../../../src/components/youTubeEmbed/YouTubeEmbed";
import { Timeline } from 'primereact/timeline';
import { Divider } from 'primereact/divider';
import { AuthContext } from "../../../../src/contexts/AuthContext";
import { ErrorContext } from "../../../../src/contexts/ErrorContext";
import { SuccessContext } from "../../../../src/contexts/SuccessContext";

const STATUS_OPTIONS = ['PLANNING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'DROPPED'];

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Page({ params }) {
    const [mediaId, setMediaId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    useEffect(() => {
        const resolveParams = async () => {
            // In Next.js 15+, params itself is a Promise
            const resolvedParams = await params;
            setMediaId(resolvedParams.mediaId);
        };
        resolveParams();
    }, [params]);

    const { loading, data } = useQuery(mediaQuery, { 
        variables: { id: mediaId },
        skip: !mediaId 
    });
    const { setGlobalLoading } = useContext(GlobalLoadingContext);
    const { isAuthenticated } = useContext(AuthContext);
    const { showError } = useContext(ErrorContext);
    const { showSuccess } = useContext(SuccessContext);

    const [upsertUserMedia, { loading: upsertLoading }] = useMutation(UPSERT_USER_MEDIA, {
        onCompleted: (mutationData) => {
            const status = mutationData?.upsertUserMedia?.status;
            if (status) setSelectedStatus(status);
            showSuccess('Media added to your list!');
            setShowStatusMenu(false);
        },
        onError: (err) => {
            setSelectedStatus('');
            showError(err.message);
        },
    });

    function handleAddToList(status) {
        if (!mediaId) return;

        const parsedId = parseInt(mediaId, 10);
        if (Number.isNaN(parsedId)) {
            showError('Invalid media ID.');
            return;
        }

        upsertUserMedia({
            variables: {
                input: {
                    mediaId: parsedId,
                    status,
                },
            },
        });
    }

    useEffect(() => {
        setGlobalLoading(loading);
    }, [loading, setGlobalLoading]);

    useEffect(() => {
        document.title = `${data?.media?.name ?? 'Media'} - EspaçoGeek`;
    }, [data?.media?.name]);

    function convertDateFormat(dateString) {
        if (!dateString) return '';
        const date = dateString.split(/\s+/g)[0];
        const parts = date.replace(/-/g, '/').replace('00:00:00.0', '').replace(/\s+/g, '').split('/');
        if (parts.length !== 3) {
            return '';
        }
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    }

    // eslint-disable-next-line no-unused-vars
    const seasonMarker = (item) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1">
                <i className="pi pi-circle"></i>
            </span>
        );
    };

    const sessonContent = (item) => {
        return (
            <div className="mr-8 md:mr-0">
                <Divider align="center" className="[&>.p-divider-content]:bg-mainBgColor before:border-solid before:border-t-[1px] before:border-[#e5e7eb] -mt-1 hidden md:inline-flex">
                    <div className="inline-flex align-items-center">
                        <b>{item?.airDate ? convertDateFormat(item?.airDate).split('/')[2] : 'TBA'}</b>
                    </div>
                </Divider>
                <div className="md:hidden flex flex-col -mt-3">
                    <strong>{item?.airDate ? convertDateFormat(item?.airDate).split('/')[2] : 'TBA'}</strong>
                    <p>{item?.name}</p>
                </div>
                <p className="text-center -mt-5 hidden md:block">{item?.name}</p>
                <div className="hidden md:block">
                    {item.cover && <Image src={item?.cover} alt={data?.media.name} width="200" className="[&>_img]:rounded-md shadow-1 mr-6 md:mr-0" preview />}
                </div>
                <div className="block md:hidden">
                    {item.cover && <Image src={item?.cover} alt={data?.media.name} className="[&>_img]:rounded-md shadow-1 w-36" preview />}
                </div>
            </div>
        );
    };

    if (!mediaId) {
        return null;
    }

    return (
        <>
            <TopBar />
            <div className="relative -top-28 z-0">
                <div className="w-full h-96 bg-cover bg-no-repeat bg-[50%_35%] absolute top-0" style={{ backgroundImage: `url(${data?.media.banner})` }} hidden={loading}>
                    <div className="w-full h-full backdropmask"></div>
                </div>
                <Skeleton width="100%" height="24rem" className="!absolute top-0" hidden={!loading}>
                    <div className="w-full h-full backdropmask"></div>
                </Skeleton>
            </div>
            <div className="relative top-24 pl-0 flex gap-5 flex-col items-center md:pl-28 md:flex-row md:justify-start">
                <div className="w-56">
                    <Skeleton width="100%" height="14rem" className="rounded-lg shadow-2xl" hidden={!loading} />
                    <Image src={data?.media.cover} alt={data?.media.name} width="250" className="[&>_img]:rounded-md shadow-2xl" preview />
                </div>
                <div className="flex gap-1 flex-col items-center md:items-start">
                    <div className="md:pt-10 w-25 md:w-[30rem]">
                        <Skeleton width="100%" height="2rem" hidden={!loading} />
                        <h2 className="text-3xl font-bold" hidden={loading}>{data?.media.name}</h2>
                    </div>
                    <div className="pt-5 md:w-[30rem] p-5 md:p-0">
                        <Skeleton className="mb-2" hidden={!loading} />
                        <Skeleton width="10rem" className="mb-2" hidden={!loading} />
                        <Skeleton className="mb-2" hidden={!loading} />
                        <Skeleton width="5rem" className="mb-2" hidden={!loading} />
                        <Skeleton className="mb-2" hidden={!loading} />
                        <Skeleton className="mb-2" hidden={!loading} />
                        <ScrollPanel className="w-full md:h-40">
                            <p hidden={loading}>{data?.media.about}</p>
                        </ScrollPanel>
                    </div>
                    {isAuthenticated && !loading && (
                        <div className="relative mt-4">
                            <Button
                                label={selectedStatus ? selectedStatus.replace(/_/g, ' ') : 'Add to List'}
                                icon={upsertLoading ? 'pi pi-spin pi-spinner' : 'pi pi-plus'}
                                className="p-button-info"
                                onClick={() => setShowStatusMenu((prev) => !prev)}
                                disabled={upsertLoading}
                                aria-haspopup="true"
                                aria-expanded={showStatusMenu}
                                aria-label="Add to List"
                            />
                            {showStatusMenu && (
                                <div
                                    role="menu"
                                    aria-label="Select status"
                                    className="absolute left-0 mt-1 w-48 rounded-lg shadow-lg bg-slate-800 border border-slate-600 z-50"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') setShowStatusMenu(false);
                                    }}
                                >
                                    {STATUS_OPTIONS.map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            role="menuitem"
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg"
                                            onClick={() => handleAddToList(status)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleAddToList(status);
                                                }
                                            }}
                                        >
                                            {status.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="relative flex flex-col-reverse md:flex-row items-center md:pl-28 pt-28 md:items-start gap-5">
                <Card className="w-80 md:w-56 bg-slate-700 bg-opacity-15 border-none shadow-lg">
                    <div className="flex w-full h-full flex-col gap-4 p-0 m-0">
                        <div>
                            <Skeleton width="70%" height="1rem" hidden={!loading} />
                            <Skeleton width="5rem" height="0.5rem" className="mb-2 mt-2" hidden={!loading} />
                            <p className="text-1x1 font-bold" hidden={loading}>Category</p>
                            <p className="pt-2" hidden={loading}>{data?.media?.mediaCategory?.typeCategory}</p>
                        </div>
                        <div className={data?.media?.genre === null ? "hidden" : ""}>
                            <Skeleton width="70%" height="1rem" hidden={!loading} />
                            <Skeleton width="5rem" height="0.5rem" className="mb-2 mt-2" hidden={!loading} />
                            <p className="text-1x1 font-bold">Genres</p>
                            {data?.media?.genre.slice(0, -1).map(genre => genre?.name).join(", ")}
                            {data?.media?.genre.length > 1 ? ` and ${data?.media?.genre[data?.media?.genre.length - 1].name}` : data?.media?.genre[0]?.name}
                        </div>
                        <div className={data?.media?.season === null ? "hidden" : ""}>
                            <Skeleton width="70%" height="1rem" hidden={!loading} />
                            <Skeleton width="5rem" height="0.5rem" className="mb-2 mt-2" hidden={!loading} />
                            <p className="text-1x1 font-bold">Total Seasons</p>
                            <p className="pt-2">{data?.media?.season.length}</p>
                        </div>
                        <div className={data?.media?.totalEpisodes === null ? "hidden" : ""}>
                            <Skeleton width="70%" height="1rem" hidden={!loading} />
                            <Skeleton width="5rem" height="0.5rem" className="mb-2 mt-2" hidden={!loading} />
                            <p className="text-1x1 font-bold">Total Episodes</p>
                            <p className="pt-2">{data?.media?.totalEpisodes}</p>
                        </div>
                        <div className={data?.media?.episodeLength === null ? "hidden" : ""}>
                            <Skeleton width="70%" height="1rem" hidden={!loading} />
                            <Skeleton width="5rem" height="0.5rem" className="mb-2 mt-2" hidden={!loading} />
                            <p className="text-1x1 font-bold">Episode Length</p>
                            <p className="pt-2">{data?.media?.episodeLength} minutes</p>
                        </div>
                        <div className={data?.media?.alternativeTitles === null ? "hidden" : ""}>
                            <Skeleton width="70%" height="1rem" hidden={!loading} />
                            <Skeleton width="5rem" height="0.5rem" className="mb-2 mt-2" hidden={!loading} />
                            <p className="text-1x1 font-bold">Others Tittles</p>
                            {data?.media?.alternativeTitles.slice(0, -1).map(alternativeTitles => alternativeTitles?.name).join(", ")}
                            {data?.media?.alternativeTitles.length > 1 ? ` and ${data?.media?.alternativeTitles[data?.media?.alternativeTitles.length - 1].name}` : data?.media?.alternativeTitles[0]?.name}
                        </div>
                    </div>
                </Card>
                <div className="h-full w-72 md:w-1/2">
                    {data?.media?.externalReference?.filter(reference => reference.typeReference.nameReference === 'YouTube')[0]?.reference &&
                        <>
                            <Skeleton width="100%" height="20rem" className="rounded-lg m-0 p-0" hidden={!loading} />
                            <div hidden={loading}>
                                <YouTube videoId={data?.media?.externalReference?.filter(reference => reference.typeReference.nameReference === 'YouTube')[0]?.reference} />
                            </div>
                        </>
                    }
                </div>
                {data?.media?.season &&
                    <div className="h-full w-72">
                        <ScrollPanel className="w-full md:h-[34rem] hidden md:block">
                            <Timeline
                                value={data?.media?.season}
                                align="alternate"
                                layout="vertical"
                                className="customized-timeline"
                                marker={seasonMarker}
                                content={sessonContent} />
                        </ScrollPanel>
                        <ScrollPanel className="md:h-[34rem] md:hidden">
                            <Timeline
                                value={data?.media?.season}
                                align="top"
                                layout="horizontal"
                                className="customized-timeline"
                                marker={seasonMarker}
                                content={sessonContent} />
                        </ScrollPanel>
                    </div>}
            </div>
            <Footer />
        </>
    );
}

Page.propTypes = {
    params: PropTypes.any,
};
