// --- DATA & CONFIG ---

const SEVEN_TOPICS = [
    {
        title: "人工智慧與數據科學",
        type: "fixed",
        courses: ["資料庫系統概論", "人工智慧概論", "機器學習概論", "人工智慧總整與實作"]
    },
    {
        title: "資訊安全",
        type: "fixed",
        courses: ["計算機網路概論", ["密碼學概論", "密碼工程"], "網路程式設計概論", "電腦安全總整與實作"],
        note: "密碼學概論 與 密碼工程 擇一即可"
    },
    {
        title: "多媒體工程",
        type: "fixed",
        courses: ["數值方法", "計算機圖學概論", "影像處理概論", "多媒體與人機互動總整與實作"]
    },
    {
        title: "網路工程",
        type: "fixed",
        courses: ["計算機網路概論", "通訊原理與無線網路", "網路程式設計概論", "網路系統總整與實作"]
    },
    {
        title: "系統軟體",
        type: "fixed",
        courses: ["編譯器設計概論", "計算機系統管理", "高等UNIX程式設計", "作業系統總整與實作"]
    },
    {
        title: "軟硬體整合",
        type: "fixed",
        courses: ["數位電路實驗", "編譯器設計概論", "微處理機系統原理與實作", "嵌入式系統總整與實作"]
    },
    {
        title: "計算理論",
        type: "pick4",
        courses: [
            "人工智慧概論", "數值方法", "正規語言概論", "組合數學",
            "競技程式設計(一)", ["圖形理論", "圖形理論導論"], "隨機演算法",
            "資訊理論與壓縮編碼的應用", "機器學習演算法理論基礎", "近似演算法"
        ],
        note: "任選 4 門"
    }
];

const CORE_RULES = {
    science: {
        calculus: ["微積分"],
        physics: ["物理"],
        chemistry: ["化學"],
        biology: ["生物"]
    },
    compulsory: [
        "線性代數", "計算機概論與程式設計", "資料結構與物件導向程式設計",
        "離散數學", "數位電路設計", "機率", "演算法概論",
        "計算機組織", "作業系統概論", "資訊工程研討",
        "資訊工程專題(一)", "資訊工程專題(二)"
    ],
    basicProg: "基礎程式設計"
};

// --- HELPER FUNCTIONS ---

// --- THEME (DARK MODE) ---

const THEME_STORAGE_KEY = 'nycu-grad-check-theme';

function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function getStoredTheme() {
    const t = localStorage.getItem(THEME_STORAGE_KEY);
    return (t === 'dark' || t === 'light') ? t : null;
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const btn = document.getElementById('themeToggle');
    if (btn) {
        const isDark = theme === 'dark';
        btn.textContent = isDark ? '淺色模式' : '深色模式';
        btn.setAttribute('aria-label', isDark ? '切換淺色模式' : '切換深色模式');
    }
}

function initTheme() {
    const stored = getStoredTheme();
    applyTheme(stored || getSystemTheme());

    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_STORAGE_KEY, next);
            applyTheme(next);
        });
    }

    if (window.matchMedia) {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => {
            // If user explicitly chose a theme, do not override it.
            if (getStoredTheme()) return;
            applyTheme(getSystemTheme());
        };
        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', onChange);
        } else if (typeof mql.addListener === 'function') {
            mql.addListener(onChange);
        }
    }
}

function normalizeName(name) {
    if (!name) return "";
    let n = name.replace(/\s+/g, "");
    n = n.replace(/（/g, "(").replace(/）/g, ")");
    // 處理特殊字元 "理" (U+F9F1) -> "理" (U+7406)
    n = n.replace(/\uF9F1/g, "理");
    return n;
}

document.addEventListener('DOMContentLoaded', initTheme);

function checkCourseTaken(target, userCoursesNormalized) {
    if (Array.isArray(target)) {
        return target.some(t => checkCourseTaken(t, userCoursesNormalized));
    }
    const targetNorm = normalizeName(target);
    if (userCoursesNormalized.includes(targetNorm)) return true;
    if (targetNorm.includes("專題")) {
        return userCoursesNormalized.some(uc => uc === targetNorm);
    }
    return userCoursesNormalized.some(uc => uc.includes(targetNorm));
}

