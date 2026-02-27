// ══════════════════════════════════════════
// METHODOLOGY
// ══════════════════════════════════════════

// Store original commands for reset
let originalCommands = {};
let methodologyInitialized = false;

function initMethodology() {
    if (methodologyInitialized) return;
    // Store original command texts
    document.querySelectorAll('.method-cmd').forEach(cmd => {
        if (cmd.id) {
            originalCommands[cmd.id] = cmd.textContent;
        }
    });
    methodologyInitialized = true;
}

// Auto-update methodology when target input changes
function setupMethodologyAutoUpdate() {
    const targetInput = document.getElementById('target');
    if (targetInput) {
        // Remove existing listeners to prevent duplicates
        targetInput.removeEventListener('input', handleTargetChange);
        targetInput.removeEventListener('blur', handleTargetChange);

        targetInput.addEventListener('input', handleTargetChange);
        targetInput.addEventListener('blur', handleTargetChange);
    }
}

function handleTargetChange() {
    initMethodology();
    updateMethodologyCommands();
    updateExploitTarget();
}

function updateMethodologyCommands() {
    initMethodology();
    const target = getTarget();
    const displayTarget = target || 'TARGET';

    // Update methodology target display
    const methodTarget = document.getElementById('method-target');
    if (methodTarget) {
        methodTarget.textContent = target ? target : 'Not set';
    }

    // Update all methodology commands with the target
    document.querySelectorAll('.method-cmd:not(.exploit-cmd)').forEach(cmd => {
        if (cmd.id && originalCommands[cmd.id]) {
            const newText = originalCommands[cmd.id].replace(/TARGET/g, displayTarget);
            cmd.textContent = newText;
        }
    });
}

function updateExploitTarget() {
    const target = getTarget();
    const exploitTarget = document.getElementById('exploit-target');
    if (exploitTarget) {
        exploitTarget.textContent = target ? target : 'Not set';
    }

    // Update exploit CLI commands
    const exploitCmds = {
        'cmd-exp-nuclei': `nuclei -u https://${target || 'EXPLOITTARGET'} -t ~/nuclei-templates/cves/ -severity critical,high`,
        'cmd-exp-nmap': `nmap --script vuln ${target || 'EXPLOITTARGET'} -oN vuln-scan.txt`
    };

    Object.entries(exploitCmds).forEach(([id, cmd]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = cmd;
    });
}

// Initialize on page load
window.addEventListener('load', function () {
    setTimeout(() => {
        initMethodology();
        setupMethodologyAutoUpdate();
        updateMethodologyCommands();
        updateExploitTarget();
    }, 200);
});

function toggleMethodStep(header) {
    const step = header.parentElement;
    step.classList.toggle('collapsed');
}

function updateMethodologyTarget() {
    const target = getTarget() || 'TARGET';
    document.getElementById('method-target').textContent = target === 'TARGET' ? 'Not set' : target;
    updateMethodologyCommands();
}

// Exploit Search Functions
function searchExploits() {
    const searchTerm = document.getElementById('exploit-search-term').value.trim();
    if (!searchTerm) {
        toast('⚠ Please enter a service/version to search', 'error');
        return;
    }

    // Update searchsploit command with search term
    const searchsploitCmd = document.getElementById('cmd-searchsploit');
    if (searchsploitCmd) {
        searchsploitCmd.textContent = `searchsploit "${searchTerm}" --json > exploits.json`;
    }

    // Update metasploit command
    const msfCmd = document.getElementById('cmd-msf');
    if (msfCmd) {
        msfCmd.textContent = `msfconsole -q -x "search type:exploit ${searchTerm}; exit"`;
    }

    toast('✅ Commands updated with: ' + searchTerm, 'success');

    // Open all exploit databases in new tabs
    const urls = getExploitUrls(searchTerm);

    // Ask if user wants to open all
    if (confirm(`Open all ${Object.keys(urls).length} exploit databases for "${searchTerm}"?`)) {
        Object.values(urls).forEach((url, index) => {
            setTimeout(() => window.open(url, '_blank'), index * 300);
        });
    }
}

