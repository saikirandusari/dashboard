// Root configuration of the gulp.js build system, loads child modules which define specific tasks.
// Read more at: https://gulpjs.com/

import './build/check';
import './build/ci';
import './build/backend';
import './build/serve';
// TODO: Remove/enable once required tasks are fixed
// import './build/build';
// import './build/deploy';
// import './build/test';
