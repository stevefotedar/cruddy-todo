const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error getting id during write');
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw ('error writing to the file');
          //callback(err)
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, ids) => {
    if (err) {
      throw ('unable to read dir');
      //callback(err)
    } else {
      let data = _.map(ids, (id) => {
        return { id: id.slice(0, -4), text: id.slice(0, -4) };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile((path.join(exports.dataDir, id) + '.txt'), (err, text) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: id, text: text.toString() });
    }
  });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  fs.readFile((path.join(exports.dataDir, id) + '.txt'), (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile((path.join(exports.dataDir, id) + '.txt'), text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  //first check if does not exist
  //callback(err)
  // else 
  //use fs.unlink(path + id, callback);
  fs.unlink((path.join(exports.dataDir, id) + '.txt'), (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
  //if error --> callback(err)
  //else
  // callback()

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
