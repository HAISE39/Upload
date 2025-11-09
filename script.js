// Data layanan upload
const uploadServices = [
    {
        id: 'termai',
        name: 'Termai',
        description: 'Layanan upload cepat dengan API khusus',
        icon: 'T',
        details: {
            'Kecepatan': 'Tinggi',
            'Kapasitas': 'Tidak Diketahui',
            'Masa Aktif': 'Tidak Diketahui',
            'Fitur': 'API Khusus'
        },
        badge: 'Rekomendasi'
    },
    {
        id: 'quax',
        name: 'Qu.ax',
        description: 'Penyedia hosting file yang andal',
        icon: 'Q',
        details: {
            'Kecepatan': 'Sedang',
            'Kapasitas': 'Tidak Dibatasi',
            'Masa Aktif': 'Permanen',
            'Fitur': 'Direct Link'
        }
    },
    {
        id: 'catbox',
        name: 'Catbox.moe',
        description: 'Hosting file khusus untuk gambar dan media',
        icon: 'C',
        details: {
            'Kecepatan': 'Tinggi',
            'Kapasitas': '200MB',
            'Masa Aktif': 'Permanen',
            'Fitur': 'Optimized Media'
        }
    },
    {
        id: 'pomf2lain',
        name: 'Pomf2 Lain.la',
        description: 'Layanan upload open source yang andal',
        icon: 'O',
        details: {
            'Kecepatan': 'Tinggi',
            'Kapasitas': 'Tidak Dibatasi',
            'Masa Aktif': 'Permanen',
            'Fitur': 'Open Source'
        },
        badge: 'Open Source'
    },
    {
        id: 'ypnk',
        name: 'YPNK CDN',
        description: 'CDN Indonesia dengan kecepatan lokal',
        icon: 'Y',
        details: {
            'Kecepatan': 'Tinggi (Lokal)',
            'Kapasitas': 'Tidak Diketahui',
            'Masa Aktif': 'Tidak Diketahui',
            'Fitur': 'CDN Indonesia'
        }
    },
    {
        id: 'tmpfiles',
        name: 'TmpFiles.org',
        description: 'Penyimpanan sementara untuk file',
        icon: 'T',
        details: {
            'Kecepatan': 'Sedang',
            'Kapasitas': '100MB',
            'Masa Aktif': '60 Menit',
            'Fitur': 'Auto Delete'
        },
        badge: 'Sementara'
    },
    {
        id: 'puticu',
        name: 'Put.icu',
        description: 'Layanan upload dengan metode PUT',
        icon: 'P',
        details: {
            'Kecepatan': 'Sedang',
            'Kapasitas': 'Tidak Diketahui',
            'Masa Aktif': '1 Hari',
            'Fitur': 'PUT Method'
        },
        badge: 'Sementara'
    }
];

// State aplikasi
let selectedFile = null;
let selectedServices = [];

// DOM Elements
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const contentSections = document.querySelectorAll('.content-section');

// Toggle mobile menu
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.menu-btn')) {
        navLinks.classList.remove('active');
    }
});

// Handle navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show corresponding section
        const sectionId = item.getAttribute('data-section');
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });

        // Close mobile menu after click
        navLinks.classList.remove('active');
    });
});

// Typewriter effect
const texts = [
    "MULTIPLE SERVICES",
    "FAST UPLOAD", 
    "SECURE HOSTING"
];

let speed = 100;
const textElements = document.querySelector(".typewriter-text");
let textIndex = 0;
let charcterIndex = 0;

function typeWriter() {
    if(charcterIndex < texts[textIndex].length){
        textElements.innerHTML += texts[textIndex].charAt(charcterIndex);
        charcterIndex++;
        setTimeout(typeWriter, speed); 
    }
    else{
        setTimeout(eraseText, 1000)
    }
}

function eraseText() {
    if(textElements.innerHTML.length > 0){
        textElements.innerHTML = textElements.innerHTML.slice(0,-1)
        setTimeout(eraseText, 50)
    }
    else{
        textIndex = (textIndex + 1) % texts.length;
        charcterIndex = 0;
        setTimeout(typeWriter,500)
    }
}

