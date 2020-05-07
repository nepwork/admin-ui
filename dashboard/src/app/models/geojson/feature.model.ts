import { Geometry } from './geometry.model';
import { Properties } from './properties.model';

export class Feature {
  type: 'Feature';
  bbox?: Array<Number>;
  geometry: Geometry;
  properties: Properties;
}
