const { OAuth2Client } = require('google-auth-library');


var configFn = function(router,commBus,datastore,world) {
    
    var checkCreateUser = function(oAuth2Login) {
        var payload = oAuth2Login.getPayload();
        var roles = [];
        var user = datastore.getByProperty("users","email",payload.email);
        if (!user) {
            if (payload.email === 'federico.monaldi@gmail.com') {
                roles.push('ADMIN');
            }
            var newUser = {
                 name: payload.name,
                 email: payload.email,
                 picture: payload.picture,
                 given_name: payload.given_name,
                 family_name: payload.family_name,
                 locale: payload.locale,
                 roles: roles
            };
            datastore.saveOrUpdate("users",newUser);
            user = newUser;
        }
        return user;
    };
        
    router.post('/user/_login', function (req, res) {
      let authRequest = req.body;
      var gapiClient = new OAuth2Client(authRequest.CLIENT_ID, '', '');
      gapiClient.verifyIdToken({
        idToken: authRequest.id_token, 
        audience: authRequest.CLIENT_ID
      }).then(login => {
            var user = checkCreateUser(login);
            res.json(user);
       });
    });
    
    
    router.post('/users', function (req, res) {
      let users = datastore.getAll("users");
      res.json(users);
    });
    
    router.post('/users/_save', function (req, res) {
      let entity = req.body;    
      console.log("===> ",entity);
      let update = datastore.saveOrUpdate("users",entity);
      res.json(update);
    });
    
}

module.exports = {
  configure: configFn
};