window.onload = typeWriter;

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    setupEventListeners();
});

// Render daftar layanan
function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.innerHTML = '';

    uploadServices.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.dataset.id = service.id;
        
        let badgeHtml = '';
        if (service.badge) {
            let badgeClass = 'badge-info';
            if (service.badge === 'Rekomendasi') badgeClass = 'badge-success';
            if (service.badge === 'Sementara') badgeClass = 'badge-warning';
            
            badgeHtml = `<span class="badge ${badgeClass}">${service.badge}</span>`;
        }
        
        let detailsHtml = '';
        for (const [key, value] of Object.entries(service.details)) {
            detailsHtml += `<div><span>${key}:</span> <strong>${value}</strong></div>`;
        }
        
        serviceCard.innerHTML = `
            <div class="service-header">
                <div class="service-icon">${service.icon}</div>
                <div class="service-name">${service.name} ${badgeHtml}</div>
            </div>
            <div class="service-desc">${service.description}</div>
            <div class="service-details">
                ${detailsHtml}
            </div>
        `;
        
        servicesGrid.appendChild(serviceCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // File input
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    // Klik pada area upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Pilih layanan
    document.addEventListener('click', function(e) {
        if (e.target.closest('.service-card')) {
            const serviceCard = e.target.closest('.service-card');
            const serviceId = serviceCard.dataset.id;
            toggleServiceSelection(serviceId, serviceCard);
        }
    });
    
    // Tombol upload
    document.getElementById('uploadBtn').addEventListener('click', startUpload);
}

// Handle pemilihan file
function handleFileSelect(e) {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
}

function handleFile(file) {
    // Validasi ukuran file (max 200MB)
    const maxSize = 200 * 1024 * 1024; // 200MB in bytes
    if (file.size > maxSize) {
        alert('File terlalu besar! Maksimal ukuran file adalah 200MB.');
        return;
    }

    selectedFile = file;
    
    // Tampilkan info file
    const fileInfo = document.getElementById('fileInfo');
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    fileInfo.innerHTML = `
        <strong>File Terpilih:</strong> ${file.name}<br>
        <strong>Ukuran:</strong> ${fileSize} MB<br>
        <strong>Tipe:</strong> ${file.type || 'Tidak diketahui'}
        <button class="btn" style="margin-top: 10px; padding: 5px 15px;" id="changeFile">Ubah File</button>
    `;
    fileInfo.style.display = 'block';
    
    // Event listener untuk tombol ubah file
    document.getElementById('changeFile').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('fileInput').click();
    });
    
    // Aktifkan tombol upload jika ada layanan terpilih
    updateUploadButton();
}
// Toggle pemilihan layanan
function toggleServiceSelection(serviceId, serviceCard) {
    const index = selectedServices.indexOf(serviceId);
    
    if (index === -1) {
        // Tambahkan ke selected
        selectedServices.push(serviceId);
        serviceCard.classList.add('selected');
    } else {
        // Hapus dari selected
        selectedServices.splice(index, 1);
        serviceCard.classList.remove('selected');
    }
    
    // Update tampilan layanan terpilih
    updateSelectedServicesDisplay();
    
    // Update status tombol upload
    updateUploadButton();
}

// Update tampilan layanan terpilih
function updateSelectedServicesDisplay() {
    const selectedServicesEl = document.getElementById('selectedServices');
    
    if (selectedServices.length === 0) {
        selectedServicesEl.style.display = 'none';
        return;
    }
    
    const selectedNames = selectedServices.map(id => {
        const service = uploadServices.find(s => s.id === id);
        return service.name;
    });
    
    selectedServicesEl.innerHTML = `
        <strong>Layanan Terpilih (${selectedServices.length}):</strong> ${selectedNames.join(', ')}
        <button class="btn" style="margin-left: 10px; padding: 5px 15px;" id="clearSelection">Hapus Semua</button>
    `;
    selectedServicesEl.style.display = 'block';
    
    // Event listener untuk tombol hapus semua
    document.getElementById('clearSelection').addEventListener('click', clearAllSelections);
}

