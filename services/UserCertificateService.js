const download = require("image-downloader");
const fs = require("fs");

exports.createCertificate = async ({ certificateLink }) => {
    try {
        const { filename } = await download.image({
            url: certificateLink,
            dest: `${__dirname}/../assets/images/${Date.now()}.${certificateLink.slice(
                certificateLink.length - 3
            )}`,
        });

        console.log(filename);

        // (A) LOAD MODULES
        const { registerFont, createCanvas, loadImage } = require("canvas");
        // (B) SETTINGS - CHANGE FONT TO YOUR OWN!
        const sFile = `${filename}`, // source image
            sSave = `${filename.replace("images", "pdfs")}`, // "save as"
            sText = "FRIED RICE", // text to write
            sX = 380,
            sY = 80; // text position
        // registerFont("C:/Windows/Fonts/arialbd.ttf", { family: "Arial Bold" });

        // (C) LOAD IMAGE + DRAW TEXT
        loadImage(sFile).then((img) => {
            // (C1) CREATE CANVAS + DRAW IMAGE
            const canvas = createCanvas(img.width, img.height),
                ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // (C2) TEXT DIMENSIONS
            ctx.font = "500px";
            ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgb(0, 0, 0)";
            let td = ctx.measureText(sText),
                tw = td.width,
                th = td.actualBoundingBoxAscent + td.actualBoundingBoxDescent;

            // (C3) CALCULATE CENTER & WRITE ON CENTER
            let x = Math.floor((img.naturalWidth - tw) / 2),
                y = Math.floor((img.naturalHeight - th) / 2);
            ctx.strokeText(sText, x, y);
            ctx.fillText(sText, x, y);

            // (C4) SAVE
            const out = fs.createWriteStream(sSave),
                stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on("finish", () => console.log("Done"));
        });
    } catch (error) {
        throw new Error("Error in creating certificateLink");
    }
};
