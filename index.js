import { exec } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Environment variables (Bun loads .env automatically)
const FILE_PATH = process.env.FILE_PATH || './tmp';   // Running directory
const UID = process.env.UID || '75de94bb-b5cb-4ad4-b72b-251476b36f3a'; // User ID
const S_PATH = process.env.S_PATH || UID;       // Subscription path
const PORT = process.env.SERVER_PORT || process.env.PORT || 3005;        // HTTP port
const A_DOMAIN = process.env.A_DOMAIN || '';          // Fixed domain
const A_AUTH = process.env.A_AUTH || '';              // Fixed token
const A_PORT = process.env.A_PORT || 8001;            // Fixed connection port
const CIP = process.env.CIP || 'cf.877774.xyz';         // Preferred IP/Domain
const CPORT = process.env.CPORT || 443;                   // Preferred Port
const NAME = process.env.NAME || 'Vls';                     // Node Name
const MLKEM_S = process.env.MLKEM_S || 'mlkem768x25519plus.native.600s.ugygldXvD2pi5St4XBlF4Cgd-55qGCdaOrcJsxdIR5aHGFeYh-Dm1BDsSluXrHUmscV5n9_hPJ8zPfBP4HEgaA';
const MLKEM_C = process.env.MLKEM_C || 'mlkem768x25519plus.native.0rtt.h7xFrUkiWbhXfCNmehc209OOlXhUaPM-2bgKIQyRRLt7WXmEJFsY64QT8se8HcGNLNkKPlTGS1W5XIgRZfFVuNqATbcyuNa7O9BveTB5GaESadgUsWMCs-ugCyTG3WNonYlL0otGzxMEhnohNnkTnoCchQgVULxZAGZW8oYbaNcS-UUZJGhoSvBbz4gZj8RVqDQhd1ReD1E4IMFd2tANlCANZcyZJKykjPdCrqRxiDsxSHGwB6kB4UikaOEAzCSgXNZcJleylvJVkkg54sh4pnGfC0pXp2GjiZFe_cIFRGJJr4mlaCSHphsvecYzctZQiYw3p4xxxRsCtgpUQ2KWReg6YmZCBDy-ckYg8pNp5LtcZBRWE9nDZKVnbpOqL0s442XLqniTLuI1exkbjMJEz-vLIZSNXDA6DieyFyKOUPtFbjcutoq9QGxICAgmvpGn0Qw_JBVoBsJZqwG43wiBcedwBJotJ_SV7klDZEiF-Nud3OaNcmnJWDcEf3O2BiNknpcKbHmrstg8Y0y5kjtfMrau9NDNoiVidNtKtYwQXHA8ndVo15YutaGKs-N9YCavxYUX62fAunulLJAuc6KsDXs_rDlhrFMfxhumq6kNpZxC0vJsvVSQRcVmd-pi8gseXAUOY_zD2paGv2JEQilTtqlrh9cCn-GCP_cYErud-QSsRyCIz5dpGZdEggrPumAlQ4C5j4JniKYaELScBWQWK6E1Y1SPhQFsLgxJFSC9w0pNmIyfleSEEXcd9uOPdVvF0QpJ04dHHKO4r6ekTkkM4XZc7lp1pTwvB8B-tqmjl9Fu4kcgZ0PCQDqGLeq9U3kJUhBsxLhCH8zNzjtaeGooPZAdw_eCJ8dsQmXByaiAs4ofocko4HEfiWh1urqO5dxJMuS3f7WPs6BWthW5vXCuA3mJ_Go87GUY0XEilpE3OJvNNLiBoidadIFnOFI_fqfGGNhxseEGjdF1cLlEtpdLQjWxxcB1BNudQAdWc6tO1StI0KVQwQeFOYS7v3LK2usU1qQmH6UIbmiN5TtmVxodk8FM3xE6fvZZXON1POM_08KPU8QcoYATmUu_sRaWGrlFmTY59zZNoASc7zPHxJm66ZYOiVFcsSh-pmenuzCCa9UcvUSR-OxLNvi9XoZrWOy6n8iP26gnUmcygTQB0phUajxa6fa_85JF6adgD8ylDXiuGpbOchwokbwGbTUMGwmsBSnKDWKqRffDUPq-pZxQOXuwlblsEWUU87DJFHwI2eVKj9sjYVBzm7onKZpt9yRwCEUajIIggzwDRDQwlPil5MS1vWFd4TsIO4oLtbKrR3YK3Xp-kIeZBUMJBliBJfld0vDJNFMnWKXAE_gPySFO9blD8lGgsHKSSYCgF1VUx6B0nsS1nIPMIFvKB6CwKbeHh0gpR9YepBFm99ZAkRRH2Gu0Xtd59fWoOHRFDYVTWtWTA8gY0oxzE4gcFyePjxw0-7Ax2-gg_fnJZia1fwEAZmZnIAg28OAlRutOPVfLFDBIplSb2NCnsfh6tDcruSt6bZhPlwwDS8pggEKdudxNBkNPYeICnErthTVl5qYB_gQ';
const M_AUTH = process.env.M_AUTH || 'ML-KEM-768, Post-Quantum';

