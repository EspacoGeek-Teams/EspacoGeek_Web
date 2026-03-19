'use client';

import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import GenericTextPage from '../../src/containers/about/GenericTextPage';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useLazyQuery } from '@apollo/client';
import axios from 'axios';
import getBatchJobsQuery from '../../src/components/apollo/schemas/queries/getBatchJobs';
import { apiUri } from '../../src/components/apollo/config';
import { AuthContext } from '../../src/contexts/AuthContext';
import { ErrorContext } from '../../src/contexts/ErrorContext';
import { SuccessContext } from '../../src/contexts/SuccessContext';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const RUNNABLE_JOBS = [
    { name: 'importJob', label: 'Import Job', description: 'Import data from external sources' },
    { name: 'exportJob', label: 'Export Job', description: 'Export data to files' },
    { name: 'cleanupJob', label: 'Cleanup Job', description: 'Clean up old records' },
    { name: 'syncJob', label: 'Sync Job', description: 'Synchronize data between services' },
];

export default function AdminPage() {
    const { isAuthenticated, initializing, user } = useContext(AuthContext);
    const { showError } = useContext(ErrorContext);
    const { showSuccess } = useContext(SuccessContext);
    const { t } = useTranslation();
    const router = useRouter();

    const [jobs, setJobs] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {
            status: { value: null, matchMode: 'equals' },
            jobName: { value: null, matchMode: 'contains' },
        },
    });

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    // Keep a ref to the latest lazyState so callbacks don't capture stale closures
    const lazyStateRef = useRef(lazyState);
    useEffect(() => {
        lazyStateRef.current = lazyState;
    }, [lazyState]);

    const [fetchJobs, { loading }] = useLazyQuery(getBatchJobsQuery, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            if (data?.getBatchJobs) {
                setJobs(data.getBatchJobs.content || []);
                setTotalRecords(data.getBatchJobs.totalElements || 0);
            }
        },
        onError: () => {
            showError(t('admin.springBatch.noJobs'));
        },
    });

    const loadJobs = useCallback((state) => {
        const statusFilter = state.filters?.status?.value || undefined;
        fetchJobs({
            variables: {
                page: state.page ?? 0,
                size: state.rows ?? 10,
                status: statusFilter,
            },
        });
    }, [fetchJobs]);

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            loadJobs(lazyStateRef.current);
        }
    }, [isAuthenticated, isAdmin, loadJobs]);

    const onPage = (event) => {
        const newState = { ...event, page: event.page ?? Math.floor(event.first / event.rows) };
        setLazyState(newState);
        loadJobs(newState);
    };

    const onSort = (event) => {
        const newState = { ...lazyState, ...event };
        setLazyState(newState);
        loadJobs(newState);
    };

    const onFilter = (event) => {
        const newState = { ...event, first: 0, page: 0 };
        setLazyState(newState);
        loadJobs(newState);
    };

    const handleStart = useCallback((jobName) => {
        confirmDialog({
            message: t('admin.springBatch.actions.confirmStart', { name: jobName }),
            header: t('admin.springBatch.actions.start'),
            icon: 'pi pi-play',
            acceptClassName: 'p-button-success',
            accept: async () => {
                try {
                    await axios.post(`${apiUri}/api/batch/start`, { jobName }, { withCredentials: true });
                    showSuccess(t('admin.springBatch.actions.startSuccess', { name: jobName }));
                    loadJobs(lazyStateRef.current);
                } catch {
                    showError(t('admin.springBatch.actions.startError', { name: jobName }));
                }
            },
        });
    }, [t, showSuccess, showError, loadJobs]);

    const handleStop = useCallback((job) => {
        confirmDialog({
            message: t('admin.springBatch.actions.confirmStop'),
            header: t('admin.springBatch.actions.stop'),
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-warning',
            accept: async () => {
                try {
                    await axios.post(`${apiUri}/api/batch/${job.id}/stop`, {}, { withCredentials: true });
                    showSuccess(t('admin.springBatch.actions.stopSuccess'));
                    loadJobs(lazyStateRef.current);
                } catch {
                    showError(t('admin.springBatch.actions.stopError'));
                }
            },
        });
    }, [t, showSuccess, showError, loadJobs]);

    const handleAbandon = useCallback((job) => {
        confirmDialog({
            message: t('admin.springBatch.actions.confirmAbandon'),
            header: t('admin.springBatch.actions.abandon'),
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await axios.post(`${apiUri}/api/batch/${job.id}/abandon`, {}, { withCredentials: true });
                    showSuccess(t('admin.springBatch.actions.abandonSuccess'));
                    loadJobs(lazyStateRef.current);
                } catch {
                    showError(t('admin.springBatch.actions.abandonError'));
                }
            },
        });
    }, [t, showSuccess, showError, loadJobs]);

    const handleRestart = useCallback((job) => {
        confirmDialog({
            message: t('admin.springBatch.actions.confirmRestart'),
            header: t('admin.springBatch.actions.restart'),
            icon: 'pi pi-refresh',
            acceptClassName: 'p-button-info',
            accept: async () => {
                try {
                    await axios.post(`${apiUri}/api/batch/${job.id}/restart`, {}, { withCredentials: true });
                    showSuccess(t('admin.springBatch.actions.restartSuccess'));
                    loadJobs(lazyStateRef.current);
                } catch {
                    showError(t('admin.springBatch.actions.restartError'));
                }
            },
        });
    }, [t, showSuccess, showError, loadJobs]);

    const actionBodyTemplate = (rowData) => {
        const isRunning = rowData.status === 'STARTED' || rowData.status === 'STARTING';
        const isStopped = rowData.status === 'STOPPED';
        const isFailedOrStopped = rowData.status === 'FAILED' || rowData.status === 'STOPPED';

        return (
            <div className="flex gap-1 flex-wrap">
                <Button
                    label={t('admin.springBatch.actions.stop')}
                    icon="pi pi-stop-circle"
                    severity="warning"
                    size="small"
                    onClick={() => handleStop(rowData)}
                    disabled={!isRunning}
                />
                <Button
                    label={t('admin.springBatch.actions.abandon')}
                    icon="pi pi-ban"
                    severity="danger"
                    size="small"
                    onClick={() => handleAbandon(rowData)}
                    disabled={!isStopped}
                />
                <Button
                    label={t('admin.springBatch.actions.restart')}
                    icon="pi pi-refresh"
                    severity="info"
                    size="small"
                    onClick={() => handleRestart(rowData)}
                    disabled={!isFailedOrStopped}
                />
            </div>
        );
    };

    if (initializing) {
        return (
            <GenericTextPage>
                <div className="flex justify-center items-center py-10">
                    <ProgressSpinner />
                </div>
            </GenericTextPage>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return (
            <GenericTextPage>
                <div className="flex flex-col items-center gap-4 py-10">
                    <i className="pi pi-lock text-4xl text-gray-400" />
                    <p className="text-lg">{t('admin.accessDenied')}</p>
                    <Button
                        label={t('nav.home')}
                        icon="pi pi-home"
                        onClick={() => router.push('/')}
                    />
                </div>
            </GenericTextPage>
        );
    }

    return (
        <GenericTextPage>
            <ConfirmDialog />

            <h2 className="text-2xl font-bold mb-6">{t('admin.title')}</h2>

            <TabView>
                <TabPanel header={t('admin.springBatch.tab')}>

                    {/* Runnable Jobs Cards */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">{t('admin.springBatch.runnableJobs')}</h3>
                        <div className="flex flex-row gap-4 overflow-x-auto pb-2">
                            {RUNNABLE_JOBS.map((job) => (
                                <Card
                                    key={job.name}
                                    title={job.label}
                                    className="min-w-[200px] flex-shrink-0"
                                    footer={
                                        <Button
                                            label={t('admin.springBatch.actions.start')}
                                            icon="pi pi-play"
                                            severity="success"
                                            size="small"
                                            onClick={() => handleStart(job.name)}
                                        />
                                    }
                                >
                                    <p className="text-sm text-gray-500">{job.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Job Executions DataTable */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('admin.springBatch.jobsTable')}</h3>
                        <DataTable
                            value={jobs}
                            lazy
                            paginator
                            first={lazyState.first}
                            rows={lazyState.rows}
                            totalRecords={totalRecords}
                            onPage={onPage}
                            onSort={onSort}
                            sortField={lazyState.sortField}
                            sortOrder={lazyState.sortOrder}
                            onFilter={onFilter}
                            filters={lazyState.filters}
                            loading={loading}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            filterDisplay="row"
                            emptyMessage={t('admin.springBatch.noJobs')}
                            className="w-full"
                        >
                            <Column
                                field="id"
                                header={t('admin.springBatch.columns.id')}
                                sortable
                                style={{ minWidth: '5rem' }}
                            />
                            <Column
                                field="jobName"
                                header={t('admin.springBatch.columns.jobName')}
                                sortable
                                filter
                                filterPlaceholder="Search"
                                style={{ minWidth: '12rem' }}
                            />
                            <Column
                                field="status"
                                header={t('admin.springBatch.columns.status')}
                                sortable
                                filter
                                filterPlaceholder="Filter"
                                style={{ minWidth: '10rem' }}
                            />
                            <Column
                                field="startTime"
                                header={t('admin.springBatch.columns.startTime')}
                                sortable
                                style={{ minWidth: '12rem' }}
                            />
                            <Column
                                field="endTime"
                                header={t('admin.springBatch.columns.endTime')}
                                sortable
                                style={{ minWidth: '12rem' }}
                            />
                            <Column
                                field="exitCode"
                                header={t('admin.springBatch.columns.exitCode')}
                                style={{ minWidth: '8rem' }}
                            />
                            <Column
                                body={actionBodyTemplate}
                                header={t('admin.springBatch.columns.actions')}
                                style={{ minWidth: '20rem' }}
                                exportable={false}
                            />
                        </DataTable>
                    </div>
                </TabPanel>
            </TabView>
        </GenericTextPage>
    );
}
