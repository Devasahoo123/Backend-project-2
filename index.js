import express from "express";
import path  from "path";
import URL from "./models/url.js";
import urlRoute from "./routes/url.js";
import connectToMongoDB from "./connect.js";


const app=express();
const PORT = 3001;

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log( 'connected to MongoDB' )).catch((err)=> console.error( err));

app.set("veiw engine","ejs");// here we set our veiw engin as ejs
app.set('views',path.resolve('./views'));// here we connect ejs file
  



app.use(express.json());
app.get('/:shortId',async(req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId
    },
    {
        $push:
            {
                visitHistory:
                {
                    timestamp: Date.now(),
                },
            }
    }, {
        new: true
    });
    if (!entry){
        return res.status(404).json({error: "Entry not found"});
    }
    res.redirect(entry.redirectURL);
});

app.use("/url",urlRoute);

app.get('/', (_, res) => {
    res.send("API is running");
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 