// Create running directory
if (!fs.existsSync(FILE_PATH)) {
    fs.mkdirSync(FILE_PATH);
    console.log(`${FILE_PATH} is created`);
} else {
    console.log(`${FILE_PATH} already exists`);
}

const subPath = path.join(FILE_PATH, 'sub.txt');
const bootLogPath = path.join(FILE_PATH, 'boot.log');
const configPath = path.join(FILE_PATH, 'config.json');

// Helper to delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Clean up historical files
function cleanupOldFiles() {
    const pathsToDelete = ['sub.txt', 'boot.log'];
    pathsToDelete.forEach(file => {
        const filePath = path.join(FILE_PATH, file);
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, () => { });
        }
    });
}

let subContent = '';

// Generate front config file
const config = {
    log: { access: '/dev/null', error: '/dev/null', loglevel: 'none' },
    inbounds: [
        { port: parseInt(A_PORT), protocol: 'vless', settings: { clients: [{ id: UID, flow: 'xtls-rprx-vision' }], decryption: 'none', fallbacks: [{ dest: 3001 }, { path: "/vla", dest: 3002 }] }, streamSettings: { network: 'tcp' } },
        { port: 3001, listen: "127.0.0.1", protocol: 'vless', settings: { clients: [{ id: UID }], decryption: "none" }, streamSettings: { network: "tcp", security: "none" } },
        { port: 3002, listen: "127.0.0.1", protocol: 'vless', settings: { clients: [{ id: UID }], decryption: MLKEM_S, selectedAuth: M_AUTH }, streamSettings: { network: "ws", security: "none", wsSettings: { path: "/vla" } }, sniffing: { enabled: true, destOverride: ["http", "tls", "quic"], metadataOnly: false } }
    ],
    dns: { servers: ["https+local://8.8.8.8/dns-query"] },
    outbounds: [{ protocol: "freedom", tag: "direct" }, { protocol: "blackhole", tag: "block" }]
};

// Use Bun.write for simpler file writing
await Bun.write(path.join(FILE_PATH, 'config.json'), JSON.stringify(config, null, 2));

// Determine system architecture
function getSystemArchitecture() {
    const arch = os.arch();
    if (arch === 'arm' || arch === 'arm64' || arch === 'aarch64') {
        return 'arm';
    } else {
        return 'amd';
    }
}

