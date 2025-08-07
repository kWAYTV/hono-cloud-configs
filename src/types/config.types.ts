export interface Config {
  id: string;
  name: string;
  user: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportSingleConfigResponseItem {
  id: string;
  user: string;
  name: string;
  content: string;
}

export type ImportSingleAction = 'created' | 'updated' | 'skipped';

export interface ImportSingleConfigResponse {
  id: string;
  user: string;
  action: ImportSingleAction;
}