function getExploitUrls(searchTerm) {
    const encoded = encodeURIComponent(searchTerm);
    return {
        'github-poc': `https://github.com/search?q=${encoded}+poc&type=repositories`,
        'github-exploit': `https://github.com/search?q=${encoded}+exploit&type=repositories`,
        'exploitdb': `https://www.exploit-db.com/search?q=${encoded}`,
        'nvd': `https://nvd.nist.gov/vuln/search/results?query=${encoded}`,
        'packetstorm': `https://packetstormsecurity.com/search/?q=${encoded}`,
        'vulners': `https://vulners.com/search?query=${encoded}`,
        'cvedetails': `https://www.cvedetails.com/google-search-results.php?q=${encoded}`,
        'rapid7': `https://www.rapid7.com/db/?q=${encoded}`,
        'nuclei-templates': `https://github.com/search?q=repo%3Aprojectdiscovery%2Fnuclei-templates+${encoded}&type=code`,
        'snyk': `https://security.snyk.io/search?q=${encoded}`
    };
}

function openExploitSearch(dbType, event) {
    event.preventDefault();
    const searchTerm = document.getElementById('exploit-search-term').value.trim();

    if (!searchTerm) {
        toast('⚠ Please enter a service/version first', 'error');
        document.getElementById('exploit-search-term').focus();
        return;
    }

    const urls = getExploitUrls(searchTerm);
    const url = urls[dbType];

    if (url) {
        window.open(url, '_blank');
        toast('🔍 Searching ' + dbType + '...', 'success');
    }
}

// ══════════════════════════════════════════
// EXPLOITS TAB
// ══════════════════════════════════════════

function setExploitSearch(term) {
    const input = document.getElementById('exploit-service-input');
    if (input) {
        input.value = term;
        input.focus();
    }
}

function getAllExploitUrls(searchTerm) {
    const encoded = encodeURIComponent(searchTerm);
    return {
        // GitHub & Code Repos
        'github-poc': `https://github.com/search?q=${encoded}+poc&type=repositories`,
        'github-exploit': `https://github.com/search?q=${encoded}+exploit&type=repositories`,
        'github-cve': `https://github.com/search?q=${encoded}+CVE&type=repositories`,
        'gitlab': `https://gitlab.com/search?search=${encoded}+exploit`,
        'github-nuclei': `https://github.com/search?q=repo%3Aprojectdiscovery%2Fnuclei-templates+${encoded}&type=code`,
        'github-0day': `https://github.com/search?q=${encoded}+0day&type=repositories`,

        // Exploit Databases
        'exploitdb': `https://www.exploit-db.com/search?q=${encoded}`,
        'packetstorm': `https://packetstormsecurity.com/search/?q=${encoded}`,
        'rapid7': `https://www.rapid7.com/db/?q=${encoded}`,
        '0day-today': `https://0day.today/search?search_request=${encoded}`,
        'sploitus': `https://sploitus.com/?query=${encoded}`,
        'vulncode': `https://www.vulncode-db.com/search?q=${encoded}`,

        // CVE & Vulnerability DBs
        'nvd': `https://nvd.nist.gov/vuln/search/results?query=${encoded}`,
        'cvedetails': `https://www.cvedetails.com/google-search-results.php?q=${encoded}`,
        'vulners': `https://vulners.com/search?query=${encoded}`,
        'snyk': `https://security.snyk.io/search?q=${encoded}`,
        'cisa': `https://www.cisa.gov/search?g=${encoded}`,
        'mitre': `https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=${encoded}`,

        // Vendor Advisories
        'microsoft': `https://msrc.microsoft.com/update-guide/vulnerability?search=${encoded}`,
        'oracle': `https://www.oracle.com/security-alerts/?search=${encoded}`,
        'cisco': `https://sec.cloudapps.cisco.com/security/center/search.x?search=${encoded}`,
        'redhat': `https://access.redhat.com/security/security-updates/?q=${encoded}`,
        'ubuntu': `https://ubuntu.com/security/cves?q=${encoded}`,
        'debian': `https://security-tracker.debian.org/tracker/?query=${encoded}`,

        // Security Research
        'google-security': `https://www.google.com/search?q=site:googleprojectzero.blogspot.com+${encoded}`,
        'hackerone': `https://hackerone.com/hacktivity?search=${encoded}`,
        'portswigger': `https://portswigger.net/search?q=${encoded}`,
        'tenable': `https://www.tenable.com/plugins/search?q=${encoded}`,
        'qualys': `https://www.qualys.com/search/?q=${encoded}`,
        'trendmicro': `https://www.trendmicro.com/vinfo/us/search/results?q=${encoded}`
    };
}