// Download file using native fetch
async function downloadFile(fileName, fileUrl) {
    const filePath = path.join(FILE_PATH, fileName);

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to download ${fileName}: ${response.statusText}`);
        }

        const expectedSize = response.headers.get('content-length');
        const buffer = await response.arrayBuffer();

        // Write file
        await Bun.write(filePath, buffer);

        // Verify size if Content-Length provided
        if (expectedSize) {
            const actualSize = buffer.byteLength;
            if (parseInt(expectedSize) !== actualSize) {
                const errMsg = `File ${fileName} integrity check failed: expected ${expectedSize} bytes, got ${actualSize} bytes`;
                console.error(errMsg);
                fs.unlink(filePath, () => { });
                throw new Error(errMsg);
            }
        }

        console.log(`Download ${fileName} successfully`);
        return fileName;

    } catch (err) {
        if (fs.existsSync(filePath)) fs.unlink(filePath, () => { });
        console.error(`Download ${fileName} failed: ${err.message}`);
        throw err;
    }
}

// Download and run dependencies
async function downloadFilesAndRun() {
    const architecture = getSystemArchitecture();
    const allFiles = getFilesForArchitecture(architecture);

    if (allFiles.length === 0) {
        console.log(`Can't find a file for the current architecture`);
        return;
    }

    // Filter out existing files
    const filesToDownload = allFiles.filter(fileInfo => {
        const filePath = path.join(FILE_PATH, fileInfo.fileName);
        const exists = fs.existsSync(filePath);
        if (exists) {
            console.log(`${fileInfo.fileName} already exists, skipping download`);
        }
        return !exists;
    });

    if (filesToDownload.length === 0) {
        console.log('All required files already exist, skipping download');
    }

    try {
        await Promise.all(filesToDownload.map(f => downloadFile(f.fileName, f.fileUrl)));
    } catch (err) {
        console.error('Error downloading files:', err);
        return; // Stop if download fails
    }

    // Authorize files
    const filesToAuthorize = ['./front', './backend'];
    filesToAuthorize.forEach(relativeFilePath => {
        const absoluteFilePath = path.join(FILE_PATH, relativeFilePath);
        if (fs.existsSync(absoluteFilePath)) {
            try {
                fs.chmodSync(absoluteFilePath, 0o755);
                console.log(`Empowerment success for ${absoluteFilePath}: 755`);
            } catch (err) {
                console.error(`Empowerment failed for ${absoluteFilePath}: ${err}`);
            }
        }
    });

    // Run front
    // Note: Using exec to preserve nohup behavior
    const command1 = `nohup ${FILE_PATH}/front -c ${FILE_PATH}/config.json >/dev/null 2>&1 &`;
    try {
        await execAsync(command1);
        console.log('front is running');
        await delay(1000);
    } catch (error) {
        console.error(`front running error: ${error}`);
    }

    // Run backend
    if (fs.existsSync(path.join(FILE_PATH, 'backend'))) {
        let args;

        if (A_AUTH.match(/^[A-Z0-9a-z=]{120,250}$/)) {
            args = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ${A_AUTH}`;
        } else {
            args = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${FILE_PATH}/boot.log --loglevel info --url http://localhost:${A_PORT}`;
        }

        try {
            await execAsync(`nohup ${FILE_PATH}/backend ${args} >/dev/null 2>&1 &`);
            console.log('backend is running');
            await delay(2000);
        } catch (error) {
            console.error(`Error executing command: ${error}`);
        }
    }
    await delay(5000);
}

// Get URLs based on architecture
function getFilesForArchitecture(architecture) {
    let baseFiles;
    if (architecture === 'arm') {
        baseFiles = [
            { fileName: "front", fileUrl: "https://arm.dogchild.eu.org/front" },
            { fileName: "backend", fileUrl: "https://arm.dogchild.eu.org/backend" }
        ];
    } else {
        baseFiles = [
            { fileName: "front", fileUrl: "https://amd.dogchild.eu.org/front" },
            { fileName: "backend", fileUrl: "https://amd.dogchild.eu.org/backend" }
        ];
    }

    return baseFiles;
}

