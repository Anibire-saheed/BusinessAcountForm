import { z } from "zod";
import { api } from "@/app/utils/axios";
import { API_BUSINESS_NAME } from "@/config";
import {
  parseApiResult,
  type ApiResult,
} from "@/app/apiService/apiResponseHandler";
import type {
  BusinessDetails,
  CreateApplicationInput,
  DocumentType,
  PersonFileType,
  PersonInput,
  PrincipalInput,
  RefereeInput,
} from "@/types/businessApplication.types";

const idSchema = z.number().int().positive();
const applicationUUIDSchema = z.string().min(1);
const personSchema = z.object({
  id: idSchema,
  fullName: z.string(),
  bvn: z.string(),
  nin: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  passportPhotoUploaded: z.boolean(),
  validIdUploaded: z.boolean(),
  signatureUploaded: z.boolean(),
});
const principalSchema = personSchema.extend({
  role: z.enum(["ADMIN_OFFICER", "DIRECTOR", "PROPRIETOR", "TRUSTEE"]),
  alsoSignatory: z.boolean(),
  sameAsAdminOfficer: z.boolean(),
});
const signatorySchema = personSchema.extend({
  addedAutomatically: z.boolean(),
});
const root = API_BUSINESS_NAME;
function path(applicationUUID: string, suffix = "") {
  if (!applicationUUID.trim()) throw new Error("Application ID is required.");
  return `${root}/${encodeURIComponent(applicationUUID)}${suffix}`;
}
function personId(id: number) {
  return idSchema.parse(id);
}
async function upload(url: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  const response = await api.post(url, body);
  return parseApiResult(response.data, z.string());
}

export const applicationResponses = {
  // Create Application
  async create(input: CreateApplicationInput) {
    const response = await api.post(root, input);
    return parseApiResult(response.data, applicationUUIDSchema);
  },
  // Update Business Details
  async updateBusinessDetails(applicationUUID: string, input: BusinessDetails) {
    const response = await api.put(
      path(applicationUUID, "/business-details"),
      input,
    );
    return parseApiResult(response.data, z.null());
  },
  // Upload Document
  uploadDocument(applicationUUID: string, type: DocumentType, file: File) {
    return upload(path(applicationUUID, `/documents/${type}`), file);
  },
  // Add Principal
  async addPrincipal(applicationUUID: string, input: PrincipalInput) {
    const response = await api.post(
      path(applicationUUID, "/principals"),
      input,
    );
    return parseApiResult(response.data, idSchema);
  },
  // Update Principal
  async updatePrincipal(
    applicationUUID: string,
    id: number,
    input: PrincipalInput,
  ) {
    const response = await api.put(
      path(applicationUUID, `/principals/${personId(id)}`),
      input,
    );
    return parseApiResult(response.data, idSchema);
  },
  // Upload Principal File
  uploadPrincipalFile(
    applicationUUID: string,
    id: number,
    type: PersonFileType,
    file: File,
  ) {
    return upload(
      path(applicationUUID, `/principals/${personId(id)}/files/${type}`),
      file,
    );
  },
  // Get Principals
  async getPrincipals(applicationUUID: string, signal?: AbortSignal) {
    const response = await api.get(path(applicationUUID, "/principals"), {
      signal,
    });
    return parseApiResult(response.data, z.array(principalSchema));
  },
  // Add Signatory
  async addSignatory(applicationUUID: string, input: PersonInput) {
    const response = await api.post(
      path(applicationUUID, "/signatories"),
      input,
    );
    return parseApiResult(response.data, idSchema);
  },
  // Update Signatory
  async updateSignatory(
    applicationUUID: string,
    id: number,
    input: PersonInput,
  ) {
    const response = await api.put(
      path(applicationUUID, `/signatories/${personId(id)}`),
      input,
    );
    return parseApiResult(response.data, idSchema);
  },
  // Upload Signatory File
  uploadSignatoryFile(
    applicationUUID: string,
    id: number,
    type: PersonFileType,
    file: File,
  ) {
    return upload(
      path(applicationUUID, `/signatories/${personId(id)}/files/${type}`),
      file,
    );
  },
  // Get Signatories
  async getSignatories(applicationUUID: string, signal?: AbortSignal) {
    const response = await api.get(path(applicationUUID, "/signatories"), {
      signal,
    });
    return parseApiResult(response.data, z.array(signatorySchema));
  },
  // Upsert Referee
  async upsertReferee(applicationUUID: string, input: RefereeInput) {
    const response = await api.put(path(applicationUUID, "/referee"), input);
    return parseApiResult(response.data, idSchema);
  },
  // Confirm Accuracy
  async confirmAccuracy(applicationUUID: string, confirmed: boolean) {
    const response = await api.put(
      path(applicationUUID, "/confirmation"),
      undefined,
      { params: { confirmed } },
    );
    return parseApiResult(response.data, z.null());
  },
  // Submit Application
  async submit(applicationUUID: string) {
    const response = await api.post(path(applicationUUID, "/submit"));
    return parseApiResult(response.data, applicationUUIDSchema);
  },
};

function unwrap<TArgs extends unknown[], TData>(
  operation: (...args: TArgs) => Promise<ApiResult<TData>>,
) {
  return async (...args: TArgs): Promise<TData> =>
    (await operation(...args)).data;
}
export const applicationsApi = {
  create: unwrap(applicationResponses.create),
  updateBusinessDetails: unwrap(applicationResponses.updateBusinessDetails),
  uploadDocument: unwrap(applicationResponses.uploadDocument),
  addPrincipal: unwrap(applicationResponses.addPrincipal),
  updatePrincipal: unwrap(applicationResponses.updatePrincipal),
  uploadPrincipalFile: unwrap(applicationResponses.uploadPrincipalFile),
  getPrincipals: unwrap(applicationResponses.getPrincipals),
  addSignatory: unwrap(applicationResponses.addSignatory),
  updateSignatory: unwrap(applicationResponses.updateSignatory),
  uploadSignatoryFile: unwrap(applicationResponses.uploadSignatoryFile),
  getSignatories: unwrap(applicationResponses.getSignatories),
  upsertReferee: unwrap(applicationResponses.upsertReferee),
  confirmAccuracy: unwrap(applicationResponses.confirmAccuracy),
  async submit(
    applicationUUID: string,
    onDescription?: (description?: string) => void,
  ) {
    const result = await applicationResponses.submit(applicationUUID);
    onDescription?.(result.description);
    return result.data;
  },
};
