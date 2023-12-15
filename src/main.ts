
import express from "express";
import { type Request, type Response } from "express";
import { Low } from "lowdb";
import { JSONPreset } from "lowdb/node";
interface Post {
  username: string;
}
let db: Low<{ posts: Post[] }> | null = null;
async function initializeDB(){
   db = await JSONPreset<{ posts: Post[] }>("db.json", { posts: [] });
}
initializeDB()
const app = express();


app.use(express.json());

app.post("/register",async(req:Request,res:Response)=>{
   if(db!==null){
    db.data.posts.push({"username":"krithika"})
    await db.write()
    res.json({ username: "krithika" });
   }
   else{
    console.log("Couldnt Post Data")
   }
})
/**
 * Start the Express server on the specified port.
 */
app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});

export default app;
