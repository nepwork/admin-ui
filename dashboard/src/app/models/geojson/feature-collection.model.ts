import { Feature } from './feature.model';

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}
