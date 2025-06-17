const react = require("@vitejs/plugin-react");

module.exports = {
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: "all",
  },
};
