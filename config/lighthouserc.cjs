/* global module, process */

module.exports = {
  ci: {
    collect: {
      startServerCommand:
        `npm.cmd --prefix "${process.env.NEUSTAND_PROJECT_ROOT}" run start -- --hostname 127.0.0.1 --port 4317`,
      startServerReadyPattern: "Ready in",
      startServerReadyTimeout: 120000,
      url: ["http://127.0.0.1:4317/"],
      numberOfRuns: 1,
      settings: {
        chromeFlags: ["--headless"],
      },
    },
    assert: {
      preset: "lighthouse:recommended",
    },
    upload: {
      target: "filesystem",
      outputDir: "../reports",
    },
  },
};
