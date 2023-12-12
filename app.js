import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import {uplaodJSONToIPFS} from "./ipfs-uploader.js";
import {uploadFileToIPFS} from "./ipfs-uploader.js";
import {mint} from "./nft-minter.js";
import dotenv from "dotenv";
dotenv.config("./.env");
import cros from "cors";
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use(cros())
app.get('/',(req,res) => {
    res.render('home');
})

app.post('/upload',(req,res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({message:'No files were uploaded.'});
    }
    const title = req.body.title;
    const description = req.body.description;
    const file = req.files.file;
    const filename = file.name;
    const filepath = "files/"+filename;

    file.mv(filepath,async (err) =>{
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }
        
        const fileResult = await uploadFileToIPFS(filepath);
        const fileCid = fileResult.cid.toString();
        const metadata = {
            title: title,
            description: description,
            image:process.env.IPFS_URL+fileCid
        }
        const metadataResult = await uplaodJSONToIPFS(metadata);
        const metadataCid = metadataResult.cid.toString();
        console.log(metadataCid);

        const userAddress  = address || process.env.ADDRESS;
        await mint(userAddress,process.env.IPFS_URL+metadataCid);
        res.json({
            message:"File uploaded successfully",
            metadata: metadata
        })
    })
});

const HOST = process.env.HOST
const PORT = process.env.PORT
app.listen(PORT, HOST,() => {
    console.log('Server is running on port ${PORT}');
});