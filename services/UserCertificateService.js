const fs = require("fs");
const download = require("image-downloader");
const PdfDocument = require("pdfkit");
const { createCanvas, loadImage } = require("canvas");
const { cloudinary } = require("./../util/uploadHandler");
// const { height } = require("pdfkit/js/page");

//TODO:Remove that fucking callback hell (done)
exports.createCertificate = async ({ certificateLink, name }) => {
    // try {
    let userCertificateLink = "";
    console.log("working");
    //1- download the certificate
    const { filename } = await download.image({
        url: certificateLink,
        dest: `${__dirname}/../assets/images/${Date.now()}.${certificateLink.slice(
            certificateLink.length - 3
        )}`,
    });
    console.log("filename:" + filename);
    //2- write user name on certificate
    //LOAD MODULES
    //SETTINGS - CHANGE FONT TO YOUR OWN!
    const sFile = `${filename}`, // source image
        sSave = `${filename.replace("images", "pdfs")}`, // "save as"
        sText = name, // text to write
        sX = 380,
        sY = 80; // text position

    console.log("filename:" + sFile);
    //LOAD IMAGE + DRAW TEXT
    const img = await loadImage(sFile);
    //CREATE CANVAS + DRAW IMAGE
    const canvas = createCanvas(img.width, img.height),
        ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    //TEXT DIMENSIONS
    ctx.font = "30px Arial";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    let td = ctx.measureText(sText),
        tw = td.width,
        th = td.actualBoundingBoxAscent + td.actualBoundingBoxDescent;

    //CALCULATE CENTER & WRITE ON CENTER
    let x = Math.floor((img.naturalWidth - tw) / 2),
        y = Math.floor((img.naturalHeight - th) / 2);
    ctx.strokeText(sText, x, y);
    ctx.fillText(sText, x, y);

    // SAVE
    const out = fs.createWriteStream(sSave),
        stream = canvas.createJPEGStream();
    stream.pipe(out);
    out.on("finish", () => console.log("Done"));

    //3-save certificate to cloud
    await cloudinary.uploader.upload(
        `${filename.replace("images", "pdfs")}`,
        (error, result) => {
            if (error) {
                throw new Error(error.message);
            }
            userCertificateLink = result.url;
            console.log(result.url);
        }
    );

    //4-delete all certificate assets from local storage (images,pdfs)
    const filePath = filename;
    //delete from images
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log("Error deleting file:", err);
            return;
        }
    });

    //delete from pdfs
    fs.unlink(filePath.replace("images", "pdfs"), (err) => {
        if (err) {
            console.log("Error deleting file:", err);
            return;
        }
    });

    return userCertificateLink;
    // } catch (error) {
    //     console.log(error);
    //     throw new Error("Error in creating certificateLink");
    // }
};

exports.downloadImageAsPdf = async ({ certificateLink }) => {
    //1- download the certificate
    const { filename } = await download.image({
        url: certificateLink,
        dest: `${__dirname}/../assets/images/${Date.now()}.${certificateLink.slice(
            certificateLink.length - 3
        )}`,
    });

    //2- convert Image to pdf
    const doc = new PdfDocument({ size: [1024, 768] });
    doc.pipe(
        fs.createWriteStream(
            filename.replace("images", "pdfs").replace(".jpg", ".pdf")
        )
    );
    doc.image(filename, 0, 0, {
        fit: [1024, 768],
    })
        .rect(0, 0, 1023, 766)
        .stroke();
    doc.end();

    return filename.replace("images", "pdfs").replace(".jpg", ".pdf");
};
