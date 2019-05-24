import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import CONFIG from "../config/config";

const adapter = new FileSync("./db/db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ followers: [], following: [], targets: [], users: [] }).write();

const database = {
   add: (obj, dbname) => {
      if (!database.get(dbname)) {
         console.log(`DATABASE: ${dbname} doesn't exist`);
         return;
      }

      let search = database.search(obj.username, dbname);

      if (search.length == 0) {
         db.get(dbname)
            .push({ ...obj })
            .write();

         console.log(`DATABASE: ${obj.username} | Object added!`);
         return true;
      } else {
         console.log(
            `DATABASE: ${obj.username} | Object existed, can't add duplicate`
         );
         return false;
      }
   },

   remove: (obj, dbname) => {
      if (!database.get(dbname)) {
         console.log(`DATABASE: ${dbname} doesn't exist`);
         return;
      }

      let search = database.search(obj.username, dbname);

      if (search.length != 0) {
         db.get(dbname)
            .remove({ username: obj.username })
            .write();
         console.log(`DATABASE: ${obj.username} | Object removed!`);
         return true;
      } else {
         console.log(
            `DATABASE: ${
               obj.username
            } | Object doesn't exists, can't remove object.`
         );
         return false;
      }
   },

   search: (username, dbname) => {
      let result = db
         .get(dbname)
         .filter({ username: username })
         .value();
      return result;
   },

   isChanged: result => {
      return result.filter(status => {
         return status == true;
      }).length > 0
         ? true
         : false;
   },

   get: dbname => {
      return db.get(dbname).value();
   }
};

export default database;
