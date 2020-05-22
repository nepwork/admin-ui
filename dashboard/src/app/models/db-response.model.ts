export type PCRTuple = [number | string, number | string, number, number];

export module AllDocs {

  export interface Value {
      rev: string;
      deleted: boolean;
  }

  export interface Doc {
      _id: string;
      _rev: string;
      pschema: string;
      fields: PCRTuple;
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
  _rev: string;
  fields: string[][];
}

