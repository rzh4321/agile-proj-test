import app from "./app.js";

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3001;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
