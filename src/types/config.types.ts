export interface Config {
  id: string;
  name: string;
  user: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConfigRequest {
  user: string;
  name: string;
  content: string;
}

export interface UpdateConfigRequest {
  content: string;
}

export interface GetConfigsQuery {
  user: string;
}

export type ImportMode = 'upsert' | 'insert-only';

export interface ExportSingleConfigResponseItem {
  id: string;
  user: string;
  name: string;
  content: string;
}

export interface ImportSingleConfigRequest {
  user: string;
  content: string;
  name?: string; // required if creating a new record
  mode?: ImportMode; // defaults to 'upsert'
}

export type ImportSingleAction = 'created' | 'updated' | 'skipped';

export interface ImportSingleConfigResponse {
  id: string;
  user: string;
  action: ImportSingleAction;
}
