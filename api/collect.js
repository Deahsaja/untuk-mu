import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {

    const uploadDir =
      "/tmp/geolens-uploads";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true
      });
    }


    const form =
      new IncomingForm({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 8 * 1024 * 1024
      });


    const [fields, files] =
      await new Promise((resolve, reject) => {

        form.parse(
          req,
          (error, fields, files) => {

            if (error) {
              reject(error);
              return;
            }

            resolve([
              fields,
              files
            ]);

          }
        );

      });


    const nama =
      Array.isArray(fields.nama)
        ? fields.nama[0]
        : fields.nama || "";

    const whatsapp =
      Array.isArray(fields.whatsapp)
        ? fields.whatsapp[0]
        : fields.whatsapp || "";

    const latitude =
      Array.isArray(fields.latitude)
        ? fields.latitude[0]
        : fields.latitude || "";

    const longitude =
      Array.isArray(fields.longitude)
        ? fields.longitude[0]
        : fields.longitude || "";


    const photo =
      files.photo;


    console.log(
      "DATA PENGUNJUNG:",
      {
        nama,
        whatsapp,
        latitude,
        longitude
      }
    );


    if (photo) {

      const file =
        Array.isArray(photo)
          ? photo[0]
          : photo;


      console.log(
        "FOTO:",
        file.filepath
      );

    }


    return res.status(200).json({
      success: true
    });

  } catch(error) {

    console.error(error);

    return res.status(500).json({
      success: false
    });

  }

}
