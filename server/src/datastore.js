
const loki = require("lokijs");
const uuidv1 = require('uuid/v1');

var Datastore = function() {
    
}

Datastore.prototype.initialize = function() {
    this.db = new loki("data/data.json",{
        autoload: true,
        autoloadCallback: ()=>{
            console.log("Db Loaded");
            this.db.save();
        },
        autosave: true
    });
}

Datastore.prototype.ensureCollection = function(collectionName) {
    var collection = this.db.getCollection(collectionName);
    if (!collection) {
        collection = this.db.addCollection(collectionName,{
            unique: ['id'],
            indices: ['id']
        });
    }
    return collection;
}

Datastore.prototype.getAll = function(collectionName) {
    return this.ensureCollection(collectionName).find();
}

Datastore.prototype.getByProperty = function(collectionName,propertyName,propertyValue) {
    return this.ensureCollection(collectionName).findOne({[propertyName]:propertyValue});
}

Datastore.prototype.getById = function(collectionName,id) {
    return this.getByProperty(collectionName,'id',id);
}

Datastore.prototype.saveOrUpdate = function(collectionName,entity) {
    var coll = this.ensureCollection(collectionName);
    var id = entity.id;
    var toUpdate = null;
    if (id) {
        toUpdate = coll.findOne({'id': id});
    } else {
        entity.id = this.generateId();
    }
    if (toUpdate) {
        try {
            Object.assign(toUpdate,entity);
            coll.update(toUpdate);
        } catch(err) {
            console.error(err);
        }
        entity = toUpdate;
    } else {
        try {
            coll.insert(entity);
        } catch(err) {
            console.error(err);
        }
    }
    return entity;
}

Datastore.prototype.generateId = function() {
    return uuidv1();
}

module.exports = {
  Datastore: Datastore
};

