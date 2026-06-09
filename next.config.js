import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "0.0.0.0"],
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "unavatar.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/learn/:path*",
        destination: "/curriculum/:path*",
        permanent: true,
      },
      {
        source: "/courses",
        destination: "/curriculum",
        permanent: true,
      },
      {
        source: "/cirricum",
        destination: "/curriculum",
        permanent: true,
      },
      {
        source: "/circulum",
        destination: "/curriculum",
        permanent: true,
      },
      {
        source: "/curricum",
        destination: "/curriculum",
        permanent: true,
      },
      {
        source: "/curriculum/ad/cn/:path*",
        destination: "/curriculum/cn/cn/:path*",
        permanent: true,
      },
      {
        source: "/curriculum/ad/coa/:path*",
        destination: "/curriculum/coa/coa/:path*",
        permanent: true,
      },
      {
        source: "/curriculum/ad/os/:path*",
        destination: "/curriculum/os/os/:path*",
        permanent: true,
      },
      {
        source: "/curriculum/ad/digital-electronics/:path*",
        destination: "/curriculum/digital-electronics/digital-electronics/:path*",
        permanent: true,
      },
      {
        source: "/curriculum/ad/signals-and-systems/:path*",
        destination: "/curriculum/signals-and-systems/signals-and-systems/:path*",
        permanent: true,
      },
      {
        source: "/curriculum/ad/communication-systems/:path*",
        destination: "/curriculum/communication-systems/communication-systems/:path*",
        permanent: true,
      },
      {
        source: "/curriculum/ad/dbms/:path*",
        destination: "/curriculum/dbms/dbms/:path*",
        permanent: true,
      },
      {
        source: "/curriculum/ad/control-systems/:path*",
        destination: "/curriculum/control-systems/control-systems/:path*",
        permanent: true,
      },
      {
        source: "/curriculum/ad/compiler-design/:path*",
        destination: "/curriculum/compiler-design/compiler-design/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
