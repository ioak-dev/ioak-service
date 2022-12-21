import { Client } from "minio";
const FileReader = require("filereader");

const minioUrl = process.env.MINIO_URL || "localhost";
const minioPort: number = process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 8085;
const minioAccessKey = process.env.MINIO_ACCESS_KEY || "systemadmin";
const minioSecret = process.env.MINIO_SECRET || "systemadmin";

export const processFileUpload = async (
  dir: string,
  filename: string,
  file: any,
) => {
  const minioClient = new Client({
    endPoint: minioUrl,
    port: minioPort,
    // accessKey: "00mvVHMwC3Y27H7G",
    // secretKey: "5ndsSMifnom87qeA3bRjKNYRiDMh4pQE",
    accessKey: minioAccessKey,
    secretKey: minioSecret,
    useSSL: minioUrl !== "localhost",
  });
  const out = await minioClient.putObject(
    "ioaksite",
    `${dir}/${filename}`,
    file.buffer
  );
  const fileUrl = `${minioUrl === "localhost" ? "http" : "https"}://${minioUrl}:${minioPort}/ioaksite/${dir}/${filename}`;
  return fileUrl;
};

export const fileToBase64 = (file: any) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    // Read file content on file loaded event
    reader.onload = function (event: any) {
      resolve(event.target.result);
    };

    // Convert data to base64
    reader.readAsDataURL(file);
  });
};

const toBase64 = (file: any) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error: any) => reject(error);
});

export const processFileUploadBkp = async (
  base64: any,
  dir: string,
  file: string
) => {
  const minioClient = new Client({
    endPoint: "api.ioak.io",
    port: 8090,
    accessKey: "",
    secretKey: "",
    useSSL: true,
  });
  const out = await minioClient.putObject(
    "ioaksite",
    `${dir}/${file}.png`,
    base64ToBuffer(base64),
    undefined,
    {
      "Content-Type": "image/png",
    }
  );
  const fileUrl = `https://api.ioak.io:8090/ioaksite/${dir}/${file}.png`;
  return fileUrl;
};

const base64ToBuffer = (base64: any) => {
  return (Buffer as any).from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
};
