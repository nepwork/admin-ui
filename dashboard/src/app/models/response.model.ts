export interface DBAuthResponse {
  proxyCookie?: string;
  ok: boolean;
  name: string;
  roles: string[];
}

export interface DBPostResponse {
  id: string;
  ok: boolean;
  rev: string;
}
