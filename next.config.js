const { redirect } = require("next/dist/server/api-utils");

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nextui.org",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/help",
        destination: `${process.env.NEXT_PUBLIC_GAME_HELP_API_ENDPOINT}`,
      },
      {
        source: "/api/search",
        destination: `${process.env.NEXT_PUBLIC_SEARCH_API_ENDPOINT}`,
      },
    ];
  },
};
