const enc = encodeURIComponent;

// ══════════════════════════════════════════
// DORK DATABASE
// ══════════════════════════════════════════
const DORKS = [
    // RECON
    {
        id: 1,
        cat: "recon",
        
        label: "Directory Listing",
        query: (d) => `site:${d} intitle:index.of`,
    },
    {
        id: 6,
        cat: "recon",
        
        label: "Login Pages",
        query: (d) => `site:${d} inurl:login`,
    },
    {
        id: 18,
        cat: "recon",
        
        label: "Find Subdomains",
        url: (d) =>
            `https://www.google.com/search?q=${enc("site:*." + d)}`,
    },
    {
        id: 19,
        cat: "recon",
        
        label: "Sub-Subdomains",
        url: (d) =>
            `https://www.google.com/search?q=${enc("site:*.*." + d)}`,
    },
    {
        id: 13,
        cat: "recon",
        
        label: "Open Redirects",
        query: (d) =>
            `site:${d} inurl:redir | inurl:redirect | inurl:return | inurl:src=http | inurl:r=http`,
    },
    {
        id: 16,
        cat: "recon",
        
        label: "LinkedIn Employees",
        url: (d) =>
            `https://www.google.com/search?q=${enc("site:linkedin.com employees " + d)}`,
    },
    {
        id: 42,
        cat: "recon",
        
        label: "Admin Portal (.aspx)",
        query: (d) => `site:${d} inurl:/admin.aspx`,
    },
    {
        id: "r8",
        cat: "recon",
        
        label: "Admin Panel (generic)",
        query: (d) =>
            `site:${d} inurl:admin | inurl:administrator | inurl:adminpanel | inurl:backend`,
    },
    {
        id: "r9",
        cat: "recon",
        
        label: "API Endpoints",
        query: (d) =>
            `site:${d} inurl:/api/ | inurl:/api/v1/ | inurl:/api/v2/ | inurl:/rest/`,
    },
    {
        id: "r10",
        cat: "recon",
        
        label: "robots.txt",
        url: (d) => `https://${d}/robots.txt`,
    },
    {
        id: "r11",
        cat: "recon",
        
        label: "sitemap.xml",
        url: (d) => `https://${d}/sitemap.xml`,
    },
    {
        id: "r12",
        cat: "recon",
        
        label: "Email Pattern Search",
        url: (d) =>
            `https://www.google.com/search?q=${enc("@" + d + " email")}`,
    },
    {
        id: "r13",
        cat: "recon",
        
        label: "Search All Indexed Pages",
        query: (d) => `site:${d}`,
    },
    {
        id: "r14",
        cat: "recon",
        
        label: "Staging / Dev / Test Envs",
        query: (d) =>
            `site:${d} inurl:staging | inurl:dev | inurl:test | inurl:uat | inurl:sandbox`,
    },
    // FILES
    {
        id: 2,
        cat: "files",
        
        label: "Exposed Config Files",
        query: (d) =>
            `site:${d} ext:xml | ext:conf | ext:cnf | ext:reg | ext:inf | ext:rdp | ext:cfg | ext:txt | ext:ora | ext:ini`,
    },
    {
        id: 3,
        cat: "files",
        
        label: "Exposed Database Files",
        query: (d) => `site:${d} ext:sql | ext:dbf | ext:mdb`,
    },
    {
        id: 4,
        cat: "files",
        
        label: "Exposed Log Files",
        query: (d) => `site:${d} ext:log`,
    },
    {
        id: 5,
        cat: "files",
        
        label: "Backup & Old Files",
        query: (d) =>
            `site:${d} ext:bkf | ext:bkp | ext:bak | ext:old | ext:backup`,
    },
    {
        id: 8,
        cat: "files",
        
        label: "Public Documents (PDF/DOC)",
        query: (d) =>
            `site:${d} ext:doc | ext:docx | ext:odt | ext:pdf | ext:rtf | ext:ppt | ext:pptx | ext:csv`,
    },
    {
        id: 12,
        cat: "files",
        
        label: "Install / Setup Files",
        query: (d) =>
            `site:${d} inurl:readme | inurl:license | inurl:install | inurl:setup | inurl:config`,
    },
    {
        id: 17,
        cat: "files",
        
        label: ".htaccess / .git Files",
        url: (d) =>
            `https://www.google.com/search?q=${enc('inurl:"/phpinfo.php" | inurl:".htaccess" | inurl:"/.git" ' + d + " -github")}`,
    },
    {
        id: 41,
        cat: "files",
        
        label: "main.yml File",
        query: (d) => `site:${d} intitle:"index of" "main.yml"`,
    },
    {
        id: 46,
        cat: "files",
        
        label: "conf.php Sensitive",
        query: (d) => `site:${d} intitle:index.of conf.php`,
    },
    {
        id: 48,
        cat: "files",
        
        label: "Admin Backup Zip",
        query: (d) =>
            `site:${d} intitle:"Index of" inurl:/backup/ "admin.zip"`,
    },
    {
        id: 59,
        cat: "files",
        
        label: "MySQL Config File",
        query: (d) => `site:${d} intitle:index.of conf.mysql`,
    },
    {
        id: 60,
        cat: "files",
        
        label: "YML Sensitive Files",
        query: (d) =>
            `site:${d} intitle:"index of" "users.yml" | "admin.yml" | "config.yml"`,
    },
    {
        id: 61,
        cat: "files",
        
        label: "docker-compose.yml",
        query: (d) =>
            `site:${d} intitle:"index of" "docker-compose.yml"`,
    },
    {
        id: 62,
        cat: "files",
        
        label: "pom.xml (Maven)",
        query: (d) =>
            `site:${d} intext:pom.xml intitle:"index of /"`,
    },
    {
        id: 63,
        cat: "files",
        
        label: "Exposed /etc Directory",
        query: (d) => `site:${d} intext:"Index of" intext:"/etc"`,
    },
    {
        id: "f16",
        cat: "files",
        
        label: ".env Files Exposed",
        query: (d) =>
            `site:${d} inurl:.env | intitle:"index of" ".env"`,
    },
    {
        id: "f17",
        cat: "files",
        
        label: ".DS_Store Files",
        query: (d) => `site:${d} intitle:"index of" ".DS_Store"`,
    },
    {
        id: "f18",
        cat: "files",
        
        label: "Private Keys (.pem/.key)",
        query: (d) =>
            `site:${d} ext:pem | ext:key intitle:index.of`,
    },
    {
        id: "f19",
        cat: "files",
        
        label: "SSH Private Keys",
        query: (d) =>
            `site:${d} intitle:"index of" "id_rsa" | "id_dsa" | ".ssh"`,
    },
    // VULNS
    {
        id: 7,
        cat: "vulns",
        
        label: "SQL Errors / Injection",
        query: (d) =>
            `site:${d} intext:"sql syntax near" | intext:"syntax error has occurred" | intext:"incorrect syntax near" | intext:"Warning: mysql_connect()" | intext:"Warning: mysql_query()"`,
    },
    {
        id: 9,
        cat: "vulns",
        
        label: "phpinfo() Page",
        query: (d) =>
            `site:${d} ext:php intitle:phpinfo "published by the PHP Group"`,
    },
    {
        id: 11,
        cat: "vulns",
        
        label: "Backdoors / Webshells",
        query: (d) =>
            `site:${d} inurl:shell | inurl:backdoor | inurl:wso | inurl:cmd | shadow | passwd | boot.ini`,
    },
    {
        id: 14,
        cat: "vulns",
        
        label: "Apache Struts RCE",
        query: (d) => `site:${d} ext:action | ext:struts | ext:do`,
    },
    {
        id: 22,
        cat: "vulns",
        
        label: "crossdomain.xml Test",
        url: (d) => `https://${d}/crossdomain.xml`,
    },
    {
        id: 38,
        cat: "vulns",
        
        label: "GeoServer WFS",
        query: (d) =>
            `site:${d} inurl:"/geoserver/ows?service=wfs"`,
    },
    {
        id: 39,
        cat: "vulns",
        
        label: "ArcGIS REST Services",
        query: (d) =>
            `site:${d} intext:"ArcGIS REST Services Directory" intitle:"Folder: /"`,
    },
    {
        id: 44,
        cat: "vulns",
        
        label: "File Upload Endpoints",
        query: (d) => `site:${d} inurl:uploadimage.php`,
    },
    {
        id: 53,
        cat: "vulns",
        
        label: "SQL in URL Parameter",
        query: (d) => `site:${d} inurl:"php?sql=select" ext:php`,
    },
    {
        id: 55,
        cat: "vulns",
        
        label: "JSON-RPC Exposed",
        query: (d) => `site:${d} intext:"index of" inurl:json-rpc`,
    },
    {
        id: 57,
        cat: "vulns",
        
        label: "JWKS-RSA Key File",
        query: (d) => `site:${d} intext:"index of" inurl:jwks-rsa`,
    },
    {
        id: 64,
        cat: "vulns",
        
        label: "SQL Install Directories",
        query: (d) =>
            `site:${d} "sql" "parent" intitle:index.of -injection`,
    },
    {
        id: "v14",
        cat: "vulns",
        
        label: "Spring Actuator Exposed",
        query: (d) =>
            `site:${d} inurl:/actuator | inurl:/actuator/health | inurl:/actuator/env`,
    },
    {
        id: "v15",
        cat: "vulns",
        
        label: "Stack Traces / Error Pages",
        query: (d) =>
            `site:${d} intext:"stack trace" | intext:"Traceback (most recent call last)" | intext:"Fatal error"`,
    },
    {
        id: "v16",
        cat: "vulns",
        
        label: "SSRF URL Parameters",
        query: (d) =>
            `site:${d} inurl:url= | inurl:path= | inurl:dest= | inurl:fetch=`,
    },
    {
        id: "v17",
        cat: "vulns",
        
        label: "SSTI Indicators",
        query: (d) =>
            `site:${d} inurl:template= | inurl:view= | inurl:layout=`,
    },
    {
        id: "v18",
        cat: "vulns",
        
        label: "XXE / XML Processing",
        query: (d) =>
            `site:${d} ext:xml | ext:xsl | ext:xslt inurl:upload`,
    },
    {
        id: "v19",
        cat: "vulns",
        
        label: "Insecure Direct Object Ref",
        query: (d) =>
            `site:${d} inurl:id= | inurl:user_id= | inurl:account_id=`,
    },
    // CMS
    {
        id: 10,
        cat: "cms",
        
        label: "WordPress Detection #1",
        query: (d) =>
            `site:${d} inurl:wp- | inurl:wp-content | inurl:plugins | inurl:uploads | inurl:themes`,
    },
    {
        id: 20,
        cat: "cms",
        
        label: "WordPress Detection #2",
        url: (d) =>
            `https://www.google.com/search?q=${enc("inurl:wp-content | inurl:wp-includes " + d)}`,
    },
    {
        id: 40,
        cat: "cms",
        
        label: "WP Invoice Files",
        query: (d) =>
            `site:${d} inurl:/wp-content/uploads/wpo_wcpdf`,
    },
    {
        id: 45,
        cat: "cms",
        
        label: "Contact Form 7 (Vuln)",
        query: (d) =>
            `site:${d} inurl:*/wp-content/plugins/contact-form-7/`,
    },
    {
        id: 54,
        cat: "cms",
        
        label: "WP wp-config.php",
        query: (d) =>
            `site:${d} inurl:"wp-content" intitle:"index.of" intext:wp-config.php`,
    },
    {
        id: 58,
        cat: "cms",
        
        label: "WP Backup Files",
        query: (d) =>
            `site:${d} inurl:"wp-content" intitle:"index.of" intext:backup`,
    },
    {
        id: 51,
        cat: "cms",
        
        label: "Drupal Login Page",
        query: (d) =>
            `site:${d} inurl:user intitle:"Drupal" intext:"Log in" -"powered by"`,
    },
    {
        id: 52,
        cat: "cms",
        
        label: "Joomla Database Dir",
        query: (d) => `site:${d} inurl:/libraries/joomla/database/`,
    },
    {
        id: "c10",
        cat: "cms",
        
        label: "Laravel Debug / Whoops",
        query: (d) =>
            `site:${d} intext:"Whoops! There was an error." | intitle:"Laravel"`,
    },
    {
        id: "c11",
        cat: "cms",
        
        label: "Symfony Debug Toolbar",
        query: (d) =>
            `site:${d} inurl:/_profiler | intext:"Symfony Profiler"`,
    },
    {
        id: "c12",
        cat: "cms",
        
        label: "Magento Admin Panel",
        query: (d) =>
            `site:${d} inurl:/admin | intext:"Magento" intitle:"Admin"`,
    },
    {
        id: "c13",
        cat: "cms",
        
        label: "Ghost CMS",
        query: (d) =>
            `site:${d} inurl:/ghost/ | intitle:"Ghost Admin"`,
    },
    // CLOUD
    {
        id: "cl1",
        cat: "cloud",
        
        label: "AWS S3 Bucket Links",
        query: (d) => `site:${d} inurl:s3.amazonaws.com`,
    },
    {
        id: "cl2",
        cat: "cloud",
        
        label: "Open S3 Bucket Search",
        url: (d) =>
            `https://www.google.com/search?q=${enc(d + " site:s3.amazonaws.com")}`,
    },
    {
        id: "cl3",
        cat: "cloud",
        
        label: "Azure Blob Storage",
        query: (d) => `site:${d} inurl:blob.core.windows.net`,
    },
    {
        id: "cl4",
        cat: "cloud",
        
        label: "GCP Storage Buckets",
        query: (d) => `site:${d} inurl:storage.googleapis.com`,
    },
    {
        id: "cl5",
        cat: "cloud",
        
        label: "Docker Registry Exposed",
        query: (d) =>
            `site:${d} inurl:/v2/ intitle:"Docker Registry"`,
    },
    {
        id: "cl6",
        cat: "cloud",
        
        label: "Kubernetes Dashboard",
        query: (d) =>
            `site:${d} inurl:":8001/api" | intitle:"Kubernetes Dashboard"`,
    },
    {
        id: "cl7",
        cat: "cloud",
        
        label: "Firebase Exposed DB",
        url: (d) =>
            `https://www.google.com/search?q=${enc(d + " site:firebaseio.com")}`,
    },
    {
        id: "cl8",
        cat: "cloud",
        
        label: "Grafana Dashboard Open",
        query: (d) => `site:${d} intitle:"Grafana" inurl:"/login"`,
    },
    {
        id: "cl9",
        cat: "cloud",
        
        label: "Elasticsearch Open",
        query: (d) =>
            `site:${d} inurl:9200 intitle:"Elasticsearch"`,
    },
    {
        id: "cl10",
        cat: "cloud",
        
        label: "Jenkins CI Exposed",
        query: (d) =>
            `site:${d} intitle:"Dashboard [Jenkins]" | inurl:/jenkins/`,
    },
    {
        id: "cl11",
        cat: "cloud",
        
        label: "AWS Secrets in Code",
        query: (d) =>
            `site:${d} intext:"AWS_ACCESS_KEY_ID" | intext:"AWS_SECRET_ACCESS_KEY"`,
    },
    {
        id: "cl12",
        cat: "cloud",
        
        label: "Vercel / Netlify Previews",
        url: (d) =>
            `https://www.google.com/search?q=${enc(d + " site:vercel.app OR site:netlify.app")}`,
    },
    // API
    {
        id: 49,
        cat: "api",
        
        label: "GitHub API Key Index",
        query: (d) => `site:${d} intitle:"index of" github-api`,
    },
    {
        id: "a1",
        cat: "api",
        
        label: "Exposed API Keys (generic)",
        query: (d) =>
            `site:${d} intext:"api_key" | intext:"apikey" | intext:"api-key" ext:json | ext:yaml | ext:env`,
    },
    {
        id: "a2",
        cat: "api",
        
        label: "AWS Access Keys in Pages",
        query: (d) => `site:${d} intext:"AKIA" intext:"secret"`,
    },
    {
        id: "a3",
        cat: "api",
        
        label: "Swagger / OpenAPI UI",
        query: (d) =>
            `site:${d} inurl:/swagger-ui | inurl:/api-docs | intitle:"Swagger UI"`,
    },
    {
        id: "a4",
        cat: "api",
        
        label: "Postman Collections",
        url: (d) =>
            `https://www.google.com/search?q=${enc("site:postman.com " + d)}`,
    },
    {
        id: "a5",
        cat: "api",
        
        label: "JWT Tokens in URLs",
        query: (d) =>
            `site:${d} inurl:token= | inurl:access_token= | inurl:jwt=`,
    },
    {
        id: "a6",
        cat: "api",
        
        label: "OAuth / SSO Endpoints",
        query: (d) =>
            `site:${d} inurl:/oauth/token | inurl:/oauth/authorize | inurl:/auth/callback`,
    },
    {
        id: "a7",
        cat: "api",
        
        label: "GraphQL Endpoints",
        query: (d) =>
            `site:${d} inurl:/graphql | inurl:/graphiql | intitle:"GraphiQL"`,
    },
    {
        id: "a8",
        cat: "api",
        
        label: "Exposed Stripe Keys",
        query: (d) =>
            `site:${d} intext:"sk_live_" | intext:"pk_live_"`,
    },
    {
        id: "a9",
        cat: "api",
        
        label: "Exposed Readme with Keys",
        query: (d) =>
            `site:${d} inurl:readme intext:"key" | intext:"token" | intext:"secret"`,
    },
    // OSINT
    {
        id: 15,
        cat: "osint",
        
        label: "Pastebin Leaks",
        url: (d) =>
            `https://www.google.com/search?q=${enc("site:pastebin.com " + d)}`,
    },
    {
        id: 23,
        cat: "osint",
        
        label: "ThreatCrowd Lookup",
        url: (d) =>
            `https://www.threatcrowd.org/domain.php?domain=${d}`,
    },
    {
        id: 30,
        cat: "osint",
        
        label: "Certificate Transparency",
        url: (d) => `https://crt.sh/?q=%25.${d}`,
    },
    {
        id: 31,
        cat: "osint",
        
        label: "OpenBugBounty",
        url: (d) =>
            `https://www.openbugbounty.org/search/?search=${enc(d)}&type=host`,
    },
    {
        id: 32,
        cat: "osint",
        
        label: "Reddit Mentions",
        url: (d) =>
            `https://www.reddit.com/search/?q=${enc(d)}&source=recent`,
    },
    {
        id: 34,
        cat: "osint",
        
        label: "Censys — Hosts",
        url: (d) => `https://search.censys.io/hosts?q=${d}`,
    },
    {
        id: 36,
        cat: "osint",
        
        label: "Censys — Certificates",
        url: (d) => `https://search.censys.io/certificates?q=${d}`,
    },
    {
        id: 37,
        cat: "osint",
        
        label: "Shodan",
        url: (d) => `https://www.shodan.io/search?query=${d}`,
    },
    {
        id: "o9",
        cat: "osint",
        
        label: "VirusTotal Domain",
        url: (d) =>
            `https://www.virustotal.com/gui/domain/${d}/relations`,
    },
    {
        id: "o11",
        cat: "osint",
        
        label: "SecurityTrails",
        url: (d) => `https://securitytrails.com/domain/${d}/dns`,
    },
    {
        id: "o13",
        cat: "osint",
        
        label: "Hunter.io Email Finder",
        url: (d) => `https://hunter.io/domain-search?domain=${d}`,
    },
    {
        id: "o14",
        cat: "osint",
        
        label: "Wayback CDX API",
        url: (d) =>
            `https://web.archive.org/cdx/search?url=${d}/&matchType=domain&collapse=urlkey&output=text&fl=original&limit=10000`,
    },
    {
        id: 21,
        cat: "osint",
        
        label: "GitHub Subdomain Search",
        url: (d) =>
            `https://github.com/search?q=${enc('"*.' + d + '"')}&type=host`,
    },
    {
        id: "o16",
        cat: "osint",
        
        label: "Fofa Search",
        url: (d) =>
            `https://fofa.info/result?qbase64=${btoa('domain="' + d + '"')}`,
    },
    {
        id: "o17",
        cat: "osint",
        
        label: "Google Cache",
        url: (d) =>
            `https://www.google.com/search?q=${enc("cache:" + d)}`,
    },
    // ARCHIVE
    {
        id: 24,
        cat: "flash",
        
        label: "Find SWF (Google)",
        url: (d) =>
            `https://www.google.com/search?q=${enc("+inurl:" + d + " +ext:swf")}`,
    },
    {
        id: 26,
        cat: "flash",
        
        label: "SWF in Archive",
        url: (d) =>
            `https://web.archive.org/cdx/search?url=${enc(d)}/&matchType=domain&collapse=urlkey&output=text&fl=original&filter=urlkey:.*swf&limit=100000`,
    },
    {
        id: 28,
        cat: "flash",
        
        label: "Web Archive Search #1",
        url: (d) => `https://web.archive.org/web/*/(.*${enc(d)})`,
    },
    {
        id: 29,
        cat: "flash",
        
        label: "Web Archive Search #2",
        url: (d) => `https://web.archive.org/web/*/${enc(d)}/*`,
    },
];

