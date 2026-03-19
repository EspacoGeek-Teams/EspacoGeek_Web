import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import { Skeleton } from "primereact/skeleton";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import GenericTextPage from "../about/GenericTextPage";
import triggerBatchJobMutation from "../../components/apollo/schemas/mutations/triggerBatchJob";
import batchJobExecutionsQuery from "../../components/apollo/schemas/queries/batchJobExecutions";
import { SuccessContext } from "../../contexts/SuccessContext";
import { GlobalLoadingContext } from "../../contexts/GlobalLoadingContext";

const BATCH_JOBS = [
    { jobName: "moviesImportJob", icon: "pi pi-video" },
    { jobName: "seriesImportJob", icon: "pi pi-desktop" },
];

const POLL_INTERVAL_MS = 5000;

function statusSeverity(status) {
    switch (status?.toUpperCase()) {
        case "COMPLETED": return "success";
        case "STARTED":
        case "STARTING": return "info";
        case "FAILED": return "danger";
        case "STOPPED":
        case "STOPPING": return "warning";
        default: return "secondary";
    }
}

export default function BatchJobsDashboard() {
    const { t } = useTranslation();
    const { showSuccess } = useContext(SuccessContext);
    const { setGlobalLoading } = useContext(GlobalLoadingContext);

    const [triggeringJob, setTriggeringJob] = useState(null);
    const refetchRef = useRef(null);

    const { data: executionsData, loading: executionsLoading, refetch } = useQuery(batchJobExecutionsQuery, {
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: true,
    });

    // Keep a stable ref to the latest refetch to avoid restarting the interval on identity changes
    useEffect(() => {
        refetchRef.current = refetch;
    }, [refetch]);

    const [triggerBatchJob] = useMutation(triggerBatchJobMutation);

    useEffect(() => {
        setGlobalLoading(executionsLoading);
    }, [executionsLoading, setGlobalLoading]);

    useEffect(() => {
        document.title = t("admin.batchJobs.pageTitle") + " - EspaçoGeek";
    }, [t]);

    // Polling to refresh executions table at a fixed interval
    useEffect(() => {
        const intervalId = setInterval(() => {
            refetchRef.current?.();
        }, POLL_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, []);

    function handleTrigger(jobName) {
        confirmDialog({
            message: t("admin.batchJobs.confirmTrigger", { jobName: t(`admin.batchJobs.jobs.${jobName}`) }),
            header: t("admin.batchJobs.confirmHeader"),
            icon: "pi pi-exclamation-triangle",
            acceptLabel: t("admin.batchJobs.confirmAccept"),
            rejectLabel: t("admin.batchJobs.confirmReject"),
            accept: () => executeTrigger(jobName),
        });
    }

    async function executeTrigger(jobName) {
        setTriggeringJob(jobName);
        try {
            await triggerBatchJob({ variables: { jobName } });
            showSuccess(t("admin.batchJobs.triggerSuccess", { jobName: t(`admin.batchJobs.jobs.${jobName}`) }));
            refetch();
        } finally {
            setTriggeringJob(null);
        }
    }

    const statusBodyTemplate = (rowData) => (
        <Tag
            value={rowData.status}
            severity={statusSeverity(rowData.status)}
        />
    );

    const formatDateTime = (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString();
    };

    return (
        <GenericTextPage>
            <ConfirmDialog />
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-bold mb-1">{t("admin.batchJobs.title")}</h2>
                    <p className="text-sm opacity-70">{t("admin.batchJobs.description")}</p>
                </div>

                <Divider />

                <div>
                    <h3 className="text-lg font-semibold mb-4">{t("admin.batchJobs.availableJobs")}</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {BATCH_JOBS.map(({ jobName, icon }) => (
                            <div
                                key={jobName}
                                className="flex flex-row items-center justify-between p-4 rounded-lg bg-slate-700 bg-opacity-20 border border-slate-500 border-opacity-30"
                            >
                                <div className="flex flex-row items-center gap-3">
                                    <i className={`${icon} text-2xl`} />
                                    <div>
                                        <p className="font-semibold">{t(`admin.batchJobs.jobs.${jobName}`)}</p>
                                        <p className="text-sm opacity-60">{t(`admin.batchJobs.jobDescriptions.${jobName}`)}</p>
                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-play"
                                    label={t("admin.batchJobs.trigger")}
                                    severity="success"
                                    size="small"
                                    loading={triggeringJob === jobName}
                                    disabled={!!triggeringJob}
                                    onClick={() => handleTrigger(jobName)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Divider />

                <div>
                    <div className="flex flex-row items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{t("admin.batchJobs.recentExecutions")}</h3>
                        <Button
                            icon="pi pi-refresh"
                            text
                            rounded
                            tooltip={t("admin.batchJobs.refresh")}
                            loading={executionsLoading}
                            onClick={() => refetch()}
                        />
                    </div>

                    {executionsLoading && !executionsData ? (
                        <div className="flex flex-col gap-2">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} height="3rem" className="rounded-md" />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            value={executionsData?.batchJobExecutions ?? []}
                            emptyMessage={t("admin.batchJobs.noExecutions")}
                            size="small"
                            stripedRows
                            className="rounded-lg overflow-hidden"
                        >
                            <Column field="jobName" header={t("admin.batchJobs.columns.jobName")} />
                            <Column field="jobExecutionId" header={t("admin.batchJobs.columns.executionId")} />
                            <Column
                                field="status"
                                header={t("admin.batchJobs.columns.status")}
                                body={statusBodyTemplate}
                            />
                            <Column
                                field="startTime"
                                header={t("admin.batchJobs.columns.startTime")}
                                body={(row) => formatDateTime(row.startTime)}
                            />
                            <Column
                                field="endTime"
                                header={t("admin.batchJobs.columns.endTime")}
                                body={(row) => formatDateTime(row.endTime)}
                            />
                            <Column field="exitStatus" header={t("admin.batchJobs.columns.exitStatus")} />
                        </DataTable>
                    )}
                </div>
            </div>
        </GenericTextPage>
    );
}
