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
