import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

import { prelogger } from '../util/prelogger';

/**
 * @deprecated
 */
export class NgPluginPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      console.info(prelogger('preload module strategied'), route);
      return load();
    } else {
      return of(null);
    }
  }
}
