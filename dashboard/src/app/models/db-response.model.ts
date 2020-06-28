export type PCRTuple = [string, string, string, number, number];
export type RDTTuple = PCRTuple;
export type RETTuple = [string, string, string, string, string, number];

export type TABTuple = PCRTuple | RDTTuple | RETTuple;

export type PCRTupleRev = [ string, string, string, number, number, string ];
export type RDTTupleRev = PCRTupleRev;
export type RETTupleRev = [string, string, string, string, string, number, string];


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


export module Census2011 {

  export interface District {
      id: number;
      district: string;
      households: number;
      total: number;
      male: number;
      female: number;
  }

  export interface Districts {
      _id: 'district_stats_2011';
      _rev?: string;
      values: District[];
  }

  export function isDistrictCensus(properties: Census2011.Districts | any):
  properties is Census2011.Districts {
    return (properties as Census2011.Districts)._id === 'district_stats_2011';
  }

}

export module CensusUpdated {

  export interface Municipality {
      id: string;
      description: string;
      municipality: string;
      population: number;
  }

  export interface Municipalities {
      id: 'municipality_stats';
      _rev?: string;
      values: Municipality[];
  }
}

export module HealthStats {

  export interface District {
      province: string;
      district: string;
      quarantine_total: number;
      bed_capacity: number;
      quarantined_total: number;
      home_quarantine: number;
      isolation_beds: number;
      isolated_total: number;
      swabs_collected_till_yesterday: number;
      todays_swab_collection: number;
      total_swab_collection: number;
      awaiting_results: number;
      male_positives: number;
      female_positives: number;
      total_positives: number;
      negatives: number;
      collected_till_yesterday: number;
      todays_rdt_tests: number;
      total_rdt_tests: number;
      positives: number;
      negatives_1: number;
      discharged_till_yesterday: number;
      discharged_today: number;
      total_discharged: number;
      unlabeled: number;
  }

  export interface Districts {
      _id: 'district_health_stats';
      _rev?: string;
      values: District[];
  }


  export function isDistrictHealthStats(properties: HealthStats.Districts | any):
  properties is HealthStats.Districts {
    return (properties as HealthStats.Districts)._id === 'district_health_stats';
  }

}

