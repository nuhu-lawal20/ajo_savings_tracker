const fs = require("fs");
const path = require("path");
const https = require("https");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "z7lof4pt",
  api_key: process.env.CLOUDINARY_API_KEY || "625586799818871",
  api_secret: process.env.CLOUDINARY_API_SECRET || "i3_vIQNsBsYeIi87Q1gu3VkbGNU",
});

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

// 1. Create a 512x512 SVG of the KAD A DASHE logo with rich background and gradient aesthetics
const kadadasheSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F2744" />
      <stop offset="50%" stop-color="#071322" />
      <stop offset="100%" stop-color="#020813" />
    </linearGradient>

    <!-- Glowing Rim -->
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="50%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#008751" />
    </linearGradient>

    <!-- Top Tier Cyan-Azure Gradient (KAD) -->
    <linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="60%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="65%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#0369A1" />
    </linearGradient>

    <!-- Shared Extending Leg -->
    <linearGradient id="legGrad" x1="0%" y1="0%" x2="40%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="50%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#60A5FA" />
    </linearGradient>

    <!-- Bottom Tier Deep Cobalt-Ice Gradient (DASHE) -->
    <linearGradient id="dasheGrad" x1="0%" y1="0%" x2="30%" y2="100%">
      <stop offset="0%" stop-color="#BAE6FD" />
      <stop offset="25%" stop-color="#60A5FA" />
      <stop offset="60%" stop-color="#2563EB" />
      <stop offset="85%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0F2744" />
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0284C7" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <!-- Outer Subtle Neon Border -->
  <rect x="8" y="8" width="496" height="496" rx="104" stroke="url(#rimGrad)" stroke-width="4" stroke-opacity="0.6"/>

  <!-- Centered KAD A DASHE Vector Logo (Scaled 2.6x) -->
  <g transform="translate(64, 168) scale(2.6)" filter="url(#shadow)">
    <!-- TOP TIER: KAD -->
    <g fill="url(#topGrad)">
      <!-- K -->
      <path d="M4 6 H11 V15.5 L19.5 6 H28 L17.5 17.5 L28.5 28 H19.5 L11 19 V28 H4 Z" />
      
      <!-- A -->
      <path d="M32 28 L40.5 6 H48.5 L57 28 H50 L48.2 23 H40.8 L39 28 H32 Z M42.2 18 H46.8 L44.5 11 Z" />
      
      <!-- D -->
      <path d="M62 6 H72.5 C79 6 83.5 10 83.5 17 C83.5 24 79 28 72.5 28 H62 Z M69 11.5 V22.5 H72.5 C75.5 22.5 77 20.5 77 17 C77 13.5 75.5 11.5 72.5 11.5 Z" />
    </g>

    <!-- TOP TIER: SHARED 'A' WITH DYNAMIC EXTENDING LEG -->
    <g>
      <!-- A Letterform -->
      <path
        d="M98 28 L106.5 6 H114.5 L123 28 H116.5 L114.8 23 H106.2 L104.5 28 H98 Z M107.8 18 H113.2 L110.5 11 Z"
        fill="url(#topGrad)"
      />
      <!-- Elegant Diagonal Leg sweeping down to bottom right -->
      <path
        d="M115 14 L126.5 58"
        stroke="url(#legGrad)"
        stroke-width="3.2"
        stroke-linecap="round"
      />
    </g>

    <!-- BOTTOM TIER: DASHE with Gradient Depth -->
    <g fill="url(#dasheGrad)">
      <!-- D -->
      <path d="M4 38 H14.5 C21 38 25.5 42 25.5 49 C25.5 56 21 60 14.5 60 H4 Z M11 43.5 V54.5 H14.5 C17.5 54.5 19 52.5 19 49 C19 45.5 17.5 43.5 14.5 43.5 Z" />
      
      <!-- A -->
      <path d="M29 60 L37.5 38 H45.5 L54 60 H47 L45.2 55 H37.8 L36 60 H29 Z M39.2 50 H43.8 L41.5 43 Z" />
      
      <!-- S -->
      <path d="M57 56.5 L61.5 54.8 C62.2 56.2 63.8 57 66 57 C68.2 57 69.8 56.2 69.8 54.8 C69.8 53.4 68.5 52.6 64.5 51.5 C60 50.3 57.5 48.5 57.5 44.5 C57.5 40.2 61.2 38 66 38 C70.5 38 74 40.2 74.8 44.2 L70.2 45.4 C69.6 43.5 68.2 42.4 66 42.4 C64 42.4 62.5 43.2 62.5 44.4 C62.5 45.6 63.8 46.2 67.5 47.3 C72 48.5 74.8 50.2 74.8 54.5 C74.8 59 71 61.2 66 61.2 C61 61.2 57.5 58.8 57 56.5 Z" />
      
      <!-- H -->
      <path d="M78 38 H85 V46.5 H94 V38 H101 V60 H94 V52 H85 V60 H78 Z" />
      
      <!-- E -->
      <path d="M105 38 H118 V43.5 H111.5 V46.5 H117 V51.5 H111.5 V54.5 H118.5 V60 H105 Z" />
    </g>
  </g>
</svg>
`;

async function run() {
  const svgPath = path.join(__dirname, "../public/icons/kadashe-logo-icon.svg");
  fs.writeFileSync(svgPath, kadadasheSvg);
  console.log("✓ Created vector SVG:", svgPath);

  console.log("Uploading KAD A DASHE logo vector to Cloudinary...");
  const uploadRes = await cloudinary.uploader.upload(svgPath, {
    folder: "kadashe/brand",
    public_id: "kadashe-pwa-app-icon",
    overwrite: true,
    resource_type: "image",
  });

  console.log("✓ Uploaded to Cloudinary:", uploadRes.secure_url);

  const cloudBase = "https://res.cloudinary.com/z7lof4pt/image/upload";
  const publicId = "kadashe/brand/kadashe-pwa-app-icon";

  const targets = [
    {
      url: `${cloudBase}/w_512,h_512,c_fit,f_png/v1787326775/${publicId}.png`,
      dest: path.join(__dirname, "../public/icons/icon-512.png"),
    },
    {
      url: `${cloudBase}/w_192,h_192,c_fit,f_png/v1787326775/${publicId}.png`,
      dest: path.join(__dirname, "../public/icons/icon-192.png"),
    },
    {
      url: `${cloudBase}/w_180,h_180,c_fit,f_png/v1787326775/${publicId}.png`,
      dest: path.join(__dirname, "../public/apple-touch-icon.png"),
    },
    {
      url: `${cloudBase}/w_64,h_64,c_fit,f_ico/v1787326775/${publicId}.ico`,
      dest: path.join(__dirname, "../public/favicon.ico"),
    },
    {
      url: `${cloudBase}/w_64,h_64,c_fit,f_ico/v1787326775/${publicId}.ico`,
      dest: path.join(__dirname, "../src/app/favicon.ico"),
    },
    {
      url: `${cloudBase}/w_192,h_192,c_fit,f_png/v1787326775/${publicId}.png`,
      dest: path.join(__dirname, "../src/app/icon.png"),
    },
    {
      url: `${cloudBase}/w_180,h_180,c_fit,f_png/v1787326775/${publicId}.png`,
      dest: path.join(__dirname, "../src/app/apple-icon.png"),
    },
  ];

  console.log("\nDownloading high-res KAD A DASHE PWA app icons...");

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

  console.log("\n🚀 All KAD A DASHE Phone PWA App Icons & Favicons successfully deployed!");
}

run();
