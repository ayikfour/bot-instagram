import puppeteer from "puppeteer";
import config from "../config/config";

const viewPort = { width: 1280, height: 720 };
let puppet;

const browser = {
   init: async () => {
      let temp = await puppeteer.launch({
         headless: config.scheduler.headless,
         args: [`--window-size=${1280},${720}`]
      });

      puppet = await temp.createIncognitoBrowserContext();
      return puppet;
   },
   new: async () => {
      if (!puppet) {
         await browser.init();
      }

      const page = await puppet.newPage();
      page.setViewport(viewPort);

      await page.setRequestInterception(true);
      page.on("request", req => {
         if (
            req.resourceType() === "image" ||
            req.resourceType() === "stylesheet" ||
            req.resourceType() === "font"
         ) {
            req.abort();
         } else {
            req.continue();
         }
      });

      return page;
   },

   login: async () => {
      try {
         const page = await browser.new();
         await page.goto(config.base_url + "/accounts/login/");

         await page.waitForSelector(config.selector.username_field);

         const usernameInput = await page.$(config.selector.username_field);
         const passwordInput = await page.$(config.selector.password_field);

         console.log("Logging in ...");

         await usernameInput.type(config.username, { delay: 20 });
         await passwordInput.type(config.password, { delay: 20 });

         const logInButton = await page.$(config.selector.login_button);
         await logInButton.click();
         await page.waitForNavigation();

         config.logedin = true;

         await page.close();
         return true;
      } catch (err) {
         console.log(err);
         return false;
      }
   },

   close: async () => {
      puppet.close();
   },

   get: () => {
      if (puppet) {
         return puppet;
      } else {
         return null;
      }
   }
};

export default browser;
