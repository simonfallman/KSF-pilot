import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/kravbot",
  output: "standalone",
  serverExternalPackages: ["@anthropic-ai/bedrock-sdk", "@anthropic-ai/sdk"],
};

export default nextConfig;
