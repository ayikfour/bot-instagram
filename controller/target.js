import database from "../db/db";
import CONFIG from "../config/config";

function addTarget(targets = []) {
   console.log("TARGET");
   targets.map(target => {
      console.log(target);
      database.add({ username: target }, CONFIG.databases.targets);
   });

   console.log(database.get(CONFIG.databases.targets));
}

function removeTarget(targets = []) {
   console.log("TARGET");

   targets.forEach(target => {
      database.remove({ username: target }, CONFIG.databases.targets);
   });

   console.log(database.get(CONFIG.databases.targets));
}

export { addTarget, removeTarget };