// Hapus semua pilihan layanan
function clearAllSelections() {
    selectedServices = [];
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });
    updateSelectedServicesDisplay();
    updateUploadButton();
}

// Update status tombol upload
function updateUploadButton() {
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.disabled = !(selectedFile && selectedServices.length > 0);
}

// Mulai proses upload
async function startUpload() {
    if (!selectedFile || selectedServices.length === 0) return;
    
    // Navigate ke results section
    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-section="results"]').classList.add('active');
    
    contentSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === 'results') {
            section.classList.add('active');
        }
    });
    
    // Tampilkan info file
    const uploadInfo = document.getElementById('uploadInfo');
    const fileSize = (selectedFile.size / 1024).toFixed(2);
    uploadInfo.innerHTML = `
        <h3>📂 File: ${selectedFile.name}</h3>
        <p>📏 Size: ${fileSize} KB | 🎯 Services: ${selectedServices.length}</p>
        <p><small>Uploading via Vercel Serverless Function...</small></p>
    `;
    
    // Kosongkan container hasil
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    
    // Buat elemen hasil untuk setiap layanan
    selectedServices.forEach(serviceId => {
        const service = uploadServices.find(s => s.id === serviceId);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-service">${service.name}</div>
            <div class="result-url" id="url-${serviceId}">Memproses...</div>
            <div class="result-status status-pending" id="status-${serviceId}">Uploading</div>
            <button class="copy-btn" id="copy-${serviceId}" disabled>Salin</button>
            <div class="progress-bar">
                <div class="progress" id="progress-${serviceId}"></div>
            </div>
        `;
        
        resultsGrid.appendChild(resultItem);
    });
    
    // Mulai proses upload ke server
    await uploadToServer();
}

// Upload file ke server
async function uploadToServer() {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('services', JSON.stringify(selectedServices));
    
    try {
        // Update progress bars untuk simulasi
        selectedServices.forEach((serviceId, index) => {
            setTimeout(() => {
                const progressBar = document.getElementById(`progress-${serviceId}`);
                progressBar.style.width = '30%';
            }, index * 200);
        });

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // Update UI dengan hasil upload
            updateUploadResults(result.results);
        } else {
            throw new Error(result.message || 'Upload gagal');
        }
    } catch (error) {
        console.error('Upload error:', error);
        // Tampilkan error untuk semua service
        selectedServices.forEach(serviceId => {
            const statusEl = document.getElementById(`status-${serviceId}`);
            const urlEl = document.getElementById(`url-${serviceId}`);
            const progressBar = document.getElementById(`progress-${serviceId}`);
            
            statusEl.textContent = 'Failed';
            statusEl.className = 'result-status status-failed';
            urlEl.textContent = 'Upload gagal: ' + error.message;
            progressBar.style.width = '100%';
        });
    }
}

// Update hasil upload di UI
function updateUploadResults(results) {
    let successCount = 0;
    
    results.forEach(result => {
        const { service, success, url, error } = result;
        const statusEl = document.getElementById(`status-${service}`);
        const urlEl = document.getElementById(`url-${service}`);
        const copyBtn = document.getElementById(`copy-${service}`);
        const progressBar = document.getElementById(`progress-${service}`);
        
        progressBar.style.width = '100%';
        
        if (success && url) {
            statusEl.textContent = 'Success';
            statusEl.className = 'result-status status-success';
            urlEl.textContent = url;
            urlEl.title = url;
            successCount++;
            
            copyBtn.disabled = false;
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(url).then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Tersalin!';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 2000);
                });
            });
        } else {
            statusEl.textContent = 'Failed';
            statusEl.className = 'result-status status-failed';
            urlEl.textContent = error || 'Upload gagal';
            copyBtn.style.display = 'none';
        }
    });
    
    // Update info
    const uploadInfo = document.getElementById('uploadInfo');
    uploadInfo.innerHTML += `<p><strong>Hasil:</strong> ${successCount} sukses, ${results.length - successCount} gagal</p>`;
}
