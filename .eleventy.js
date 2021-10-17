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
        widths: [300],
        formats: ["jpeg"],
        outputDir: "./dist/img/",
    };
    Image(src, options);
    const metadata = Image.statsSync(src, options);
    let imageAttributes = {
        alt,
        sizes: "(max-width: 400px) 300px, (max-width: 700px) 600px, 1000px",
        loading: "lazy",
        decoding: "async",
    };
    return Image.generateHTML(metadata, imageAttributes);
}

const createPicsCollection = () => {
    const picsDirectory = path.resolve(__dirname, "./assets/pics");
    const picFilenames = fs.readdirSync(picsDirectory);
    return picFilenames.map(filename => ({ src: `assets/pics/${filename}`, alt: filename.split('.')[0] }));
};

module.exports = function (config) {
    config.addPassthroughCopy({ "assets/passthrough": "." });

    config.addCollection("pics", createPicsCollection);
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