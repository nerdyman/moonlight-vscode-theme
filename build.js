const fs = require("fs/promises");
const path = require("path");

const package = require("./package.json");
const colors = require("./src/colors");

const paths = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "themes"),
};

(async () => {
  await fs.rmdir(paths.dist, { recursive: true });
  await fs.mkdir(paths.dist);

  const regexp = new RegExp(Object.keys(colors).join("|"), "g");

  await Promise.all(
    package.contributes.themes.map(async (theme) => {
      const basename = path.basename(theme.path);

      console.log(`[build] Creating theme from '${basename}'`);

      const srcTheme = await fs.readFile(
        path.join(paths.src, basename),
        "utf-8",
      );

      console.log(`[build] Writing theme to '${theme.path}'`);

      return fs.writeFile(
        theme.path,
        srcTheme.replace(regexp, (matched) => colors[matched]),
      );
    }),
  );
})();
