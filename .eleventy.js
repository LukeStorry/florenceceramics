const htmlmin = require('html-minifier');
const lazyImages = require("eleventy-plugin-lazyimages");
const fs = require("fs");
const path = require("path");

const htmlMinTransform = (value, outputPath) => {
    if (outputPath.indexOf('.html') < 0)
        return value

    const config = {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true
    };
    return htmlmin.minify(value, config);
}

const getCss = () => {
    const cssFilePath = path.resolve(__dirname, "./src/_includes/styles.css");
    return fs.readFileSync(cssFilePath);
}

module.exports = function (config) {
    config.addPlugin(lazyImages, { cacheFile: "" });
    config.addTransform("htmlmin", htmlMinTransform);

    config.addShortcode("getCss", getCss);
    global.helpers = config.javascriptFunctions;
    config.setPugOptions({ globals: ['helpers'] });

    return {
        dir: {
            input: "src",
            output: "dist",
        }
    }
};