const CONFIG = {};

CONFIG.base_url = "https://www.instagram.com";
CONFIG.port = "3100";
CONFIG.username = "sinsfluencer";
CONFIG.password = "agamakuagamaksa";
CONFIG.logedin = false;

CONFIG.scheduler = {
   run_every_x_hours: 3,
   like_ratio: 0.75,
   unfollow_after_days: 2,
   headless: false,
   fetch_interval: 5000
};

CONFIG.selector = {
   home_to_login_button: ".izU2O a",
   username_field: 'input[name="username"]',
   password_field: 'input[name="password"]',
   login_button: 'button[type="submit"]',
   user_unfollow_button: "span.vBF20 > button._5f5mN",
   user_unfollow_confirm_button: "div.mt3GC > button.aOOlW.-Cab_",
   user_followers: ".PZuss > li",
   user_username: "div a.notranslate",
   user_follow_button: "div button"
};

CONFIG.databases = {
   followers: "followers",
   following: "following",
   targets: "targets",
   users: "users"
};

CONFIG.attribute = {
   username: "username",
   followed: "followed",
   from: "from",
   user_url: "url",
   date_start: "date"
};

export default CONFIG;
