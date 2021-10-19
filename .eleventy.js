const fs = require("fs");
const path = require("path");
const htmlmin = require('html-minifier');
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

const imageShortcode = (src, alt, withLarge = false) => {
    const options = {
        widths: withLarge ? [300, 600, 1000] : [300, 600],
        formats: ["jpg", "webp"],
        outputDir: "./dist/img/",
        // outputDir: "./assets/pics_new/",
        // filenameFormat: (id, src, width, format, options) => `${src.split('/').slice(-1)[0].split('.')[0]}.${format}`,
    };
    Image(src, options);
    const metadata = Image.statsSync(src, options);
    const smallest = metadata.jpeg[0];
    const srcset = metadata.jpeg.slice(0, 2).concat(metadata.webp.slice(0, 2)).map(i => i.srcset).join(', ');
    const dataAttr = withLarge ? "data-large-src=" + metadata.jpeg[metadata.jpeg.length - 1].url : "";
    return `<img src="${smallest.url}" width=${smallest.width} height=${smallest.height} alt="${alt}" srcset="${srcset}" ${dataAttr} loading="lazy" defer="async">`
}

const createPicsCollection = () => {
    const picsDirectory = path.resolve(__dirname, "./assets/pics");
    const picFilenames = fs.readdirSync(picsDirectory);
    return picFilenames.map((filename, index) => ({ index, src: `assets/pics/${filename}`, alt: filename.split('.')[0] }));
};

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "assets/passthrough": "." });
    eleventyConfig.addWatchTarget("./src/js/");
    eleventyConfig.addCollection("pics", createPicsCollection);
    eleventyConfig.addTransform("htmlmin", htmlMinTransform);

    eleventyConfig.addShortcode("image", imageShortcode);
    global.helpers = eleventyConfig.javascriptFunctions;
    eleventyConfig.setPugOptions({ globals: ['helpers'] });

    return {
        dir: {
            input: "src",
            output: "dist",
        }
    }
};