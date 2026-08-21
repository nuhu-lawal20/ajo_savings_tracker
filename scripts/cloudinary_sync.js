const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "z7lof4pt",
  api_key: process.env.CLOUDINARY_API_KEY || "625586799818871",
  api_secret: process.env.CLOUDINARY_API_SECRET || "i3_vIQNsBsYeIi87Q1gu3VkbGNU",
});

async function uploadAssets() {
  const imagesDir = path.join(__dirname, "../public/images");
  const files = fs.readdirSync(imagesDir);

  console.log("Found files to upload to Cloudinary:", files);

  const results = {};

  for (const file of files) {
    if (file.endsWith(".jpg") || file.endsWith(".png")) {
      const filePath = path.join(imagesDir, file);
      const publicId = file.replace(/\.[^/.]+$/, "");
      console.log(`Uploading ${file} as kadashe/brand/${publicId}...`);

      try {
        const res = await cloudinary.uploader.upload(filePath, {
          folder: "kadashe/brand",
          public_id: publicId,
          overwrite: true,
          resource_type: "image",
        });
        console.log(`✓ Uploaded ${file} -> ${res.secure_url}`);
        results[file] = res.secure_url;
      } catch (err) {
        console.error(`✗ Error uploading ${file}:`, err.message);
      }
    }
  }

  // Save the Cloudinary asset mapping to a JSON file
  fs.writeFileSync(
    path.join(__dirname, "../src/lib/cloudinary-assets.json"),
    JSON.stringify(results, null, 2)
  );

  console.log("\nSaved Cloudinary asset mapping to src/lib/cloudinary-assets.json!");
}

uploadAssets();
