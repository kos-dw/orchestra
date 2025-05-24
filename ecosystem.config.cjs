module.exports = {
  apps: [
    {
      name: "delete-expired-sessions",
      script: "scripts/deleteExpiredSessions.ts",
      instances: 1,
      interpreter: "node",
      interpreterArgs: "--import tsx",
      cron_restart: "* */1 * * *",
    },
  ],
};