// Connection Type Logic
function connectType() {
    if (!A_AUTH || !A_DOMAIN) {
        console.log("A_DOMAIN or A_AUTH variable is empty, use quick connections");
        return;
    }

    if (A_AUTH.match(/^[A-Z0-9a-z=]{120,250}$/)) {
        console.log("A_AUTH is a token, connect to service");
    } else {
        console.log("A_AUTH is not a token, will use quick connections");
    }
}

// Extract Domains Logic
async function extractDomains() {
    let aDomain;

    if (A_AUTH && A_DOMAIN) {
        aDomain = A_DOMAIN;
        console.log('A_DOMAIN:', aDomain);
        await generateLinks(aDomain);
    } else {
        try {
            // Read boot.log
            let fileContent = '';
            try {
                fileContent = fs.readFileSync(path.join(FILE_PATH, 'boot.log'), 'utf-8');
            } catch (e) {
                console.error('Could not read boot.log yet');
            }

            const lines = fileContent.split('\n');
            const aDomains = [];
            lines.forEach((line) => {
                const d = 'trycloudflare.com';
                const domainMatch = line.match(new RegExp(`https?:\/\/([^ ]*${d.replace(/\./g, '\\.')})\/?`));
                if (domainMatch) {
                    const domain = domainMatch[1];
                    aDomains.push(domain);
                }
            });

            if (aDomains.length > 0) {
                aDomain = aDomains[0];
                console.log('ADomain:', aDomain);
                await generateLinks(aDomain);
            } else {
                console.log('ADomain not found, re-running backend to obtain ADomain');

                // Delete boot.log
                try {
                    if (fs.existsSync(path.join(FILE_PATH, 'boot.log'))) {
                        fs.unlinkSync(path.join(FILE_PATH, 'boot.log'));
                    }
                } catch (e) { }

                // Kill backend
                try {
                    await execAsync('pkill -f "[b]ackend" > /dev/null 2>&1');
                } catch (error) { }

                await delay(3000);

                // Restart backend
                const args = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${FILE_PATH}/boot.log --loglevel info --url http://localhost:${A_PORT}`;
                try {
                    // Note: using path.join for backend executable path
                    await execAsync(`nohup ${path.join(FILE_PATH, 'backend')} ${args} >/dev/null 2>&1 &`);
                    console.log('backend is running.');
                    await delay(3000);
                    await extractDomains(); // Retry
                } catch (error) {
                    console.error(`Error executing command: ${error}`);
                }
            }
        } catch (error) {
            console.error('Error reading boot.log:', error);
        }
    }

    // Generate sub info
    async function generateLinks(aDomain) {
        let ISP = '';
        try {
            const url = 'https://ipapi.co/json/';
            const response = await fetch(url);
            const data = await response.json();

            ISP = `${data.country_code}-${data.org}`.replace(/\s/g, '_');
        } catch (error) {
            console.error('Error fetching meta data:', error);
            ISP = 'Unknown-ISP';
        }

        return new Promise((resolve) => {
            setTimeout(async () => {
                const subTxt = `
vless://${UID}@${CIP}:${CPORT}?encryption=${MLKEM_C}&security=tls&sni=${aDomain}&fp=chrome&type=ws&host=${aDomain}&path=%2Fvla%3Fed%3D2560#${NAME}-${ISP}
    `;
                subContent = Buffer.from(subTxt).toString('base64');
                console.log(subContent);

                // Use Bun.write
                await Bun.write(subPath, subContent);

                console.log(`${FILE_PATH}/sub.txt saved successfully`);
                resolve(subTxt);
            }, 2000);
        });
    }
}

// Start sequence
connectType();
cleanupOldFiles();
await downloadFilesAndRun();
await extractDomains();


// Start Bun Server
Bun.serve({
    port: PORT,
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/") {
            return new Response("Hello world!");
        }
        if (url.pathname === `/${S_PATH}`) {
            return new Response(subContent, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                }
            });
        }
        return new Response("Not Found", { status: 404 });
    },
});

console.log(`http server is running on port:${PORT}!`);