function searchAllExploits() {
    const searchTerm = document.getElementById('exploit-service-input').value.trim();
    if (!searchTerm) {
        toast('⚠ Please enter a service/version to search', 'error');
        return;
    }

    // Update CLI commands
    const searchsploitCmd = document.getElementById('cmd-exp-searchsploit');
    if (searchsploitCmd) {
        searchsploitCmd.textContent = `searchsploit "${searchTerm}" --json > exploits.json`;
    }

    const msfCmd = document.getElementById('cmd-exp-msf');
    if (msfCmd) {
        msfCmd.textContent = `msfconsole -q -x "search type:exploit ${searchTerm}; exit"`;
    }

    toast('✅ Commands updated with: ' + searchTerm, 'success');

    // Ask to open all databases
    const urls = getAllExploitUrls(searchTerm);
    const count = Object.keys(urls).length;

    if (confirm(`Open all ${count} exploit databases for "${searchTerm}"?\n\nThis will open ${count} new tabs.`)) {
        let delay = 0;
        Object.values(urls).forEach((url) => {
            setTimeout(() => window.open(url, '_blank'), delay);
            delay += 200;
        });
        toast(`🚀 Opening ${count} exploit databases...`, 'success');
    }
}

function openExploitDB(dbType, event) {
    event.preventDefault();
    const searchTerm = document.getElementById('exploit-service-input').value.trim();

    if (!searchTerm) {
        toast('⚠ Please enter a service/version first', 'error');
        document.getElementById('exploit-service-input').focus();
        return;
    }

    const urls = getAllExploitUrls(searchTerm);
    const url = urls[dbType];

    if (url) {
        window.open(url, '_blank');
        toast('🔍 Searching ' + dbType.replace('-', ' ') + '...', 'success');
    }
}

function copyExploitCmd(cmdId) {
    const cmdEl = document.getElementById(cmdId);
    if (!cmdEl) return;

    const text = cmdEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
        toast(' Command copied!', 'success');
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast(' Command copied!', 'success');
    });
}

function generateAllCommands() {
    const target = getTarget();
    if (target === null) return;

    updateMethodologyTarget();
    toast('✅ Commands generated for ' + target, 'success');

    // Expand all steps
    document.querySelectorAll('.method-step').forEach(step => {
        step.classList.remove('collapsed');
    });
}

function copyMethodCmd(cmdId) {
    const cmdEl = document.getElementById(cmdId);
    const target = getTarget() || 'TARGET';
    let text = cmdEl.textContent.replace(/TARGET/g, target);

    navigator.clipboard.writeText(text).then(() => {
        toast(' Command copied!', 'success');
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast(' Command copied!', 'success');
    });
}

function copyAllCommands() {
    const target = getTarget() || 'TARGET';
    const commands = [];

    commands.push('#!/bin/bash');
    commands.push('# Bug Bounty Recon Methodology');
    commands.push('# Target: ' + target);
    commands.push('# Generated by DORK HUNT');
    commands.push('');
    commands.push('TARGET="' + target + '"');
    commands.push('mkdir -p recon-$TARGET && cd recon-$TARGET');
    commands.push('');

    document.querySelectorAll('.method-step').forEach(step => {
        const title = step.querySelector('.method-step-title').textContent;
        commands.push('# ' + title);
        commands.push('echo "[*] ' + title + '"');

        step.querySelectorAll('.method-cmd').forEach(cmd => {
            let text = cmd.textContent.replace(/TARGET/g, '$TARGET');
            commands.push(text);
        });
        commands.push('');
    });

    const allText = commands.join('\n');

    navigator.clipboard.writeText(allText).then(() => {
        toast(' All commands copied as bash script!', 'success');
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = allText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast(' All commands copied!', 'success');
    });
}

