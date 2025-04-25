import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // 协议
        hostname: "media.rawg.io", // 允许的域名
        port: "", // 端口（通常为空）
        pathname: "/media/**", // 允许路径的模式（'/**' 表示允许该域名下的所有路径）
      },
      // 如果未来有其他需要允许的图片域名，可以在这里继续添加
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-domain.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
  /* config options here */
};

export default nextConfig;
