/** @type {import('next').NextConfig} */
const nextConfig = {};
// next.config.js
module.exports = {
    env: {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
    },
  };
  
export default nextConfig;
