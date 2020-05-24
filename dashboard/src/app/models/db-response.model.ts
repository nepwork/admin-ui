export type PCRTuple = [string, string, string, number, number];
export type RDTTuple = PCRTuple;

export type PCRTupleRev = [ string, string, string, number, number, string ];
export type RDTTupleRev = PCRTupleRev;

export module AllDocs {

  export interface Value {
      rev: string;
      deleted: boolean;
  }

  export interface Doc {
      _id: string;
      _rev: string;
      pschema: string;
      fields: PCRTupleRev;
  }

  export interface Row {
      id: string;
      key: string;
      value: Value;
      doc: Doc;
  }

  export interface Root {
      total_rows: number;
      offset: number;
      update_seq?: number | string;
      rows: Row[];
  }

}

export interface PSchema {
  _id: string;
  _rev?: string;
  fields: string[][];
}

export interface PSchemaDoc {
  _id: string;
  _rev?: string;
  pschema: string;
  fields: string[];
}

export interface DBPostResponse {
  id: string;
  ok: boolean;
  rev: string;
}

interface ErrorResponse {
  status?: number;
  name?: string;
  message?: string;
  reason?: string;
  error?: string | boolean;
  id?: string;
  rev?: string;
}

export type BulkAddResponse = (DBPostResponse | ErrorResponse)[];

export interface DBErrorResponse {
    error: string;
    reason: string;
}
