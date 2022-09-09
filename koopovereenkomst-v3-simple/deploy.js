var ghpages = require("gh-pages");

const dir = "out";

console.log(`publising dir [${dir}] to branch [gh-pages]`);
ghpages.publish(dir, { dotfiles: true }, function (err) {
  if (err) {
    console.error("Something went wrong!", err);
  } else {
    console.log("repo published!");
  }
});
