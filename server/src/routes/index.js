import chatRoutes from "./chat.routes.js"
import express from 'express'
const router = express.Router()

const defaultRoutes = [
    {
        path: "/chats",
        route: chatRoutes
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router