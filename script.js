// Service yang support file BESAR
const uploadServices = [
    {
        id: 'pomf2lain',
        name: 'Pomf2 Lain.la',
        description: 'UNLIMITED - Support file sangat besar',
        icon: '🚀',
        details: {
            'Max Size': 'UNLIMITED',
            'Speed': 'Very Fast',
            'Retention': 'Permanent',
            'Features': 'No Limits'
        },
        badge: 'BEST'
    },
    {
        id: 'quax', 
        name: 'Qu.ax',
        description: 'UNLIMITED - Reliable large file hosting',
        icon: '⚡',
        details: {
            'Max Size': 'UNLIMITED',
            'Speed': 'Fast',
            'Retention': 'Permanent', 
            'Features': 'Large Files'
        }
    },
    {
        id: 'catbox',
        name: 'Catbox.moe',
        description: '200MB max - Optimized for media',
        icon: '🐱',
        details: {
            'Max Size': '200MB',
            'Speed': 'Fast',
            'Retention': 'Permanent',
            'Features': 'Media Focus'
        }
    },
    {
        id: 'tmpfiles',
        name: 'TmpFiles.org',
        description: '100MB max - Temporary storage',
        icon: '⏰',
        details: {
            'Max Size': '100MB',
            'Speed': 'Medium',
            'Retention': '60 Minutes',
            'Features': 'Auto Delete'
        },
        badge: 'Temp'
    }
];

let selectedFile = null;
let selectedServices = [];

// Navigation
document.querySelectorAll('.nav-links a').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-links a').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
            if (section.id === item.getAttribute('data-section')) {
                section.classList.add('active');
            }
        });
    });
});

// Typewriter effect
const texts = ["100MB+", "500MB+", "1GB+"];
let textIndex = 0;
let charIndex = 0;

function typeWriter() {
    if(charIndex < texts[textIndex].length){
        document.querySelector(".typewriter-text").innerHTML += texts[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    } else {
        setTimeout(eraseText, 1000);
    }
}

function eraseText() {
    const text = document.querySelector(".typewriter-text").innerHTML;
    if(text.length > 0){
        document.querySelector(".typewriter-text").innerHTML = text.slice(0,-1);
        setTimeout(eraseText, 50);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        charIndex = 0;
        setTimeout(typeWriter, 500);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    setupEventListeners();
    typeWriter();
});

function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.innerHTML = '';

    uploadServices.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.dataset.id = service.id;
        
        const badgeHtml = service.badge ? `<span class="badge badge-success">${service.badge}</span>` : '';
        
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
            <div class="service-details">${detailsHtml}</div>
        `;
        
        servicesGrid.appendChild(serviceCard);
    });
}

function setupEventListeners() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    fileInput.addEventListener('change', handleFileSelect);
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('.service-card')) {
            const serviceCard = e.target.closest('.service-card');
            const serviceId = serviceCard.dataset.id;
            toggleServiceSelection(serviceId, serviceCard);
        }
    });
    
    document.getElementById('uploadBtn').addEventListener('click', startUpload);
}

// TANPA BATASAN SIZE - Support file besar
function handleFile(file) {
    selectedFile = file;
    
    const fileInfo = document.getElementById('fileInfo');
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    fileInfo.innerHTML = `
        <strong>File:</strong> ${file.name}<br>
        <strong>Size:</strong> ${fileSize} MB<br>
        <strong>Type:</strong> ${file.type || 'Unknown'}<br>
        <span style="color: #00ff00;">✓ Ready for LARGE file upload</span>
        <button class="btn" style="margin-top: 10px; padding: 5px 15px;" id="changeFile">Change File</button>
    `;
    fileInfo.style.display = 'block';
    
    document.getElementById('changeFile').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('fileInput').click();
    });
    
    updateUploadButton();
}

function toggleServiceSelection(serviceId, serviceCard) {
    const index = selectedServices.indexOf(serviceId);
    
    if (index === -1) {
        selectedServices.push(serviceId);
        serviceCard.classList.add('selected');
    } else {
        selectedServices.splice(index, 1);
        serviceCard.classList.remove('selected');
    }
    
    updateSelectedServicesDisplay();
    updateUploadButton();
}

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
        <strong>Selected (${selectedServices.length}):</strong> ${selectedNames.join(', ')}
        <button class="btn" style="margin-left: 10px; padding: 5px 15px;" id="clearSelection">Clear All</button>
    `;
    selectedServicesEl.style.display = 'block';
    
    document.getElementById('clearSelection').addEventListener('click', clearAllSelections);
}

function clearAllSelections() {
    selectedServices = [];
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });
    updateSelectedServicesDisplay();
    updateUploadButton();
}

function updateUploadButton() {
    document.getElementById('uploadBtn').disabled = !(selectedFile && selectedServices.length > 0);
}

