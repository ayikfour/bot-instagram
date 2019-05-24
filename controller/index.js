import config from "../config/config";
import puppet from "../lib/browser";
import followers from "./followers";
import database from "../db/db";
import CONFIG from "../config/config";

let tasks = [];

// TODO: Pisah module browser.
// Instansiasi browser baru setiap mengakses method instagram
// Instagram memiliki parameter username dan password
// Database.add dibuat bulk operation. param array

async function instagram() {
   while (!config.logedin) {
      config.logedin = await puppet.login();
   }

   runFollowers();
}

async function runFollowers() {
   let targets = database.get(CONFIG.databases.targets);
   targets.forEach(async target => {
      let task = await followers(await puppet.new(), target.username);
      console.log("creating task: " + target.username);
      tasks.push(task);
   });
}

async function reload() {
   try {
      console.log("task length: " + tasks.length);
      tasks.forEach(task => {
         task.destroy();
      });

      let browser = await puppet.get();
      if (browser) {
         let pages = await browser.pages();
         pages.forEach(async page => {
            await page.close();
         });
      }

      instagram();
      return true;
   } catch (err) {
      console.log(err);
      return false;
   }
}

export { reload, instagram };
