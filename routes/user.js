import database from "../db/db";
import CONFIG from "../config/config";

const user = {
   add: (req, res) => {
      let { users } = req.body;

      let result = users.map(user => {
         return database.add(user, CONFIG.databases.users);
      });

      if (database.isChanged(result)) {
         res.redirect("/reload");
      } else {
         res.send({ message: "No data has been added" });
      }
   },

   remove: (req, res) => {
      let { users } = req.body;

      let result = users.map(user => {
         return database.remove(user, CONFIG.databases.users);
      });

      if (database.isChanged(result)) {
         res.redirect("/reload");
      } else {
         res.send({ message: "No data has been removed" });
      }
   }
};

export default user;
