const htmlmin = require('html-minifier');
const cleanCSS = require("clean-css");
const lazyImages = require("eleventy-plugin-lazyimages");

async function htmlMinTransform(value, outputPath) {
    if (outputPath.indexOf('.html') > -1) {
        let minified = htmlmin.minify(value, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
            minifyCSS: true
        });
        return minified;
    }
    return value;
}
module.exports = function (config) {
    config.addPlugin(lazyImages, {
        cacheFile: ""
    });
    config.addTransform("htmlmin", htmlMinTransform);
    config.addFilter("cssmin", code => {
        return new cleanCSS({}).minify(code).styles;
    });
};