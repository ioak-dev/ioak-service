import { processFileUpload } from "../../lib/minioutils";
import { v4 as uuidv4 } from "uuid";

export const uploadImage = async (file: any, path: string = 'blog') => {
  const extension = file.originalname.substr(file.originalname.lastIndexOf("."));
  // const filename = `${id}${extension}`;
  const fileurl = await processFileUpload(path, `${uuidv4()}_${file.originalname}`, file);

  return {
    url: fileurl
  }
};
