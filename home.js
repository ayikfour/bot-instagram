import database from "./dblib/db/db";

export default async function home() {
  let searchQueries = "muhammadadiwandana";

  const user = {
    username: "ayikfour_",
    url: "/ayikfour_/"
  };
  const result = database.search(user.username, "followers");
  console.log(result.length);
}