// --- MAIN LOGIC ---

function analyze() {
    try {
        const raw = document.getElementById('inputData').value;
        const englishType = document.querySelector('input[name="englishType"]:checked').value;

        const lines = raw.trim().split('\n');
        const courses = [];

        // 1. Parse Input
        lines.forEach((line, index) => {
            const cols = line.split('\t');
            if (cols.length < 5) return;

            if (index === 0 && (line.includes("筆") || line.includes("學期") || line.includes("課號"))) {
                return;
            }

            const grade = cols[7] ? cols[7].trim().toUpperCase() : "";
            const status = cols[8] ? cols[8].trim().toUpperCase() : "";

            const failedGrades = ['F', 'X', 'W', '不通過', '退選', '二退'];
            const failedStatus = ['W', '退選', '休學'];

            if (failedGrades.includes(grade) || failedStatus.some(s => status.includes(s))) {
                return;
            }

            const dim = cols.length > 10 ? cols[10].trim() : "";

            courses.push({
                term: cols[1],
                code: cols[2] || "",
                dept: cols[3] || "",
                name: cols[4] ? cols[4].trim() : "",
                type: cols[5] || "",
                credit: parseFloat(cols[6]) || 0,
                grade: grade,
                dimension: dim
            });
        });

        const userCourseNames = courses.map(c => normalizeName(c.name));

        // 2. Initialize Counters
        let totalCredits = 0;
        let csElectiveCredits = 0;
        let freeCredits = 0;
        let compulsoryCredits = 0;

        const csElectiveCourses = [];
        const freeElectiveCourses = [];

        let genEdStats = {
            basic: 0, area: 0, lang: 0, coreTotal: 0,
            otherGen: 0
        };
        let genEdLogs = { basic: [], area: [], lang: [] };

        let log = [];

        // --- 處理英文抵免/免修 ---
        if (englishType === 'transfer') {
            const exemptCredits = 4;
            genEdStats.lang += exemptCredits;
            totalCredits += exemptCredits;
            genEdLogs.lang.push(`[抵修] 英文課程 (4)`);
            log.push(`[英文抵修] 獲得 4 學分`);
        } else if (englishType === 'exemption') {
            genEdLogs.lang.push(`<span class="text-purple-600 font-bold">[免修] 英文課程 (0)</span>`);
            log.push(`[英文免修] 0 學分，須補修其他課程`);
        }

        let peCount = new Set();
        let serviceCount = 0;
        let mentorPassed = false;
        let basicProgCheck = false;

        let sciCheck = { calc: 0, phy: 0, chem: 0, bio: 0 };
        let compCheck = {};
        CORE_RULES.compulsory.forEach(c => compCheck[c] = false);

        // 3. Categorize Courses
        courses.forEach(c => {
            const nName = normalizeName(c.name);
            const cCode = c.code || "";
            const cDim = c.dimension || "";
            let categorized = false;

            // A. 排除項目
            if (c.name.includes("體育")) {
                peCount.add(c.term);
                log.push(`[體育] ${c.name}`);
                return;
            }
            if (c.name.includes("服務學習")) {
                serviceCount++;
                log.push(`[服學] ${c.name}`);
                return;
            }
            if (c.name.includes("導師時間")) {
                mentorPassed = true;
                log.push(`[導師] ${c.name}`);
                return;
            }
            if (c.type.includes("軍訓") || c.name.includes("軍訓") || c.name.includes("全民國防")) {
                log.push(`[軍訓] ${c.name} (${c.credit})`);
                return;
            }

            // B. 系必修
            if (CORE_RULES.compulsory.some(req => {
                if (req.includes("專題")) return nName === normalizeName(req);
                return nName.includes(normalizeName(req));
            })) {
                let matched = CORE_RULES.compulsory.find(req => {
                    if (req.includes("專題")) return nName === normalizeName(req);
                    return nName.includes(normalizeName(req));
                });

                if (matched) {
                    if (!compCheck[matched]) {
                        compCheck[matched] = true;
                        compulsoryCredits += c.credit;
                        totalCredits += c.credit;
                    }
                    categorized = true;
                    log.push(`[系必修] ${c.name} (${c.credit})`);
                }
            }
            else if (c.name.includes("基礎程式設計")) {
                basicProgCheck = true;
                categorized = true;
                log.push(`[系必修] ${c.name} (0)`);
            }

            // C. 基礎科學
            else if (nName.includes("微積分")) {
                sciCheck.calc += c.credit;
                totalCredits += c.credit;
                categorized = true;
                log.push(`[基科-微積分] ${c.name} (${c.credit})`);
            }
            else if (nName.includes("物理")) {
                sciCheck.phy += c.credit;
                totalCredits += c.credit;
                categorized = true;
                log.push(`[基科-物理] ${c.name} (${c.credit})`);
            }
            else if (nName.includes("化學")) {
                sciCheck.chem += c.credit;
                totalCredits += c.credit;
                categorized = true;
                log.push(`[基科-化學] ${c.name} (${c.credit})`);
            }
            else if (nName.includes("生物") && !nName.includes("工程")) {
                sciCheck.bio += c.credit;
                totalCredits += c.credit;
                categorized = true;
                log.push(`[基科-生物] ${c.name} (${c.credit})`);
            }

            // D. 通識與語言
            else if (
                cDim.includes("基本素養") || cDim.includes("領域課程") || cDim.includes("語言") ||
                c.type.includes("通識") || c.type.includes("語言") || c.type.includes("外語") ||
                c.name.includes("英文") || c.name.includes("英語") || c.name.includes("國文") ||
                c.name.includes("日文") || c.name.includes("德文") || c.name.includes("西班牙文") || c.name.includes("泰文")
            ) {
                categorized = true;
                totalCredits += c.credit;

                if (cDim.startsWith("基本素養")) {
                    genEdStats.basic += c.credit;
                    genEdStats.coreTotal += c.credit;
                    genEdLogs.basic.push(`${c.name} (${c.credit})`);
                    log.push(`[通識-基本] ${c.name} (${c.credit})`);
                }
                else if (cDim.startsWith("領域課程")) {
                    genEdStats.area += c.credit;
                    genEdStats.coreTotal += c.credit;
                    genEdLogs.area.push(`${c.name} (${c.credit})`);
                    log.push(`[通識-領域] ${c.name} (${c.credit})`);
                }
                else if (c.type.includes("語言") || c.type.includes("外語") || cDim.includes("語言") || c.name.includes("文")) {
                    genEdStats.lang += c.credit;
                    genEdLogs.lang.push(`${c.name} (${c.credit})`);
                    log.push(`[語言] ${c.name} (${c.credit})`);
                }
                else if (c.type.includes("核心課程")) {
                    genEdStats.coreTotal += c.credit;
                    log.push(`[通識-核心其他] ${c.name} (${c.credit})`);
                }
                else {
                    genEdStats.otherGen += c.credit;
                    log.push(`[通識-其他] ${c.name} (${c.credit})`);
                }
            }

            // E. 專業選修 / 學程選修
            else if ((c.dept.includes("資工") || c.dept.includes("網工") || c.dept.includes("數據") || c.dept.includes("資安") || cCode.startsWith("5") || c.dept.includes("資科"))) {
                csElectiveCredits += c.credit;
                totalCredits += c.credit;
                categorized = true;
                csElectiveCourses.push({ name: c.name, credit: c.credit });
                log.push(`[專業/學程選修] ${c.name} (${c.credit})`);
            }

            // F. 自由選修
            else {
                freeCredits += c.credit;
                totalCredits += c.credit;
                categorized = true;
                freeElectiveCourses.push({ name: c.name, credit: c.credit });
                log.push(`[自由選修] ${c.name} (${c.credit})`);
            }
        });

        // --- 4. Overflow Logic (計算溢流) ---

        const freeOverflowSources = [];

        // 規則 1: [NEW] 物理(一)(二) 溢流 -> 專業選修
        // 判定哪一科是基礎科學主科
        const sciOptions = [
            { name: "物理", credit: sciCheck.phy },
            { name: "化學", credit: sciCheck.chem },
            { name: "生物", credit: sciCheck.bio }
        ];
        // 找出學分最高的當作主科 (Reduce: 比較 p 和 c 的 credit)
        const bestSci = sciOptions.reduce((p, c) => (p.credit > c.credit) ? p : c);

        // 若主科是物理，且學分 >= 8 (代表修了物一+物二)，多出的部分 (總學分 - 6) 算入專業選修
        let phyOverflow = 0;
        if (bestSci.name === "物理" && bestSci.credit >= 8) {
            phyOverflow = bestSci.credit - 6; // 8 - 6 = 2
            csElectiveCredits += phyOverflow;
        }

        // 規則 2: 專業選修 > 42 -> 自由選修
        let csOverflow = 0;
        if (csElectiveCredits > 42) {
            csOverflow = csElectiveCredits - 42;
            freeCredits += csOverflow;
            freeOverflowSources.push(`含專業溢流 ${csOverflow}`);
        }

        // 規則 3: [NEW] 只有「核心通識 > 18」或「語言 > 6」的超額，才會溢流到自由選修 (Max 4)
        const coreOverflow = Math.max(0, genEdStats.coreTotal - 18);
        const langOverflow = Math.max(0, genEdStats.lang - 6);
        const genEdOverflow = Math.min(coreOverflow + langOverflow, 4);
        if (genEdOverflow > 0) {
            freeCredits += genEdOverflow;
            freeOverflowSources.push(`含通識/語言溢流 ${genEdOverflow}`);
        }

        // --- 5. Render Stats ---
        document.getElementById('totalCredits').innerText = totalCredits;
        document.getElementById('compulsoryCreditsDisplay').innerText = `${compulsoryCredits}`;

        document.getElementById('csElectiveCredits').innerText = `${csElectiveCredits}`;
        if (phyOverflow > 0 && csOverflow > 0) {
            document.getElementById('csOverflowMsg').innerText = `(含物理溢流 ${phyOverflow}；其中 ${csOverflow} 學分溢流至自由選修)`;
        } else if (phyOverflow > 0) {
            document.getElementById('csOverflowMsg').innerText = `(含物理溢流 ${phyOverflow})`;
        } else if (csOverflow > 0) {
            document.getElementById('csOverflowMsg').innerText = `(其中 ${csOverflow} 學分溢流至自由選修)`;
        } else {
            document.getElementById('csOverflowMsg').innerText = "";
        }

        document.getElementById('freeCredits').innerText = `${freeCredits}`;
        document.getElementById('freeOverflowSource').innerText = freeOverflowSources.join(', ');

        // --- Render Electives Detail Lists ---
        // Add overflow as synthetic entries so the list matches the summary totals.
        if (phyOverflow > 0) {
            csElectiveCourses.push({ name: '[溢流] 物理(一)(二) 超額併入專業選修', credit: phyOverflow, overflow: true });
        }
        if (csOverflow > 0) {
            freeElectiveCourses.push({ name: '[溢流] 專業選修超額轉入自由選修', credit: csOverflow, overflow: true });
        }
        if (genEdOverflow > 0) {
            freeElectiveCourses.push({ name: '[溢流] 核心/語言超額轉入自由選修', credit: genEdOverflow, overflow: true });
        }

        const csElectiveListDetail = document.getElementById('csElectiveListDetail');
        const freeElectiveListDetail = document.getElementById('freeElectiveListDetail');

        if (csElectiveListDetail) {
            csElectiveListDetail.innerHTML = csElectiveCourses
                .map(c => {
                    const nameClass = c.overflow ? 'text-gray-600 italic' : 'text-gray-800';
                    const creditClass = c.overflow ? 'text-gray-500 font-mono' : 'text-gray-600 font-mono';
                    return `<li class="flex justify-between gap-3"><span class="${nameClass}">${c.name}</span><span class="${creditClass}">${c.credit}</span></li>`;
                })
                .join('') || '<li class="text-gray-400">無</li>';
        }

        if (freeElectiveListDetail) {
            freeElectiveListDetail.innerHTML = freeElectiveCourses
                .map(c => {
                    const nameClass = c.overflow ? 'text-gray-600 italic' : 'text-gray-800';
                    const creditClass = c.overflow ? 'text-gray-500 font-mono' : 'text-gray-600 font-mono';
                    return `<li class="flex justify-between gap-3"><span class="${nameClass}">${c.name}</span><span class="${creditClass}">${c.credit}</span></li>`;
                })
                .join('') || '<li class="text-gray-400">無</li>';
        }

        // --- Render General Ed ---
        document.getElementById('coreTotalStatus').innerHTML = `<span class="${genEdStats.coreTotal >= 18 ? 'pass' : 'fail'}">${genEdStats.coreTotal} / 18</span>`;
        const corePercent = Math.min((genEdStats.coreTotal / 18) * 100, 100);
        document.getElementById('coreTotalBar').style.width = `${corePercent}%`;
        if (genEdStats.coreTotal >= 18) document.getElementById('coreTotalBar').classList.add('bg-green-500');

        document.getElementById('basicCount').innerHTML = `<span class="${genEdStats.basic >= 6 ? 'pass' : 'fail'}">${genEdStats.basic} / 6</span>`;
        document.getElementById('basicList').innerHTML = genEdLogs.basic.map(s => `<li><span class="badge badge-basic">基本</span>${s}</li>`).join('') || '<li class="text-gray-400">無</li>';

        document.getElementById('areaCount').innerHTML = `<span class="${genEdStats.area >= 8 ? 'pass' : 'fail'}">${genEdStats.area} / 8</span>`;
        document.getElementById('areaList').innerHTML = genEdLogs.area.map(s => `<li><span class="badge badge-area">領域</span>${s}</li>`).join('') || '<li class="text-gray-400">無</li>';

        document.getElementById('langTotalStatus').innerHTML = `<span class="${genEdStats.lang >= 6 ? 'pass' : 'fail'}">${genEdStats.lang} / 6</span>`;
        document.getElementById('langList').innerHTML = genEdLogs.lang.map(s => `<li><span class="badge badge-lang">語言</span>${s}</li>`).join('') || '<li class="text-gray-400">無</li>';

        // Render Science
        const scienceList = document.getElementById('scienceList');
        scienceList.innerHTML = `<li class="${sciCheck.calc >= 8 ? 'pass' : 'fail'}">微積分 (${sciCheck.calc}/8)</li>`;
        // 顯示判定結果
        scienceList.innerHTML += `<li class="${bestSci.credit >= 6 ? 'pass' : 'fail'}">三選一: ${bestSci.name} (${bestSci.credit}/6)</li>`;

        // Render Compulsory
        const compList = document.getElementById('compulsoryList');
        compList.innerHTML = '';
        for (const [course, passed] of Object.entries(compCheck)) {
            compList.innerHTML += `<li class="${passed ? 'pass' : 'fail'}">${passed ? '✔' : '✘'} ${course}</li>`;
        }
        compList.innerHTML += `<li class="${basicProgCheck ? 'pass' : 'fail'}">${basicProgCheck ? '✔' : '✘'} 基礎程式設計</li>`;

        document.getElementById('peStatus').innerHTML = `<span class="${peCount.size >= 6 ? 'pass' : 'fail'}">${peCount.size}/6</span>`;
        document.getElementById('serviceStatus').innerHTML = `<span class="${serviceCount >= 2 ? 'pass' : 'fail'}">${serviceCount}/2</span>`;
        document.getElementById('mentorStatus').innerHTML = `<span class="${mentorPassed ? 'pass' : 'fail'}">${mentorPassed ? '✔' : '✘'}</span>`;

        // --- 6. RENDER LOG TABLE ---
        const logBody = document.getElementById('courseLogBody');
        logBody.innerHTML = '';

        log.forEach(entry => {
            let category = "";
            let name = entry;
            let credit = "-";

            const catMatch = entry.match(/^\[(.*?)\]/);
            if (catMatch) {
                category = catMatch[1];
                name = entry.substring(catMatch[0].length).trim();
            }

            const creditMatch = name.match(/\s+\(([^)]+)\)$/);
            if (creditMatch) {
                credit = creditMatch[1];
                name = name.substring(0, creditMatch.index).trim();
            }

            let catStyle = "text-gray-500 bg-gray-100";
            if (category.includes("系必修")) catStyle = "text-blue-700 bg-blue-50 font-bold";
            else if (category.includes("專業") || category.includes("學程")) catStyle = "text-green-700 bg-green-50";
            else if (category.includes("基科")) catStyle = "text-teal-700 bg-teal-50";
            else if (category.includes("通識") || category.includes("語言")) catStyle = "text-orange-700 bg-orange-50";
            else if (category.includes("自由")) catStyle = "text-purple-700 bg-purple-50";
            else if (category.includes("抵免") || category.includes("免修")) catStyle = "text-pink-700 bg-pink-50 font-bold";
            else if (category.includes("軍訓")) catStyle = "text-gray-600 bg-gray-200";

            const row = `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="p-3">
                        <span class="px-2 py-1 rounded text-xs ${catStyle}">${category}</span>
                    </td>
                    <td class="p-3 text-gray-800 font-medium">${name}</td>
                    <td class="p-3 text-right text-gray-600 font-mono">${credit}</td>
                </tr>
            `;
            logBody.innerHTML += row;
        });

        // --- 7. RENDER SEVEN TOPICS ---
        const topicsContainer = document.getElementById('topicsContainer');
        topicsContainer.innerHTML = '';

        SEVEN_TOPICS.forEach(topic => {
            let takenCount = 0;
            let htmlList = '';

            topic.courses.forEach(courseReq => {
                const isTaken = checkCourseTaken(courseReq, userCourseNames);
                if (isTaken) takenCount++;

                let displayName = Array.isArray(courseReq) ? courseReq.join(" / ") : courseReq;

                htmlList += `
                    <li class="flex items-start mb-1 text-sm">
                        <span class="mr-2 ${isTaken ? 'text-green-600' : 'text-gray-300'}">${isTaken ? '✔' : '✘'}</span>
                        <span class="${isTaken ? 'text-gray-900 font-medium' : 'text-gray-400'}">${displayName}</span>
                    </li>
                `;
            });

            let isComplete = false;
            let statusText = "";

            if (topic.type === 'fixed') {
                isComplete = (takenCount >= topic.courses.length);
                statusText = `已修習: ${takenCount} / ${topic.courses.length} 門`;
            } else if (topic.type === 'pick4') {
                isComplete = (takenCount >= 4);
                statusText = `已修習: ${takenCount} / 4 門`;
            }

            const card = document.createElement('div');
            card.className = `section-card topic-card p-4 flex flex-col h-full ${isComplete ? 'topic-complete' : ''}`;

            card.innerHTML = `
                <div class="topic-header flex justify-between items-center ${isComplete ? 'text-blue-800' : 'text-gray-700'}">
                    <span>${topic.title}</span>
                    ${isComplete ? '<span class="text-xs bg-blue-600 text-white px-2 py-1 rounded">通過</span>' : ''}
                </div>
                <p class="text-xs text-gray-500 mb-3">${statusText}</p>
                <ul class="flex-grow">${htmlList}</ul>
                ${topic.note ? `<p class="text-xs text-gray-400 mt-2 border-t pt-1">${topic.note}</p>` : ''}
            `;
            topicsContainer.appendChild(card);
        });

        document.getElementById('result').classList.remove('hidden');

    } catch (e) {
        alert("解析發生錯誤，請檢查資料格式。\n錯誤訊息: " + e.message);
        console.error(e);
    }
}