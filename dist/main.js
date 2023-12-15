var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { JSONPreset } from "lowdb/node";
let db = null;
function initializeDB() {
    return __awaiter(this, void 0, void 0, function* () {
        db = yield JSONPreset("db.json", { posts: [] });
    });
}
initializeDB();
const app = express();
app.use(express.json());
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (db !== null) {
        db.data.posts.push({ "username": "krithika" });
        yield db.write();
        res.json({ username: "krithika" });
    }
    else {
        console.log("Couldnt Post Data");
    }
}));
/**
 * Start the Express server on the specified port.
 */
app.listen(4000, () => {
    console.log(`Server is running on port 4000`);
});
export default app;