function exportMethodology() {
    const target = getTarget() || 'TARGET';
    const commands = [];

    commands.push('#!/bin/bash');
    commands.push('#');
    commands.push('# ███ BUG BOUNTY RECON SCRIPT ███');
    commands.push('# Target: ' + target);
    commands.push('# Generated by DORK HUNT - Advanced Bug Bounty Recon Engine');
    commands.push('# https://www.instagram.com/un1kn0n3_h4rt/');
    commands.push('#');
    commands.push('');
    commands.push('set -e');
    commands.push('');
    commands.push('# Colors');
    commands.push('RED="\\033[0;31m"');
    commands.push('GREEN="\\033[0;32m"');
    commands.push('YELLOW="\\033[1;33m"');
    commands.push('CYAN="\\033[0;36m"');
    commands.push('NC="\\033[0m"');
    commands.push('');
    commands.push('TARGET="' + target + '"');
    commands.push('OUTPUT_DIR="recon-$TARGET-$(date +%Y%m%d_%H%M%S)"');
    commands.push('');
    commands.push('echo -e "${CYAN}"');
    commands.push('echo "██████  ███████ ██████  ███████ ███    ██"');
    commands.push('echo "██   ██ ██      ██   ██ ██      ████   ██"');
    commands.push('echo "██████  █████   ██      █████   ██ ██  ██"');
    commands.push('echo "██   ██ ██      ██   ██ ██      ██  ██ ██"');
    commands.push('echo "██   ██ ███████ ██████  ███████ ██   ████"');
    commands.push('echo -e "${NC}"');
    commands.push('echo -e "${YELLOW}[*] Target: $TARGET${NC}"');
    commands.push('echo -e "${YELLOW}[*] Output: $OUTPUT_DIR${NC}"');
    commands.push('echo ""');
    commands.push('');
    commands.push('mkdir -p "$OUTPUT_DIR" && cd "$OUTPUT_DIR"');
    commands.push('');

    document.querySelectorAll('.method-step').forEach((step, index) => {
        const title = step.querySelector('.method-step-title').textContent;
        const num = String(index + 1).padStart(2, '0');

        commands.push('# ═══════════════════════════════════════');
        commands.push('# STEP ' + num + ': ' + title);
        commands.push('# ═══════════════════════════════════════');
        commands.push('echo -e "${GREEN}[STEP ' + num + '] ' + title + '${NC}"');
        commands.push('');

        step.querySelectorAll('.method-cmd-block').forEach(block => {
            const label = block.querySelector('.method-cmd-label').textContent;
            const cmd = block.querySelector('.method-cmd').textContent.replace(/TARGET/g, '$TARGET');

            commands.push('# ' + label);
            commands.push('echo -e "${CYAN}  [-] Running: ' + label + '${NC}"');
            commands.push(cmd + ' 2>/dev/null || echo -e "${RED}  [!] ' + label + ' failed or not installed${NC}"');
            commands.push('');
        });

        commands.push('');
    });

    commands.push('echo ""');
    commands.push('echo -e "${GREEN}███ RECON COMPLETE ███${NC}"');
    commands.push('echo -e "${YELLOW}[*] Results saved in: $OUTPUT_DIR${NC}"');
    commands.push('echo -e "${CYAN}[*] Happy Hunting! - DORK HUNT${NC}"');

    const scriptContent = commands.join('\n');
    const blob = new Blob([scriptContent], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recon-' + target.replace(/\./g, '-') + '.sh';
    a.click();
    URL.revokeObjectURL(url);

    toast('📥 Bash script downloaded!', 'success');
}

// Update methodology target when main target changes
const originalValidateInput = validateInput;
validateInput = function (input) {
    const result = originalValidateInput(input);
    // Update methodology target display
    const methodTarget = document.getElementById('method-target');
    if (methodTarget) {
        const target = getTarget();
        methodTarget.textContent = target || 'Not set';
    }
    return result;
};
