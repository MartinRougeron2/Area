import express from "express";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID ?? "",
  process.env.GOOGLE_CLIENT_SECRET ?? "",
  "https://localhost:3000/auth/google/callback"
);

module.exports = (app: any) => {
  app.get(
    "/auth/googleDrive",
    (req: express.Request, res: express.Response) => {
      const mail = req.query.email as unknown as string;

      const url = oAuth2Client.generateAuthUrl({
        access_type: "online",
        scope: SCOPES,
        state: mail,
      });
      console.log(url)
      res.redirect(url)
    }
  );
};
