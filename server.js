require("dotenv").config();

const app = require("./src/app");

// PORT
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});