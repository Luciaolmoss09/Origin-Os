import { createDriveFolder, readOriginMethodology } from "./src/lib/drive/google";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testDrive() {
  console.log("🚀 Iniciando prueba del Cerebro de Origin con Google Drive...");

  // 1. Probar lectura del Cerebro (Metodología)
  console.log("\n📚 Leyendo documentos del Cerebro Origin...");
  const brainRes = await readOriginMethodology();
  if (brainRes.success) {
    if (brainRes.files && brainRes.files.length > 0) {
      console.log(`✅ ¡Éxito! Encontré ${brainRes.files.length} documentos de metodología.`);
      brainRes.files.forEach(f => console.log(`   - ${f.name} (Tipo: ${f.mimeType})`));
    } else {
      console.log("⚠️ Conexión exitosa, pero la carpeta del Cerebro está vacía actualmente.");
    }
  } else {
    console.error("❌ Falló la lectura del Cerebro.");
  }

  // 2. Probar creación de carpeta en Clientes
  console.log("\n📁 Intentando crear carpeta de prueba en 'Clientes Origin'...");
  const clientsFolderId = process.env.DRIVE_CLIENTS_FOLDER_ID;
  if (!clientsFolderId) return console.error("❌ DRIVE_CLIENTS_FOLDER_ID no configurado.");

  const createRes = await createDriveFolder("000 - Prueba de Origin Bot", clientsFolderId);
  if (createRes.success) {
    console.log("✅ ¡Carpeta creada exitosamente!");
    console.log("🔗 Enlace:", createRes.folderLink);
  }
}

testDrive();
