/** @type {import('next').NextConfig} */


const nextConfig = {
  
  images: {
    domains: ["jxttsugezpnysmpnbxmj.supabase.co","via.placeholder.com","165.22.178.52/api","165.22.178.52","qjnpgjlfainsqjptehhu.supabase.co", "community-hazel.vercel.app","localhost:3000","127.0.0.1", "127.0.0.1:8000"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
};

export default nextConfig;