// ══════════════════════════════════════════
// CHECKLIST DATA
// ══════════════════════════════════════════
const CHECKLIST = [
    {
        section: "Phase 1 — Passive Recon",
        items: [
            {
                id: "ck1",
                label: "Certificate transparency",
                sub: "crt.sh, censys — enumerate subdomains from certs",
            },
            {
                id: "ck2",
                label: "DNS enumeration",
                sub: "dnsdumpster, securitytrails, amass, subfinder",
            },
            {
                id: "ck3",
                label: "WHOIS lookup",
                sub: "registrant info, nameservers, registration dates",
            },
            {
                id: "ck4",
                label: "ASN / IP range mapping",
                sub: "bgp.he.net — find all IP blocks owned by target",
            },
            {
                id: "ck5",
                label: "Google dorks — subdomains",
                sub: "site:*.target.com",
            },
            {
                id: "ck6",
                label: "GitHub recon",
                sub: "Leaked secrets, API keys, employee emails",
            },
            {
                id: "ck7",
                label: "Shodan / Censys / Fofa scan",
                sub: "Exposed services, ports, banners",
            },
            {
                id: "ck8",
                label: "Wayback Machine CDX crawl",
                sub: "Extract all historic URLs",
            },
        ],
    },
    {
        section: "Phase 2 — Active Recon",
        items: [
            {
                id: "ck9",
                label: "Port scan",
                sub: "nmap -sV -sC -p- target.com",
            },
            {
                id: "ck10",
                label: "Web tech fingerprint",
                sub: "Wappalyzer, whatweb — detect CMS, frameworks",
            },
            {
                id: "ck11",
                label: "Directory brute-force",
                sub: "ffuf, dirsearch, gobuster",
            },
            {
                id: "ck12",
                label: "Subdomain brute-force",
                sub: "ffuf + wordlist or amass -active",
            },
            {
                id: "ck13",
                label: "robots.txt / sitemap.xml",
                sub: "Review disallowed paths",
            },
            {
                id: "ck14",
                label: "HTTP security headers",
                sub: "Missing CSP, HSTS, X-Frame-Options",
            },
            {
                id: "ck15",
                label: "JS file analysis",
                sub: "Grep JS for secrets, endpoints, APIs",
            },
            {
                id: "ck16",
                label: "CORS misconfiguration",
                sub: 'curl -H "Origin: evil.com"',
            },
        ],
    },
    {
        section: "Phase 3 — Vulnerability Testing",
        items: [
            {
                id: "ck17",
                label: "Test all login forms",
                sub: "Default creds, brute force, lockout policy",
            },
            {
                id: "ck18",
                label: "SQLi testing",
                sub: "sqlmap or manual on all params",
            },
            {
                id: "ck19",
                label: "XSS testing",
                sub: "Reflected, stored, DOM — all surfaces",
            },
            {
                id: "ck20",
                label: "IDOR / BAC testing",
                sub: "Enumerate IDs, change user context",
            },
            {
                id: "ck21",
                label: "SSRF testing",
                sub: "URL params pointing to external resources",
            },
            {
                id: "ck22",
                label: "File upload testing",
                sub: "Upload PHP, SVG, HTML — check execution",
            },
            {
                id: "ck23",
                label: "Open redirect testing",
                sub: "url=, next=, redir=, to= params",
            },
            {
                id: "ck24",
                label: "API security testing",
                sub: "Auth, rate limiting, mass assignment, GraphQL",
            },
            {
                id: "ck25",
                label: "Check .env / secrets",
                sub: "curl /.env, /.git/config, /config.json",
            },
            {
                id: "ck26",
                label: "Business logic flaws",
                sub: "Price manipulation, coupon abuse, negative values",
            },
        ],
    },
    {
        section: "Phase 4 — Reporting",
        items: [
            {
                id: "ck27",
                label: "Document findings with PoC",
                sub: "Screenshots, CVSS score, repro steps",
            },
            {
                id: "ck28",
                label: "Verify scope and RoE",
                sub: "Confirm in-scope before submitting",
            },
            {
                id: "ck29",
                label: "Submit to platform",
                sub: "HackerOne, Bugcrowd, Intigriti",
            },
            {
                id: "ck30",
                label: "Follow up on triage",
                sub: "Respond to triage requests quickly",
            },
        ],
    },
];
