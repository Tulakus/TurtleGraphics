import * as b from 'bobril';
import { page as mainPage } from './mainPage/page';
import * as monitor from 'bobflux-monitor';
import { bootstrap } from 'bobflux';
import { createDefaultTurtleGraphicAppState  } from './state';

declare var DEBUG: boolean;
if (DEBUG) {
  bootstrap(createDefaultTurtleGraphicAppState(), monitor.init());
} else {
  bootstrap(createDefaultTurtleGraphicAppState());
}

b.routes(
  b.route({ handler: mainPage })
  );
