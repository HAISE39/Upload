// Services data
const uploadServices = [
    {
        id: 'pomf2lain',
        name: 'Pomf2 Lain.la',
        description: 'Unlimited file size support with fast upload speeds',
        icon: '🚀',
        details: {
            'Max Size': 'UNLIMITED',
            'Speed': 'Very Fast',
            'Retention': 'Permanent',
            'Features': 'No Limits, Fast CDN'
        },
        badge: 'BEST'
    },
    {
        id: 'quax',
        name: 'Qu.ax',
        description: 'Reliable file hosting with unlimited storage',
        icon: '⚡',
        details: {
            'Max Size': 'UNLIMITED',
            'Speed': 'Fast',
            'Retention': 'Permanent',
            'Features': 'Direct Links, No Compression'
        },
        badge: 'UNLIMITED'
    },
    {
        id: 'catbox',
        name: 'Catbox.moe',
        description: 'Media-optimized hosting perfect for images and videos',
        icon: '🐱',
        details: {
            'Max Size': '200MB',
            'Speed': 'Fast',
            'Retention': 'Permanent',
            'Features': 'Media Focused, Fast Delivery'
        }
    },
    {
        id: 'tmpfiles',
        name: 'TmpFiles.org',
        description: 'Temporary file storage for quick sharing',
        icon: '⏰',
        details: {
            'Max Size': '100MB',
            'Speed': 'Medium',
            'Retention': '60 Minutes',
            'Features': 'Auto Cleanup, Quick Share'
        }
    }
];

// App state
let selectedFile = null;
let selectedServices = [];
let uploadHistory = [];

// DOM elements
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const totalUploads = document.getElementById('totalUploads');
const successRate = document.getElementById('successRate');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderServices();
    setupEventListeners();
    updateStats();
}

// Navigation
function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            switchSection(section);
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // File input
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const browseBtn = uploadArea.querySelector('.browse-btn');

    fileInput.addEventListener('change', handleFileSelect);
    browseBtn.addEventListener('click', () => fileInput.click());

    // Drag and drop
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

    // Upload button
    document.getElementById('uploadBtn').addEventListener('click', startUpload);
    
    // Change file button
    document.getElementById('changeFile').addEventListener('click', () => fileInput.click());
    
    // Clear selection
    document.getElementById('clearSelection').addEventListener('click', clearAllSelections);
}

function switchSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Show target section
    document.getElementById(section).classList.add('active');

    // Update page title
    const titles = {
        'upload': 'Upload Files',
        'services': 'Services',
        'results': 'Upload Results'
    };

    const subtitles = {
        'upload': 'Upload large files to multiple services',
        'services': 'Choose where to upload your files',
        'results': 'Recent upload activities and results'
    };

    pageTitle.textContent = titles[section];
    pageSubtitle.textContent = subtitles[section];
}

function renderServices() {
    const container = document.getElementById('servicesContainer');
    container.innerHTML = '';

    uploadServices.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.dataset.id = service.id;
        
        const badgeHtml = service.badge ? 
            `<span class="service-badge ${service.badge === 'BEST' ? 'badge-best' : 'badge-unlimited'}">${service.badge}</span>` : '';

        let detailsHtml = '';
        for (const [key, value] of Object.entries(service.details)) {
            detailsHtml += `
                <div class="service-detail">
                    <span>${key}:</span>
                    <span>${value}</span>
                </div>
            `;
        }

        serviceCard.innerHTML = `
            <div class="service-header">
                <div class="service-icon">${service.icon}</div>
                <div>
                    <div class="service-name">${service.name} ${badgeHtml}</div>
                    <div class="service-desc">${service.description}</div>
                </div>
            </div>
            <div class="service-details">
                ${detailsHtml}
            </div>
        `;

        serviceCard.addEventListener('click', () => {
            toggleServiceSelection(service.id, serviceCard);
        });

        container.appendChild(serviceCard);
    });
}

function handleFileSelect(e) {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
}

