

var configFn = function(router,commBus,datastore,world) {
    
    router.post('/gameBoard', function (req, res) {
      let worldState = world.getState();
      res.json(worldState);
    });
    
    router.post('/cardsDefs', function (req, res) {
      let cards = datastore.getAll("cards");
      res.json(cards);
    });
    
    router.post('/cardsDefs/_save', function (req, res) {
      let entity = req.body;    
      console.log("===> ",entity);
      let update = datastore.saveOrUpdate("cards",entity);
      res.json(update);
    });
    
}

module.exports = {
  configure: configFn
};
