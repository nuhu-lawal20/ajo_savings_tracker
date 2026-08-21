const fs = require("fs");
const path = require("path");
const https = require("https");

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        }
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function generateIcons() {
  const cloudBase = "https://res.cloudinary.com/z7lof4pt/image/upload";
  const crocodileAsset = "kadashe/brand/kadashe-crocodile-vault.jpg";

  const targets = [
    {
      url: `${cloudBase}/w_512,h_512,c_fill,g_center,f_png/v1787326776/${crocodileAsset}`,
      dest: path.join(__dirname, "../public/icons/icon-512.png"),
    },
    {
      url: `${cloudBase}/w_192,h_192,c_fill,g_center,f_png/v1787326776/${crocodileAsset}`,
      dest: path.join(__dirname, "../public/icons/icon-192.png"),
    },
    {
      url: `${cloudBase}/w_180,h_180,c_fill,g_center,f_png/v1787326776/${crocodileAsset}`,
      dest: path.join(__dirname, "../public/apple-touch-icon.png"),
    },
    {
      url: `${cloudBase}/w_64,h_64,c_fill,g_center,f_ico/v1787326776/${crocodileAsset}`,
      dest: path.join(__dirname, "../public/favicon.ico"),
    },
    {
      url: `${cloudBase}/w_64,h_64,c_fill,g_center,f_ico/v1787326776/${crocodileAsset}`,
      dest: path.join(__dirname, "../src/app/favicon.ico"),
    },
    {
      url: `${cloudBase}/w_192,h_192,c_fill,g_center,f_png/v1787326776/${crocodileAsset}`,
      dest: path.join(__dirname, "../src/app/icon.png"),
    },
    {
      url: `${cloudBase}/w_180,h_180,c_fill,g_center,f_png/v1787326776/${crocodileAsset}`,
      dest: path.join(__dirname, "../src/app/apple-icon.png"),
    },
  ];

  console.log("Generating PWA icons and favicons from Cloudinary...");

  for (const item of targets) {
    const dir = path.dirname(item.dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    try {
      await downloadFile(item.url, item.dest);
      console.log(`✓ Saved ${path.relative(path.join(__dirname, ".."), item.dest)}`);
    } catch (err) {
      console.error(`✗ Error saving ${item.dest}:`, err.message);
    }
  }

  console.log("\nAll PWA icons & favicons successfully generated!");
}

generateIcons();
