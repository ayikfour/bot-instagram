import database from "../db/db";

const target = {
   add: (req, res) => {
      let { targets } = req.body;

      targets.map(target => {
         console.log(target);
         database.add({ username: target }, CONFIG.databases.targets);
      });

      console.log(database.get(CONFIG.databases.targets));
      res.redirect("/reload");
   },

   remove: (req, res) => {
      let { targets } = req.body;

      targets.forEach(target => {
         database.remove({ username: target }, CONFIG.databases.targets);
      });

      res.redirect("/reload");
   }
};

export default target;
