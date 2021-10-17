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
        widths: [300, 600, 1000],
        formats: ["jpg"],
        outputDir: "./dist/img/",
        // outputDir: "./assets/pics_new/",
        // filenameFormat: (id, src, width, format, options) => `${src.split('/').slice(-1)[0].split('.')[0]}.${format}`,
    };
    Image(src, options);
    const metadata = Image.statsSync(src, options);
    let imageAttributes = {
        alt,
        sizes: "(max-width: 400px) 300px, (max-width: 700px) 600px, 1000px",
        loading: "lazy",
        decoding: "async",
    };
    console.log(metadata.jpeg[0]);
    // return Image.generateHTML(metadata, imageAttributes);
    return `<img src="${metadata.jpeg[0].url}" alt="${alt}" srcset="${metadata.jpeg.map(i => i.srcset).join(', ')}" ` +
        `sizes="(max-width: 400px) 300px, (max-width: 700px) 600px, 1000px" loading="lazy" decoding="async">`
        // TODO figure out why >600px stops gridding, size change too large?
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