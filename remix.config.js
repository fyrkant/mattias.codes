/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildTarget: "netlify",
  publicPath: "/build/",
  serverBuildPath: "netlify/functions/server/build",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"],
};
