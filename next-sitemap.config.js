/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "ajibestlandvendors.com.ng", // replace with your website
  generateRobotsTxt: true, // optionally generate robots.txt
  generateIndexSitemap: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000, // max URLs per sitemap
  exclude: [
    "/emailverification*",
    "/forgotResetPassword*",
    "/userDashboard*",
    "/admin*",
    "/auth*",
    "/api*",
    "/_next*",
  ],
};
