import { useCallback, useState } from "react";
import type { PatientFileDto } from "@odonto/shared";
import { useApi } from "@/hooks/useApi";
import { filesApi } from "@/services";
import { ApiRequestError } from "@/services/http";
import { fileProblem, withType } from "@/utils/files";

/** A file picked for upload and how it's going. */
export interface QueuedUpload {
  key: string;
  name: string;
  state: "waiting" | "uploading" | "failed";
  message?: string;
}

const EMPTY: PatientFileDto[] = [];

export type PatientFilesState = ReturnType<typeof usePatientFiles>;

/** A patient's attachments: list, upload (several, one after another) and delete. */
export function usePatientFiles(patientId: string) {
  const { data, loading, error, reload } = useApi(
    () => (patientId ? filesApi.list(patientId) : Promise.resolve({ items: EMPTY })),
    [patientId],
  );
  const [queue, setQueue] = useState<QueuedUpload[]>([]);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const update = (key: string, patch: Partial<QueuedUpload>) =>
    setQueue((q) => q.map((item) => (item.key === key ? { ...item, ...patch } : item)));

  const upload = useCallback(
    async (files: File[]) => {
      const batch = files.map((file, i) => ({ file, key: `${Date.now()}-${i}-${file.name}`, problem: fileProblem(file) }));
      setQueue((q) => [
        ...q.filter((item) => item.state !== "failed"),
        ...batch.map(({ file, key, problem }) => ({
          key,
          name: file.name,
          state: problem ? ("failed" as const) : ("waiting" as const),
          message: problem ?? undefined,
        })),
      ]);

      for (const { file, key, problem } of batch) {
        if (problem) continue;
        update(key, { state: "uploading" });
        try {
          await filesApi.upload(patientId, withType(file));
          setQueue((q) => q.filter((item) => item.key !== key));
        } catch (err) {
          update(key, { state: "failed", message: err instanceof ApiRequestError ? err.message : "No se pudo subir" });
        }
      }
      reload();
    },
    [patientId, reload],
  );

  const remove = useCallback(
    async (file: PatientFileDto) => {
      setRemoveError(null);
      try {
        await filesApi.remove(patientId, file.id);
        reload();
      } catch (err) {
        setRemoveError(err instanceof ApiRequestError ? err.message : "No pudimos eliminar el archivo");
      }
    },
    [patientId, reload],
  );

  return {
    files: data?.items ?? EMPTY,
    loading,
    error,
    reload,
    queue,
    dismissFailed: () => setQueue((q) => q.filter((item) => item.state !== "failed")),
    upload,
    remove,
    removeError,
  };
}
