const htmlmin = require('html-minifier');
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");

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
const imageShortcode = (src, alt) => {
    const options = {
        widths: [300, 600, null],
        formats: ["jpeg"],
        outputDir: "./dist/img/"
    };
    Image(src, options);
    const metadata = Image.statsSync(src, options);
    let imageAttributes = {
        alt,
        sizes: "(min-width: 400px) 300px, (min-width: 700px) 600px, 1000px",
        loading: "lazy",
        decoding: "async",
    };
    return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (config) {
    config.addPassthroughCopy({ "assets/passthrough": "." });

    config.addTransform("htmlmin", htmlMinTransform);

    config.addShortcode("image", imageShortcode);
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