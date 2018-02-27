
const usersServicesJs = require('./users-services.js');
const gameServicesJs = require('./game-services.js');

var configFn = function(router,commBus,datastore,world) {
    
    router.use(function timeLog(req, res, next) {
      console.log('Time: ', Date.now());
      next();
    });
    
    usersServicesJs.configure(router,commBus,datastore,world);
    
    gameServicesJs.configure(router,commBus,datastore,world);
    
}

module.exports = {
  configure: configFn
};