import * as L from 'leaflet';

declare var iso8601: any;

// FIXME apologies for a horrible type definition
declare module 'leaflet' {

  const timeDimension: any;

  namespace control {
    function timeDimension(v?: any): any;
  }

  namespace Control {
    class TimeDimension {
      static extend(options?: any): any;
    }
  }

}
