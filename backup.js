// const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";
import fs from "fs";
import home from "./home";
import db from "./db/db";
import CONFIG from "./config/config";

// go();
home();

let index = 0;

async function go() {
  try {
    const viewPort = { width: 1280, height: 720 };
    const browser = await puppeteer.launch({
      headless: false,
      args: [`--window-size=${1280},${720}`]
    });

    const page = await browser.newPage();
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

    await page.goto("https://www.instagram.com/accounts/login/");
    await page.waitForSelector('input[name="username"]');

    const usernameInput = await page.$('input[name="username"]');
    const passwordInput = await page.$('input[name="password"]');

    console.log("Logging in ...");

    await usernameInput.type("empatkarakter", { delay: 20 });
    await passwordInput.type("nantiaja", { delay: 20 });

    const logInButton = await page.$("button[type='submit']");
    await logInButton.click();
    await page.waitForNavigation();

    await page.goto("https://www.instagram.com/thanksinsomnia/");
    await page.waitForSelector('a[href="/thanksinsomnia/followers/"]');
    console.log("Redirect to profile ...");

    let followersRaw = await page.$eval("a > span.g47SY ", span =>
      span.title.replace(",", "")
    );

    let followersCount = followersRaw + 0;

    console.log("Opening followers tab ...");

    const followersLink = await page.$('a[href="/thanksinsomnia/followers/"]');
    await followersLink.click();

    await page.waitForSelector(CONFIG.selector);
    let trigger = await page.$(".PZuss > li:last-of-type");
    let followers = await getFollowers(page);

    console.log(followers);
    console.log(followers.length);

    while (followers.length < followersCount) {
      await page.hover(".PZuss > li:last-of-type");
      let temp = await getFollowers(page);
      if (temp.length > 0) {
        followers = temp;
        //   await writeJson(followers);
        writeToDB(followers, index);
        console.log("index: " + index);
      } else {
        console.log("Retrying to fetch ...");
      }
      console.log(followers.length);
      await page.waitFor(3000);
    }
  } catch (error) {
    console.log(error);
  }
}

async function writeJson(data) {
  fs.writeFileSync(
    "./json/followers_2.json",
    JSON.stringify(data, null, 2),
    err => {
      if (err) throw err;
      console.log("Files have been writed!");
    }
  );
}

function writeToDB(followers) {
  for (let i = index; i < followers.length; i++) {
    db.get("followers")
      .push({ ...followers[i] })
      .write();
  }
  index = followers.length;
}

async function scroll(page) {
  await page.evaluate(async () => {
    let scrollable = document.querySelector(".isgrP");
    let content = document.querySelector(".PZuss");
    if (content != null) {
      await scrollable.scrollTo(0, content.offsetHeight);
    }
  });
}

async function getFollowers(page) {
  let temp = await page.evaluate(() => {
    let users = document.querySelectorAll(".PZuss > li > div a.notranslate");
    let data = [];

    users.forEach(function(user, index, array) {
      data.push({
        username: user.getAttribute("title"),
        url: user.getAttribute("href")
      });
    });

    return data;
  });
  return temp;
}

async function getFollowersNew(page) {
  let result = await page.evaluate(() => {
    let data = [];
    let users = document.querySelectorAll(".PZuss > li");

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
        followed: followed
      });
    });

    return data;
  });

  return result;
}
