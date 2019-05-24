import database from "../db/db";
import config from "../config/config";

export default function followers(req, res, next) {
   let followersData = database.get(config.databases.followers);

   res.json({
      followers_count: followersData.length,
      data: { ...followersData }
   });
}
