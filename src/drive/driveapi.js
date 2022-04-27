const { google } = require("googleapis");
//const path = require("path");
const fs = require("fs");
const fx = require("fs").promises;

const driveAuth = JSON.parse(fs.readFileSync("./src/credentials/driveapidata.json"));

const CLIENT_ID = driveAuth.web.client_id;
const CLIENT_SECRET = driveAuth.web.client_secret;
const REDIRECT_URL = driveAuth.web.redirect_uris[0];

const REFRESH_TOKEN = driveAuth.web.refresh_token;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});

const drive = google.drive({
    version: "v3",
    auth: oauth2Client
});

async function uploadFile(file) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: file.originalname,
                mimeType: file.mimetype
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file)
            }
        })
        deleteTemporal(file.path);
        const url = await genereateFileUrl(response.data.id);
        return {
            message: "File uploaded successfully",
            fileId: response.data.id,
            fileUrl: url
        };
    } catch (err) {
        console.log(err.message);
    }
}

const deleteTemporal = async(ruta) => {
    try {
        setTimeout(() => {
            fx.unlink(ruta);
            return true;
        }, 5000);
    } catch (e) {
        console.error(e);
    }
}

async function genereateFileUrl(id) {
    await drive.permissions.create({
        fileId: id,
        requestBody: {
            role: "reader",
            type: "anyone"
        }
    })
    const result = await drive.files.get({
        fileId: id,
        fields: "webViewLink, webContentLink"
    });
    return result.data.webContentLink;
}

module.exports = uploadFile;