const fs = require("fs/promises");
const path = require("path");
const CleanCSS = require("clean-css");

module.exports = {
    metaTitle: "Florence Ceramics",
    metaDescription: "Ceramicist making pieces for the everyday 🌻",
    url: "florenceceramics.co.uk",

    css: async () => `blahh ${await fs
        .readFile(path.resolve(__dirname, "./style.css"))
        .then((data) => new CleanCSS().minify(data).styles)}`
}