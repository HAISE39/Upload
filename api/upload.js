const { IncomingForm } = require('formidable');
const fs = require('fs').promises;
const axios = require('axios');
const mime = require('mime-types');

// Helper function untuk membuat FormData
function createFormData() {
  const FormData = require('form-data');
  return new FormData();
}

// === CONFIG UNTUK TERMAI API ===
const termaiKey = "AIzaBj7z2z3xBjsk";
const termaiDomain = 'https://c.termai.cc';

// Simple file type detection tanpa file-type package
function getFileExtension(filename, buffer) {
  const ext = filename.split('.').pop();
  return ext || 'bin';
}

// Fungsi upload ke Termai
async function uploadTermai(fileBuffer, filename) {
  try {
    const ext = getFileExtension(filename, fileBuffer);
    const formData = createFormData();
    formData.append('file', fileBuffer, { filename: `file.${ext}` });

    const res = await axios.post(`${termaiDomain}/api/upload?key=${termaiKey}`, formData, {
      headers: formData.getHeaders(),
      timeout: 120000
    });

    if (res.data && res.data.status && res.data.path) {
      return res.data.path;
    }
    throw new Error("Upload ke Termai gagal");
  } catch (err) {
    console.error("Termai Error:", err.message);
    return null;
  }
}

// Upload ke qu.ax
async function pomf2(fileBuffer, filename) {
  try {
    const contentType = mime.lookup(filename) || "application/octet-stream";
    const form = createFormData();
    form.append("files[]", fileBuffer, {
      contentType,
      filename: filename,
    });
    
    const response = await axios.post("https://qu.ax/upload.php", form, {
      headers: { ...form.getHeaders() },
    });
    
    if (response.data && response.data.success && response.data.files && response.data.files.length > 0) {
      return response.data.files[0].url;
    }
    throw new Error("Upload ke qu.ax gagal - Response tidak valid");
  } catch (err) {
    console.error("Pomf2 Error:", err.message);
    return null;
  }
}

// Upload ke catbox.moe
async function uploadCatbox(buffer, filename) {
  try {
    const ext = getFileExtension(filename, buffer);
    const form = createFormData();
    form.append("fileToUpload", buffer, "file." + ext);
    form.append("reqtype", "fileupload");
    
    const res = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
    });
    
    if (res.data && typeof res.data === 'string' && res.data.startsWith('http')) {
      return res.data;
    }
    throw new Error("Upload ke catbox.moe gagal");
  } catch (err) {
    console.error("Catbox Error:", err.message);
    return null;
  }
}

// Upload ke pomf2.lain.la
async function uploadPomf2Lain(fileBuffer, filename) {
  try {
    const mime = require('mime-types');
    const contentType = mime.lookup(filename) || "application/octet-stream";
    const form = createFormData();
    form.append("files[]", fileBuffer, {
      contentType,
      filename: filename,
    });
    
    const response = await axios.post("https://pomf2.lain.la/upload.php", form, {
      headers: { ...form.getHeaders() },
    });
    
    if (response.data && response.data.success && response.data.files && response.data.files.length > 0) {
      return response.data.files[0].url;
    }
    throw new Error("Upload ke pomf2.lain.la gagal");
  } catch (err) {
    console.error("Pomf2 Lain Error:", err.message);
    return null;
  }
}

// Upload ke cdn.ypnk.biz.id
async function uploadYpnk(buffer, filename) {
  try {
    const form = createFormData();
    form.append("files", buffer, { filename });
    
    const response = await axios.post("https://cdn.ypnk.biz.id/upload", form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
      },
      timeout: 120000
    });
    
    if (response.data && response.data.success && response.data.files && response.data.files[0]) {
      return `https://cdn.ypnk.biz.id${response.data.files[0].url}`;
    }
    throw new Error("Upload ke cdn.ypnk.biz.id gagal");
  } catch (err) {
    console.error("Ypnk Error:", err.message);
    return null;
  }
}

// Upload ke tmpfiles.org
async function uploadTmpFiles(buffer, filename) {
  try {
    const form = createFormData();
    form.append("file", buffer, { filename });
    
    const res = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
      headers: form.getHeaders(),
      timeout: 120000
    });
    
    if (res.data && res.data.data && res.data.data.url) {
      const idMatch = res.data.data.url.match(/\/(\d+)(?:\/|$)/);
      if (idMatch) {
        return `https://tmpfiles.org/dl/${idMatch[1]}/${filename}`;
      }
    }
    throw new Error("Upload ke tmpfiles.org gagal");
  } catch (err) {
    console.error("TmpFiles Error:", err.message);
    return null;
  }
}

// Upload ke put.icu
async function uploadPutIcu(buffer, filename) {
  try {
    const contentType = mime.lookup(filename) || "application/octet-stream";
    
    const res = await axios.put(`https://put.icu/upload/`, buffer, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': contentType
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 120000
    });
    
    if (res.data && res.data.direct_url) {
      return res.data.direct_url;
    }
    if (res.data && res.data.url) {
      return res.data.url;
    }
    throw new Error("Upload ke put.icu gagal");
  } catch (err) {
    console.error("PutIcu Error:", err.message);
    return null;
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Parse form data
    const form = new IncomingForm();
    
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    if (!files.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tidak ada file yang diunggah' 
      });
    }

    const services = JSON.parse(fields.services || '[]');
    const fileBuffer = await fs.readFile(files.file[0].filepath);
    const filename = files.file[0].originalFilename;

    console.log(`Memproses upload file: ${filename} (${fileBuffer.length} bytes) ke ${services.length} layanan`);

    // Mapping service IDs ke fungsi upload
    const uploadFunctions = {
      'termai': () => uploadTermai(fileBuffer, filename),
      'quax': () => pomf2(fileBuffer, filename),
      'catbox': () => uploadCatbox(fileBuffer, filename),
      'pomf2lain': () => uploadPomf2Lain(fileBuffer, filename),
      'ypnk': () => uploadYpnk(fileBuffer, filename),
      'tmpfiles': () => uploadTmpFiles(fileBuffer, filename),
      'puticu': () => uploadPutIcu(fileBuffer, filename)
    };

    // Eksekusi upload ke semua service yang dipilih
    const uploadPromises = services.map(async (serviceId) => {
      const uploadFunction = uploadFunctions[serviceId];
      if (!uploadFunction) {
        return {
          service: serviceId,
          success: false,
          error: 'Service tidak dikenali'
        };
      }

      try {
        console.log(`Uploading to ${serviceId}...`);
        const url = await uploadFunction();
        console.log(`Result from ${serviceId}:`, url ? 'SUCCESS' : 'FAILED');
        
        return {
          service: serviceId,
          success: !!url,
          url: url,
          error: url ? null : 'Upload gagal - tidak ada URL yang dikembalikan'
        };
      } catch (error) {
        console.error(`Error uploading to ${serviceId}:`, error.message);
        return {
          service: serviceId,
          success: false,
          error: error.message
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    // Clean up temporary file
    try {
      await fs.unlink(files.file[0].filepath);
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError.message);
    }

    // Hitung hasil
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    console.log(`Upload selesai: ${successCount} sukses, ${failedCount} gagal`);

    return res.status(200).json({
      success: true,
      message: `Upload selesai: ${successCount} sukses, ${failedCount} gagal`,
      results: results
    });

  } catch (error) {
    console.error('Server error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};
