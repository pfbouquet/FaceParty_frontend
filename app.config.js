export default () => ({
  expo: {
    name: "FaceParty",
    slug: "faceparty",
    version: "1.0.0",
    extra: {
      BACKEND_URL: process.env.BACKEND_URL,
    },
  },
});