async function startUpload() {
    if (!selectedFile || selectedServices.length === 0) return;
    
    document.querySelector('[data-section="results"]').classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-section="results"]').classList.add('active');
    
    const uploadInfo = document.getElementById('uploadInfo');
    const fileSize = (selectedFile.size / 1024 / 1024).toFixed(2);
    uploadInfo.innerHTML = `
        <h3>📂 ${selectedFile.name}</h3>
        <p>📏 ${fileSize} MB | 🎯 ${selectedServices.length} services</p>
        <p><small>Direct Large File Upload...</small></p>
    `;
    
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    
    selectedServices.forEach(serviceId => {
        const service = uploadServices.find(s => s.id === serviceId);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-service">${service.name}</div>
            <div class="result-url" id="url-${serviceId}">Processing large file...</div>
            <div class="result-status status-pending" id="status-${serviceId}">Uploading</div>
            <button class="copy-btn" id="copy-${serviceId}" disabled>Copy</button>
            <div class="progress-bar">
                <div class="progress" id="progress-${serviceId}"></div>
            </div>
        `;
        
        resultsGrid.appendChild(resultItem);
    });
    
    await uploadToServer();
}

// DIRECT UPLOAD - File besar langsung ke service
async function directUploadToService(serviceId, file) {
    const serviceConfigs = {
        'pomf2lain': {
            url: 'https://pomf2.lain.la/upload.php',
            formKey: 'files[]',
            responseHandler: (data) => data.files?.[0]?.url
        },
        'quax': {
            url: 'https://qu.ax/upload.php',
            formKey: 'files[]', 
            responseHandler: (data) => data.files?.[0]?.url
        },
        'catbox': {
            url: 'https://catbox.moe/user/api.php',
            formKey: 'fileToUpload',
            extraData: { reqtype: 'fileupload' },
            responseHandler: (data) => data
        },
        'tmpfiles': {
            url: 'https://tmpfiles.org/api/v1/upload',
            formKey: 'file',
            responseHandler: (data) => {
                const idMatch = data.data?.url?.match(/\/(\d+)(?:\/|$)/);
                return idMatch ? `https://tmpfiles.org/dl/${idMatch[1]}/${file.name}` : null;
            }
        }
    };
    
    const config = serviceConfigs[serviceId];
    if (!config) throw new Error('Service not found');
    
    const formData = new FormData();
    formData.append(config.formKey, file);
    
    if (config.extraData) {
        Object.entries(config.extraData).forEach(([key, value]) => {
            formData.append(key, value);
        });
    }
    
    try {
        const response = await fetch(config.url, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        const url = config.responseHandler(result);
        
        if (!url) throw new Error('No URL received');
        
        return url;
        
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }
}

async function uploadToServer() {
    try {
        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading Large File...';
        
        const uploadPromises = selectedServices.map(async (serviceId) => {
            try {
                document.getElementById(`progress-${serviceId}`).style.width = '30%';
                
                const url = await directUploadToService(serviceId, selectedFile);
                
                document.getElementById(`progress-${serviceId}`).style.width = '100%';
                document.getElementById(`status-${serviceId}`).textContent = 'Success';
                document.getElementById(`status-${serviceId}`).className = 'result-status status-success';
                
                return { service: serviceId, success: true, url: url, error: null };
                
            } catch (error) {
                document.getElementById(`progress-${serviceId}`).style.width = '100%';
                document.getElementById(`status-${serviceId}`).textContent = 'Failed';
                document.getElementById(`status-${serviceId}`).className = 'result-status status-failed';
                
                return { service: serviceId, success: false, url: null, error: error.message };
            }
        });
        
        const results = await Promise.allSettled(uploadPromises);
        const finalResults = results.map(result => 
            result.status === 'fulfilled' ? result.value : {
                service: 'unknown', success: false, url: null, error: 'Unknown error'
            }
        );
        
        updateUploadResults(finalResults);
        
    } catch (error) {
        selectedServices.forEach(serviceId => {
            document.getElementById(`status-${serviceId}`).textContent = 'Failed';
            document.getElementById(`status-${serviceId}`).className = 'result-status status-failed';
            document.getElementById(`url-${serviceId}`).textContent = error.message;
        });
    } finally {
        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload File Besar';
    }
}

function updateUploadResults(results) {
    let successCount = 0;
    
    results.forEach(result => {
        const { service, success, url, error } = result;
        
        if (success && url) {
            document.getElementById(`url-${service}`).textContent = url;
            successCount++;
            
            document.getElementById(`copy-${service}`).disabled = false;
            document.getElementById(`copy-${service}`).addEventListener('click', function() {
                navigator.clipboard.writeText(url).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                });
            });
        } else {
            document.getElementById(`url-${service}`).textContent = error;
            document.getElementById(`copy-${service}`).style.display = 'none';
        }
    });
    
    document.getElementById('uploadInfo').innerHTML += `<p><strong>Result:</strong> ${successCount} success, ${results.length - successCount} failed</p>`;
}
