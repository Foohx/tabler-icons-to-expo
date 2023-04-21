import https from "https";
import fs from "fs";
import path from "path";
import readline from "readline";

const TEMP_DIR = "tmp/";

const OUTPUT_DIR = "output/";
const OUTPUT_FILES = {
  scss: "tabler-icons.scss",
  ttf: "tabler-icons.ttf",
  json: "glyph-map.json",
};

const GH_REPO =
  "https://raw.githubusercontent.com/tabler/tabler-icons/master/packages/icons-webfont/";
const GH_FILES = [
  { src: "tabler-icons.scss", dst: OUTPUT_FILES.scss },
  { src: "fonts/tabler-icons.ttf", dst: OUTPUT_FILES.ttf },
];

function downloadFile(url: string, destination: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      })
      .on("error", (error) => {
        fs.unlink(destination, () => {
          reject(false);
        });
      });

    const dir = path.dirname(destination);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

async function extractVersion(): Promise<string | null> {
  const stream = fs.createReadStream(`${TEMP_DIR}${OUTPUT_FILES.scss}`);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const ln = line.trim();

    const regex = /Tabler Icons (\d+\.\d+\.\d+) by tabler/;
    const match = ln.match(regex);
    if (match) {
      return match[1];
    }
  }

  return null;
}

async function extractGlyphMap(): Promise<{ [key: string]: string } | null> {
  const glyphMap = {};

  const stream = fs.createReadStream(`${TEMP_DIR}${OUTPUT_FILES.scss}`);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const ln = line.trim();
    if (!ln.startsWith("$ti-icon-")) {
      continue;
    }

    const re = /^\$ti-icon-(.*)?:.*?unicode\('(.*)?'\);$/;
    const match = ln.match(re);
    if (match) {
      glyphMap[match[1]] = parseInt(match[2], 16);
    }
  }

  return Object.keys(glyphMap).length > 0 ? glyphMap : null;
}

function clean() {
  fs.rmSync(TEMP_DIR, { recursive: true });
}

(async () => {
  console.log(`Downloading ${GH_FILES.length} files..`);
  const results = await Promise.all(
    GH_FILES.map((f) =>
      downloadFile(`${GH_REPO}${f.src}`, `${TEMP_DIR}${f.dst}`)
    )
  );
  if (results.includes(false)) {
    clean();
    console.error("Failed to download files");
    return;
  }

  console.log("Extracting version..");
  const version = await extractVersion();
  if (!version) {
    clean();
    console.error("Failed to extract version");
    return;
  }

  const outputDirectory = `${OUTPUT_DIR}${version}/`;
  if (fs.existsSync(outputDirectory)) {
    clean();
    console.error(`Version ${version} already exists in ${outputDirectory}`);
    return;
  }

  console.log("Extracting glyphs..");
  const glyphMap = await extractGlyphMap();
  if (!glyphMap) {
    clean();
    console.error("Failed to extract glyphs");
    return;
  }

  console.log("Building output..");
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  // Write glyph-map file
  fs.writeFileSync(
    `${outputDirectory}${OUTPUT_FILES.json}`,
    JSON.stringify(glyphMap, null, 2)
  );

  // Move font file to the output directory
  fs.renameSync(
    `${TEMP_DIR}${OUTPUT_FILES.ttf}`,
    `${outputDirectory}${OUTPUT_FILES.ttf}`
  );

  console.log(`Version ${version} successfully built in ${outputDirectory}`);
  clean();
})();
