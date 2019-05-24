import browser from "../lib/browser";
import config from "../config/config";
import database from "../db/db";
import cron from "node-cron";

export default async function followers(page, target) {
   console.log("Redirect to profile ...");

   /**
    * We are navigating page to the target profile
    * target is the username value.
    * */
   await page.goto(`${config.base_url}/${target}/`);

   // Wait until Followers button is loaded.
   await page.waitForSelector(`a[href="/${target}/followers/"]`);

   console.log(target, "Opening followers tab ...");

   // Get the Followers button selector.
   const followersLink = await page.$(`a[href="/${target}/followers/"]`);

   // Click the Followers button we get befor.
   await followersLink.click();

   // Wait for the page navigation to Followers tab.
   await page.waitForSelector(config.selector.user_followers);

   /**
    * Get Followers from the User. using getUserFollowers();
    * and set the current DB index to 0.
    */
   let followers = await getUserFollowers(page);
   let indexDB = 0;

   /**
    * Create Scheduler every 5 second using cronjob
    *
    * We fetch the Followers data every 5 second.
    */
   let task = cron.schedule("*/5 * * * * *", async () => {
      // Wait for the puppeteer to hover over Last Users element in Followers
      await page.hover(".PZuss > li:last-of-type");
      await page.waitForSelector(config.selector.user_followers);

      /**
       * Get the user element from profile page
       * saved to temp variable to check wether list is empty or not
       */
      let temp = await getUserFollowers(page);

      /**
       * If temp is empty
       * we will not add data to database and retry to fetch
       */
      if (temp.length > 0) {
         followers = temp;

         /**
          * Input all followers data from target
          * to database.
          */
         for (let i = indexDB; i < followers.length; i++) {
            console.log(target, followers[i].username);

            // database.add(followers[i], config.databases.followers);
         }

         // Set index to last data pushed to database
         indexDB = followers.length;
      } else {
         /**
          * Whenever followers length is less than 1
          * Do something here.
          * for now, we do nothing.
          */
         console.log(target, "Retrying to fetch ...");
      }

      console.log(target, followers.length);
      console.log(database.get(config.databases.followers).length);

      // Wait for 3 Second.
      await page.waitFor(3000);
   });

   // We return the task we made above using Cronjob.
   return task;
}

/**
 * getUserFollowers() function used
 * to get all User element in Instagrams followers tab
 *
 * @param {*} page
 * page must be passed. because we use page evaluate() function.
 */
async function getUserFollowers(page) {
   /**
    * Page.evaluate() is used for running script on browser's console.
    * and send the result back to the server.
    */
   let result = await page.evaluate(() => {
      // This data variable is used for storing user's object.
      let data = [];
      // Get the users element with this selector. returned array.
      let users = document.querySelectorAll(".PZuss > li");
      // Get the target Username.
      let target = document.querySelector("div .nZSzR > h1").textContent;

      /**
       *Iterates users element to split it for
       username, displayname, followed, and target.
       */
      users.forEach(user => {
         let info = user.querySelector("div a.notranslate");
         let status = user.querySelector("div button");

         let username = info.getAttribute("title");
         let url = info.getAttribute("href");
         let followed =
            status.textContent.toLowerCase() == "follow" ? false : true;

         data.push({
            username: username,
            url: url,
            followed: followed,
            from: target
         });
      });

      // Return the data back to server client.
      return data;
   });

   // Return the result array. containing users object.
   return result;
}