function handleFile(file) {
    selectedFile = file;
    
    const fileInfo = document.getElementById('fileInfo');
    const fileIcon = document.getElementById('fileIcon');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');

    // Set file icon based on type
    const fileType = file.type.split('/')[0];
    const icons = {
        'image': 'fas fa-file-image',
        'video': 'fas fa-file-video',
        'audio': 'fas fa-file-audio',
        'application': 'fas fa-file-pdf',
        'text': 'fas fa-file-alt'
    };
    
    fileIcon.className = icons[fileType] || 'fas fa-file';

    // Update file info
    fileName.textContent = file.name;
    fileSize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

    // Show file info
    fileInfo.style.display = 'block';

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
    const panel = document.getElementById('selectedServicesPanel');
    const tagsContainer = document.getElementById('servicesTags');

    if (selectedServices.length === 0) {
        panel.style.display = 'none';
        return;
    }

    tagsContainer.innerHTML = '';
    selectedServices.forEach(serviceId => {
        const service = uploadServices.find(s => s.id === serviceId);
        const tag = document.createElement('div');
        tag.className = 'service-tag';
        tag.innerHTML = `${service.icon} ${service.name}`;
        tagsContainer.appendChild(tag);
    });

    panel.style.display = 'block';
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
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.disabled = !(selectedFile && selectedServices.length > 0);
}

async function startUpload() {
    if (!selectedFile || selectedServices.length === 0) return;

    // Switch to results section
    switchSection('results');
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-section="results"]').classList.add('active');

    // Clear previous results
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    // Create result items
    selectedServices.forEach(serviceId => {
        const service = uploadServices.find(s => s.id === serviceId);
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.id = `result-${serviceId}`;
        resultItem.innerHTML = `
            <div class="result-service">
                <div class="result-service-icon">${service.icon}</div>
                <div class="result-details">
                    <div class="result-url" id="url-${serviceId}">Uploading ${selectedFile.name}...</div>
                    <div class="progress-bar">
                        <div class="progress" id="progress-${serviceId}"></div>
                    </div>
                </div>
            </div>
            <div class="result-status status-pending" id="status-${serviceId}">Uploading</div>
            <button class="copy-btn" id="copy-${serviceId}" disabled>Copy URL</button>
        `;
        resultsList.appendChild(resultItem);
    });

    // Hide no results message
    document.getElementById('noResults').style.display = 'none';

    // Start upload process
    await uploadToServices();
}

async function uploadToServices() {
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    try {
        const uploadPromises = selectedServices.map(async (serviceId) => {
            try {
                // Update progress
                document.getElementById(`progress-${serviceId}`).style.width = '30%';
                
                const url = await directUploadToService(serviceId, selectedFile);
                
                // Mark as successful
                document.getElementById(`progress-${serviceId}`).style.width = '100%';
                document.getElementById(`status-${serviceId}`).textContent = 'Success';
                document.getElementById(`status-${serviceId}`).className = 'result-status status-success';
                document.getElementById(`url-${serviceId}`).textContent = url;
                document.getElementById(`url-${serviceId}`).title = url;
                
                // Enable copy button
                const copyBtn = document.getElementById(`copy-${serviceId}`);
                copyBtn.disabled = false;
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(url).then(() => {
                        const originalText = copyBtn.textContent;
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyBtn.textContent = originalText;
                        }, 2000);
                    });
                });

                return { service: serviceId, success: true, url: url, error: null };
                
            } catch (error) {
                // Mark as failed
                document.getElementById(`progress-${serviceId}`).style.width = '100%';
                document.getElementById(`status-${serviceId}`).textContent = 'Failed';
                document.getElementById(`status-${serviceId}`).className = 'result-status status-failed';
                document.getElementById(`url-${serviceId}`).textContent = error.message;
                document.getElementById(`copy-${serviceId}`).style.display = 'none';
                
                return { service: serviceId, success: false, url: null, error: error.message };
            }
        });

        const results = await Promise.allSettled(uploadPromises);
        const finalResults = results.map(result => 
            result.status === 'fulfilled' ? result.value : {
                service: 'unknown', success: false, url: null, error: 'Unknown error'
            }
        );

        // Add to history and update stats
        uploadHistory.push({
            file: selectedFile.name,
            timestamp: new Date(),
            results: finalResults
        });

        updateResultsSummary(finalResults);
        updateStats();

    } catch (error) {
        console.error('Upload process error:', error);
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-rocket"></i> Start Upload to Selected Services';
    }
}

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
        
        if (!url) throw new Error('No URL received from service');
        
        return url;
        
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }
}

function updateResultsSummary(results) {
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;
    const totalCount = results.length;

    document.getElementById('successCount').textContent = successCount;
    document.getElementById('failedCount').textContent = failedCount;
    document.getElementById('totalCount').textContent = totalCount;
}

function updateStats() {
    const total = uploadHistory.reduce((sum, upload) => sum + upload.results.length, 0);
    const success = uploadHistory.reduce((sum, upload) => 
        sum + upload.results.filter(r => r.success).length, 0
    );
    
    totalUploads.textContent = total;
    successRate.textContent = total > 0 ? `${Math.round((success / total) * 100)}%` : '100%';
}
