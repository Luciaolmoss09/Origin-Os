import { google } from "googleapis";

// Initialize the Google Drive Client
const getDriveClient = () => {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}");
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
};

/**
 * Creates a new folder in Google Drive
 */
export async function createDriveFolder(folderName: string, parentFolderId: string) {
  try {
    const drive = getDriveClient();
    
    const fileMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id, webViewLink",
    });

    console.log(`✅ Carpeta de Drive creada: ${folderName}`);
    return { 
      success: true, 
      folderId: file.data.id,
      folderLink: file.data.webViewLink 
    };

  } catch (error) {
    console.error("❌ Error creando carpeta en Drive:", error);
    return { success: false, error };
  }
}

/**
 * Lists documents inside the "Origin Brain" methodology folder
 */
export async function readOriginMethodology() {
  try {
    const drive = getDriveClient();
    const brainFolderId = process.env.DRIVE_BRAIN_FOLDER_ID;

    if (!brainFolderId) throw new Error("ID de Cerebro no configurado.");

    const res = await drive.files.list({
      q: `'${brainFolderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType)",
    });

    return { success: true, files: res.data.files };
  } catch (error) {
    console.error("❌ Error leyendo Cerebro Origin:", error);
    return { success: false, error };
  }
}

/**
 * Downloads the text content of a Google Doc for AI ingestion.
 */
export async function readDocumentContent(fileId: string) {
  try {
    const drive = getDriveClient();
    const res = await drive.files.export({
      fileId: fileId,
      mimeType: "text/plain",
    });
    
    return { success: true, text: res.data as unknown as string };
  } catch (error) {
    console.error("❌ Error exportando contenido del documento:", error);
    return { success: false, error };
  }
}
