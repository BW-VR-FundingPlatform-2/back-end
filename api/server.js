const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require("cookie-parser")
// const authenticate = require('../middleware/restrict.js');
const authRouter = require('../auth/auth-router.js');
const usersRouter = require("../users/users-router.js")
const projectsRouter = require("../projects/projects-router.js")
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(cookieParser())
server.use('/api/auth', authRouter);
server.use("/api/users", usersRouter)
server.use("/api/users", projectsRouter)

server.get("/", (req, res, next) => {
	res.status(200).json({
		message: "Welcome to our API",
	})
})

server.use((err, req, res, next) => {
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`\n=== Server listening on port ${PORT} ===\n`);
});

module.exports = server;

