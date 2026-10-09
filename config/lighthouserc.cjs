/* global module, process */

module.exports = {
  ci: {
    collect: {
      startServerCommand:
        `node "${process.env.NEUSTAND_PROJECT_ROOT}/node_modules/next/dist/bin/next" start "${process.env.NEUSTAND_PROJECT_ROOT}" -H 127.0.0.1 -p 4317`,
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
