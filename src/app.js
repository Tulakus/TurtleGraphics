"use strict";
const b = require('bobril');
const page_1 = require('./page');
const monitor = require('bobflux-monitor');
const bobflux_1 = require('bobflux');
const state_1 = require('./state');
window.TGLint = null;
window.UL = null;
if (DEBUG) {
    bobflux_1.bootstrap(state_1.createDefaultTurtleGraphicAppState(), monitor.init());
}
else {
    bobflux_1.bootstrap(state_1.createDefaultTurtleGraphicAppState());
}
b.routes(b.route({ handler: page_1.page }));
