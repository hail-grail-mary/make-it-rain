// Environment Detection and Device Fingerprinting Module - Functional Version

// Basic platform detection
function detectPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    if (/android/.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';
    if (/windows/.test(platform)) return 'Windows';
    if (/mac/.test(platform)) return 'macOS';
    if (/linux/.test(platform)) return 'Linux';
    return 'Unknown';
}

// Mobile device detection
function detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768 ||
           'ontouchstart' in window;
}

// Architecture detection
function detectArchitecture() {
    const userAgent = navigator.userAgent;
    
    if (/WOW64|Win64|x64/.test(userAgent)) return 'x64';
    if (/ARM|arm/.test(userAgent)) return 'ARM';
    if (/x86/.test(userAgent)) return 'x86';
    
    // Check platform string
    if (/64/.test(navigator.platform)) return 'x64';
    if (/ARM|arm/.test(navigator.platform)) return 'ARM';
    
    return 'Unknown';
}

// Basic system information
async function getBasicInfo() {
    return {
        // Browser & Platform
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        
        // Screen & Display
        screenWidth: screen.width,
        screenHeight: screen.height,
        screenColorDepth: screen.colorDepth,
        screenPixelDepth: screen.pixelDepth,
        devicePixelRatio: window.devicePixelRatio,
        
        // Window
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        
        // Hardware
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        
        // Time & Location
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        
        // Architecture detection
        architecture: detectArchitecture(),
        
        // Platform classification
        detectedPlatform: detectPlatform(),
        isMobile: detectMobile(),
        
        timestamp: new Date().toISOString()
    };
}

// Detect mobile browser
function detectMobileBrowser() {
    const ua = navigator.userAgent;
    
    if (/Chrome/.test(ua) && /Mobile/.test(ua)) return 'Chrome Mobile';
    if (/Safari/.test(ua) && /Mobile/.test(ua)) return 'Safari Mobile';
    if (/Firefox/.test(ua) && /Mobile/.test(ua)) return 'Firefox Mobile';
    if (/Samsung/.test(ua)) return 'Samsung Browser';
    if (/Opera/.test(ua) && /Mobile/.test(ua)) return 'Opera Mobile';
    
    return 'Unknown Mobile Browser';
}

// Mobile canvas fingerprinting
function getMobileCanvasFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Mobile-optimized canvas fingerprinting
        canvas.width = 200;
        canvas.height = 50;
        
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Mobile Device 🔍', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Fingerprint Test', 4, 35);
        
        return canvas.toDataURL().slice(-50); // Last 50 chars for brevity
    } catch (e) {
        return 'Canvas not supported';
    }
}

// WebGL fingerprinting
function getWebGLFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 'WebGL not supported';
        
        return {
            vendor: gl.getParameter(gl.VENDOR),
            renderer: gl.getParameter(gl.RENDERER),
            version: gl.getParameter(gl.VERSION),
            shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
        };
    } catch (e) {
        return 'WebGL error';
    }
}

// Mobile-specific deep fingerprinting
async function getMobileFingerprint() {
    const isMobile = detectMobile();
    if (!isMobile) return null;

    const mobileInfo = {
        // Touch capabilities
        maxTouchPoints: navigator.maxTouchPoints,
        touchSupport: 'ontouchstart' in window,
        
        // Mobile-specific APIs
        vibration: 'vibrate' in navigator,
        gamepad: 'getGamepads' in navigator,
        
        // Orientation
        orientation: screen.orientation ? {
            angle: screen.orientation.angle,
            type: screen.orientation.type
        } : null,
        
        // Mobile browser detection
        browserEngine: detectMobileBrowser(),
        
        // Device motion/orientation support
        deviceMotion: 'DeviceMotionEvent' in window,
        deviceOrientation: 'DeviceOrientationEvent' in window,
    };

    // Try to get battery info (mobile-specific)
    try {
        if ('getBattery' in navigator) {
            const battery = await navigator.getBattery();
            mobileInfo.battery = {
                charging: battery.charging,
                level: battery.level,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime
            };
        }
    } catch (e) {
        mobileInfo.battery = 'Not available';
    }

    // Try to get network info (mobile-specific)
    if ('connection' in navigator) {
        mobileInfo.connection = {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
            saveData: navigator.connection.saveData
        };
    }

    // Mobile-specific canvas fingerprinting
    mobileInfo.canvasFingerprint = getMobileCanvasFingerprint();
    
    // WebGL fingerprinting
    mobileInfo.webglFingerprint = getWebGLFingerprint();

    return mobileInfo;
}

// Get geolocation (if permitted)
async function getGeolocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ error: 'Geolocation not supported' });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    heading: position.coords.heading,
                    speed: position.coords.speed
                });
            },
            (error) => {
                resolve({ error: error.message });
            },
            { timeout: 5000, enableHighAccuracy: false }
        );
    });
}

function generateSessionId() {
    return 'env_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Main collection function
async function collectEnvironmentData() {
    console.log('🔍 Starting environment detection...');
    
    try {
        // Basic info for all devices
        const basicInfo = await getBasicInfo();
        
        // Mobile-specific fingerprinting
        const mobileInfo = await getMobileFingerprint();
        
        // Geolocation
        const location = await getGeolocation();
        
        const result = {
            basic: basicInfo,
            mobile: mobileInfo,
            location: location,
            fingerprint: {
                sessionId: generateSessionId(),
                timestamp: new Date().toISOString(),
                platform: detectPlatform(),
                isMobile: detectMobile()
            }
        };

        console.log('✅ Environment detection complete:', result);
        return result;
    } catch (error) {
        console.error('❌ Environment detection error:', error);
        return { error: error.message, timestamp: new Date().toISOString() };
    }
}

// Execute and return results
collectEnvironmentData();
