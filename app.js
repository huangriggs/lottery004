/**
 * 熔岩巨響 - 火山地球儀作弊抽籤系統 Core Logic
 */

// ==========================================================================
// 1. STATE & GLOBAL CONFIGURATIONS
// ==========================================================================
let state = {
    students: [], // { seq: number, name: string, countryId: number }
    winners: [],  // { winSeq: number, seq: number, name: string, countryName: string, timestamp: string }
    currentWinner: null,
    secretWinnerId: null // Stores the rigged winner ID from hidden panel
};

// 102 Volcano countries with coordinates
const VOLCANO_COUNTRIES = [
    { id: 1, name: "台灣 (Taiwan)", lat: 25.0330, lon: 121.5654, volcano: "大屯火山群 (Tatun Group)" },
    { id: 2, name: "日本 (Japan)", lat: 35.3606, lon: 138.7274, volcano: "富士山 (Mount Fuji)" },
    { id: 3, name: "冰島 (Iceland)", lat: 64.9631, lon: -19.0208, volcano: "艾亞法拉火山 (Eyjafjallajökull)" },
    { id: 4, name: "印尼 (Indonesia)", lat: -0.7893, lon: 113.9213, volcano: "喀拉喀托火山 (Krakatoa)" },
    { id: 5, name: "菲律賓 (Philippines)", lat: 12.8797, lon: 121.7740, volcano: "馬榮火山 (Mayon Volcano)" },
    { id: 6, name: "義大利 (Italy)", lat: 41.8719, lon: 12.5674, volcano: "維蘇威火山 (Mount Vesuvius)" },
    { id: 7, name: "美國夏威夷 (Hawaii, USA)", lat: 19.4721, lon: -155.5922, volcano: "茂納洛亞火山 (Mauna Loa)" },
    { id: 8, name: "美國黃石 (Yellowstone, USA)", lat: 44.4280, lon: -110.5885, volcano: "黃石超級火山 (Yellowstone Caldera)" },
    { id: 9, name: "智利 (Chile)", lat: -35.6751, lon: -71.5430, volcano: "維利亞里卡火山 (Villarrica)" },
    { id: 10, name: "厄瓜多 (Ecuador)", lat: -1.8312, lon: -78.1834, volcano: "科托帕希火山 (Cotopaxi)" },
    { id: 11, name: "墨西哥 (Mexico)", lat: 23.6345, lon: -102.5528, volcano: "波波卡特佩特火山 (Popocatépetl)" },
    { id: 12, name: "希臘 (Greece)", lat: 39.0742, lon: 21.8243, volcano: "聖托里尼火山 (Santorini Caldera)" },
    { id: 13, name: "俄羅斯坎查加 (Kamchatka, Russia)", lat: 56.0564, lon: 160.6425, volcano: "克留切夫火山 (Klyuchevskaya)" },
    { id: 14, name: "紐西蘭 (New Zealand)", lat: -40.9006, lon: 174.8860, volcano: "陶波火山 (Taupo)" },
    { id: 15, name: "肯亞 (Kenya)", lat: -0.0236, lon: 37.9062, volcano: "隆戈諾特火山 (Mount Longonot)" },
    { id: 16, name: "坦尚尼亞 (Tanzania)", lat: -6.3690, lon: 34.8888, volcano: "吉力馬札羅山 (Kilimanjaro)" },
    { id: 17, name: "西班牙 (Spain)", lat: 40.4637, lon: -3.7492, volcano: "泰德火山 (Teide, Tenerife)" },
    { id: 18, name: "哥斯大黎加 (Costa Rica)", lat: 9.7489, lon: -83.7534, volcano: "阿雷納爾火山 (Arenal Volcano)" },
    { id: 19, name: "瓜地馬拉 (Guatemala)", lat: 15.7835, lon: -90.2308, volcano: "富埃戈火山 (Volcán de Fuego)" },
    { id: 20, name: "大溪地 (Tahiti)", lat: -17.6509, lon: -149.4260, volcano: "大溪地火山 (Mehetia)" },
    { id: 21, name: "南韓 (South Korea)", lat: 37.5665, lon: 126.9780, volcano: "漢拏山 (Mount Hallasan)" },
    { id: 22, name: "中國 (China)", lat: 35.8617, lon: 104.1954, volcano: "長白山火山 (Changbaishan)" },
    { id: 23, name: "越南 (Vietnam)", lat: 14.0583, lon: 108.2772, volcano: "大叻火山群 (Dalat Volcano)" },
    { id: 24, name: "泰國 (Thailand)", lat: 15.8700, lon: 100.9925, volcano: "帕農容火山 (Phanom Rung)" },
    { id: 25, name: "馬來西亞 (Malaysia)", lat: 4.2105, lon: 101.9758, volcano: "波馬巴萊火山 (Bombalai)" },
    { id: 26, name: "新加坡 (Singapore)", lat: 1.3521, lon: 103.8198, volcano: "武吉知馬 (Bukit Timah Hill)" },
    { id: 27, name: "印度 (India)", lat: 12.2780, lon: 93.8580, volcano: "巴倫島火山 (Barren Island)" },
    { id: 28, name: "澳大利亞 (Australia)", lat: -37.8480, lon: 140.7760, volcano: "甘比爾山 (Mount Gambier)" },
    { id: 29, name: "英國 (UK)", lat: 56.4000, lon: -5.0000, volcano: "格倫科火山 (Glen Coe)" },
    { id: 30, name: "法國 (France)", lat: 45.7725, lon: 2.9658, volcano: "圓頂山 (Puy de Dôme)" },
    { id: 31, name: "德國 (Germany)", lat: 50.4150, lon: 7.2630, volcano: "拉赫湖火山 (Laacher See)" },
    { id: 32, name: "加拿大 (Canada)", lat: 49.8500, lon: -123.0000, volcano: "加里波第山 (Mount Garibaldi)" },
    { id: 33, name: "巴西 (Brazil)", lat: -3.8500, lon: -32.4200, volcano: "諾羅尼亞火山 (Noronha)" },
    { id: 34, name: "南非 (South Africa)", lat: -46.9000, lon: 37.7500, volcano: "馬里恩島火山 (Marion Island)" },
    { id: 35, name: "埃及 (Egypt)", lat: 29.4180, lon: 30.7600, volcano: "卡特拉尼山 (Jebel Qatrani)" },
    { id: 36, name: "土耳其 (Turkey)", lat: 38.9637, lon: 35.2433, volcano: "哈桑山 (Mount Hasan)" },
    { id: 37, name: "沙烏地阿拉伯 (Saudi Arabia)", lat: 23.8859, lon: 45.0792, volcano: "海巴爾火山群 (Harrat Khaybar)" },
    { id: 38, name: "阿聯酋 (UAE)", lat: 23.4241, lon: 53.8478, volcano: "阿里山 (Jebel Ali)" },
    { id: 39, name: "以色列 (Israel)", lat: 31.0461, lon: 34.8516, volcano: "拉姆湖火山 (Birket Ram)" },
    { id: 40, name: "瑞士 (Switzerland)", lat: 46.8182, lon: 8.2275, volcano: "阿爾卑斯褶皺 (Alpine Fold)" },
    { id: 41, name: "荷蘭 (Netherlands)", lat: 52.1326, lon: 5.2913, volcano: "祖伊德瓦爾火山 (Zuidwal)" },
    { id: 42, name: "比利時 (Belgium)", lat: 50.5039, lon: 4.4699, volcano: "阿登高地 (Ardennes)" },
    { id: 43, name: "奧地利 (Austria)", lat: 47.5162, lon: 14.5501, volcano: "斯蒂里安盆地 (Styrian Basin)" },
    { id: 44, name: "葡萄牙 (Portugal)", lat: 39.3999, lon: -8.2245, volcano: "皮庫火山 (Mount Pico, Azores)" },
    { id: 45, name: "瑞典 (Sweden)", lat: 60.1282, lon: 18.6435, volcano: "斯堪尼亞火山 (Scania Volcano)" },
    { id: 46, name: "挪威 (Norway)", lat: 60.4720, lon: 8.4689, volcano: "貝倫貝格火山 (Beerenberg)" },
    { id: 47, name: "丹麥 (Denmark)", lat: 56.2639, lon: 9.5018, volcano: "日德蘭岩脈 (Jutland Dyke)" },
    { id: 48, name: "芬蘭 (Finland)", lat: 61.9241, lon: 25.7482, volcano: "拉努阿角閃岩 (Ranua)" },
    { id: 49, name: "波蘭 (Poland)", lat: 51.9194, lon: 19.1451, volcano: "奧斯特希卡山 (Ostrzyca)" },
    { id: 50, name: "捷克 (Czechia)", lat: 49.8175, lon: 15.4730, volcano: "鐵山火山 (Železná Hůrka)" },
    { id: 51, name: "匈牙利 (Hungary)", lat: 47.1625, lon: 19.5033, volcano: "巴拉頓高地 (Balaton Uplands)" },
    { id: 52, name: "烏克蘭 (Ukraine)", lat: 48.3794, lon: 31.1656, volcano: "外喀爾巴阡火山 (Transcarpathian)" },
    { id: 53, name: "阿根廷 (Argentina)", lat: -38.4161, lon: -63.6167, volcano: "多穆約火山 (Domuyo)" },
    { id: 54, name: "哥倫比亞 (Colombia)", lat: 4.5709, lon: -72.9301, volcano: "魯伊斯火山 (Nevado del Ruiz)" },
    { id: 55, name: "秘魯 (Peru)", lat: -9.1900, lon: -75.0152, volcano: "米斯蒂火山 (Misti)" },
    { id: 56, name: "委內瑞拉 (Venezuela)", lat: 6.4238, lon: -66.5897, volcano: "加勒比板塊 (Caribbean Plate)" },
    { id: 57, name: "玻利維亞 (Bolivia)", lat: -16.2902, lon: -63.5887, volcano: "薩哈馬火山 (Sajama)" },
    { id: 58, name: "烏拉圭 (Uruguay)", lat: -32.5228, lon: -55.7658, volcano: "克拉托尼克 (Cratonic Rift)" },
    { id: 59, name: "巴拉圭 (Paraguay)", lat: -23.4425, lon: -58.4438, volcano: "亞松森火山裂谷 (Asuncion Rift)" },
    { id: 60, name: "古巴 (Cuba)", lat: 21.5218, lon: -77.7812, volcano: "馬埃斯特拉山 (Sierra Maestra)" },
    { id: 61, name: "巴拿馬 (Panama)", lat: 8.5380, lon: -80.7821, volcano: "巴魯火山 (Volcan Baru)" },
    { id: 62, name: "宏都拉斯 (Honduras)", lat: 15.2000, lon: -86.2419, volcano: "埃爾蒂格雷火山 (Isla El Tigre)" },
    { id: 63, name: "摩洛哥 (Morocco)", lat: 31.7917, lon: -7.0926, volcano: "阿茲魯火山區 (Azrou)" },
    { id: 64, name: "阿爾及利亞 (Algeria)", lat: 28.0339, lon: 1.6596, volcano: "阿塔科爾火山區 (Atakor)" },
    { id: 65, name: "突尼西亞 (Tunisia)", lat: 33.8869, lon: 9.5375, volcano: "突尼斯海槽 (Gulf of Tunis)" },
    { id: 66, name: "衣索比亞 (Ethiopia)", lat: 9.1450, lon: 40.4897, volcano: "埃爾塔阿雷火山 (Erta Ale)" },
    { id: 67, name: "烏干達 (Uganda)", lat: 1.3733, lon: 32.2903, volcano: "卡特威-基科隆戈火山 (Katwe)" },
    { id: 68, name: "奈及利亞 (Nigeria)", lat: 9.0820, lon: 8.6753, volcano: "比烏高原火山區 (Biu Plateau)" },
    { id: 69, name: "加納 (Ghana)", lat: 7.9465, lon: -1.0232, volcano: "克薩尼盆地 (Kersantite)" },
    { id: 70, name: "塞內加爾 (Senegal)", lat: 14.4974, lon: -14.4524, volcano: "達卡火山區 (Dakar)" },
    { id: 71, name: "馬達加斯加 (Madagascar)", lat: -18.7669, lon: 46.8691, volcano: "安卡拉特拉火山 (Ankaratra)" },
    { id: 72, name: "愛爾蘭 (Ireland)", lat: 53.4129, lon: -8.2439, volcano: "卡林福德火山 (Carlingford)" },
    { id: 73, name: "羅馬尼亞 (Romania)", lat: 45.9432, lon: 24.9668, volcano: "喬馬杜火山 (Csomad)" },
    { id: 74, name: "保加利亞 (Bulgaria)", lat: 42.7339, lon: 25.4858, volcano: "科祖赫火山 (Kozhuh)" },
    { id: 75, name: "哈薩克 (Kazakhstan)", lat: 48.0196, lon: 66.9237, volcano: "裏海板塊 (Caspian)" },
    { id: 76, name: "烏茲別克 (Uzbekistan)", lat: 41.3775, lon: 64.5853, volcano: "天山岩脈 (Tian Shan)" },
    { id: 77, name: "巴基斯坦 (Pakistan)", lat: 30.3753, lon: 69.3451, volcano: "昌德拉古普泥火山 (Chandragup)" },
    { id: 78, name: "孟加拉 (Bangladesh)", lat: 23.6850, lon: 90.3563, volcano: "吉大港泥火山 (Chittagong)" },
    { id: 79, name: "斯里蘭卡 (Sri Lanka)", lat: 7.8731, lon: 80.7718, volcano: "塞基里亞 (Sigiriya)" },
    { id: 80, name: "尼泊爾 (Nepal)", lat: 28.3949, lon: 84.1240, volcano: "喜馬拉雅縫合帶 (Himalaya)" },
    { id: 81, name: "蒙古 (Mongolia)", lat: 47.7800, lon: 100.1500, volcano: "霍爾戈火山 (Khorgo)" },
    { id: 82, name: "伊朗 (Iran)", lat: 35.9500, lon: 52.1100, volcano: "達馬萬德山 (Mount Damavand)" },
    { id: 83, name: "伊拉克 (Iraq)", lat: 33.2232, lon: 43.6793, volcano: "米索不達米亞盆地 (Mesopotamia)" },
    { id: 84, name: "約旦 (Jordan)", lat: 32.1500, lon: 36.2500, volcano: "約旦東部火山區 (Jordanian Basalt)" },
    { id: 85, name: "斐濟 (Fiji)", lat: -16.8000, lon: 179.9800, volcano: "塔妙尼火山 (Taveuni)" },
    { id: 86, name: "巴布亞紐幾內亞 (PNG)", lat: -5.5000, lon: 150.8500, volcano: "塔烏魯火山 (Tavurvur)" },
    { id: 87, name: "薩摩亞 (Samoa)", lat: -13.6000, lon: -172.5000, volcano: "馬塔瓦努火山 (Matavanu)" },
    { id: 88, name: "湯加 (Tonga)", lat: -20.5400, lon: -175.3800, volcano: "洪加哈派火山 (Hunga Tonga)" },
    { id: 89, name: "牙買加 (Jamaica)", lat: 18.1096, lon: -77.2975, volcano: "藍山構造 (Blue Mountains)" },
    { id: 90, name: "巴哈馬 (Bahamas)", lat: 25.0343, lon: -77.3963, volcano: "巴哈馬地台 (Bahama Platform)" },
    { id: 91, name: "蘇丹 (Sudan)", lat: 12.9500, lon: 24.2700, volcano: "邁拉山火山 (Jebel Marra)" },
    { id: 92, name: "辛巴威 (Zimbabwe)", lat: -20.0000, lon: 30.0000, volcano: "大岩牆結構 (Great Dyke)" },
    { id: 93, name: "納米比亞 (Namibia)", lat: -21.1500, lon: 14.5800, volcano: "布蘭德山火山 (Brandberg)" },
    { id: 94, name: "安哥拉 (Angola)", lat: -12.5000, lon: 15.8000, volcano: "比耶高原 (Bie Plateau)" },
    { id: 95, name: "剛果民主共和國 (DR Congo)", lat: -1.5200, lon: 29.2500, volcano: "尼拉貢戈火山 (Nyiragongo)" },
    { id: 96, name: "模里西斯 (Mauritius)", lat: -20.3000, lon: 57.5000, volcano: "鹿洞火山 (Trou aux Cerfs)" },
    { id: 97, name: "愛沙尼亞 (Estonia)", lat: 58.5953, lon: 25.0136, volcano: "波羅的地盾 (Baltic Shield)" },
    { id: 98, name: "克羅埃西亞 (Croatia)", lat: 45.1000, lon: 15.2000, volcano: "迪納拉山脈 (Dinarides)" },
    { id: 99, name: "塞爾維亞 (Serbia)", lat: 43.7000, lon: 20.6000, volcano: "奧斯特里察火山 (Ostrical)" },
    { id: 100, name: "斯洛伐克 (Slovakia)", lat: 48.6300, lon: 19.3800, volcano: "波拉納火山 (Polana)" },
    { id: 101, name: "立陶宛 (Lithuania)", lat: 55.1694, lon: 23.8813, volcano: "波羅的克拉通 (Baltic Craton)" },
    { id: 102, name: "拉脫維亞 (Latvia)", lat: 56.8796, lon: 24.6032, volcano: "東歐平原地盾 (East European Shield)" }
];

const DEFAULT_STUDENTS = [
    { seq: 1, name: "張志豪", countryId: 1 }, { seq: 2, name: "林雅婷", countryId: 2 },
    { seq: 3, name: "陳冠宇", countryId: 3 }, { seq: 4, name: "黃淑芬", countryId: 4 },
    { seq: 5, name: "張美玲", countryId: 5 }, { seq: 6, name: "劉建宏", countryId: 6 },
    { seq: 7, name: "王俐婷", countryId: 7 }, { seq: 8, name: "蔡哲宇", countryId: 8 },
    { key: 9, seq: 9, name: "楊秀英", countryId: 9 }, { seq: 10, name: "陳俊傑", countryId: 10 },
    { seq: 11, name: "賴威廷", countryId: 1 }, { seq: 12, name: "林建國", countryId: 2 },
    { seq: 13, name: "許家豪", countryId: 3 }, { seq: 14, name: "吳淑貞", countryId: 4 },
    { seq: 15, name: "曾冠廷", countryId: 5 }
];

// Helper to save and load state
function loadState() {
    const saved = localStorage.getItem('volcano_lucky_draw_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error('解析儲存狀態失敗，載入預設資料', e);
            initDefaultState();
        }
    } else {
        initDefaultState();
    }
    
    // Ensure state fields are present
    if (!state.students) state.students = [];
    if (!state.winners) state.winners = [];
    state.currentWinner = null;
    state.secretWinnerId = null;
    
    updateStatsUI();
}

function initDefaultState() {
    const students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    students.forEach(s => {
        s.countryId = Math.floor(Math.random() * VOLCANO_COUNTRIES.length) + 1;
    });
    state.students = students;
    state.winners = [];
    saveState();
}

function saveState() {
    localStorage.setItem('volcano_lucky_draw_state', JSON.stringify(state));
    updateStatsUI();
}

function getActivePool() {
    const winnerSeqs = state.winners.map(w => w.seq);
    return state.students.filter(s => !winnerSeqs.includes(s.seq));
}

// Coordinate conversions (Lat/Lon -> 3D Vector)
// Sphere radius is 40 units
const GLOBE_RADIUS = 40;
function latLonToVector3(lat, lon, radius) {
    const phi = lat * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    
    // Align projection coordinates exactly with Three.js sphere UV wrapping
    const x = radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
}

// ==========================================================================
// 2. THREE.JS 3D GLOBE ENGINE
// ==========================================================================
let scene, camera, renderer, controls;
let globeMesh, atmosphereMesh, earthMaterial;
let starsPoints;
let volcanoMeshes = {}; // countryId -> THREE.Group (containing cone and glow)
let activeParticles = []; // Pool of lava particles
let activeShockwaves = []; // Pool of expanding rings
let particleSystem; // THREE.Points container for lava
let particleGeometry;
let particleCount = 400;

// Camera Tween State
let isTweeningCamera = false;
let tweenStartPos = new THREE.Vector3();
let tweenEndPos = new THREE.Vector3();
let tweenStartLook = new THREE.Vector3();
let tweenEndLook = new THREE.Vector3();
let tweenProgress = 0;
let tweenDuration = 2000; // ms
let currentLookTarget = new THREE.Vector3(0, 0, 0);

// Screen/Camera Shake
let shakeIntensity = 0;
let baseGlobeRotationSpeed = 0.001;
let currentGlobeRotationSpeed = 0.001;

function init3D() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Render
    scene = new THREE.Scene();
    
    // Bright ambient fog matching macaron background
    scene.fog = new THREE.FogExp2(0xe0f2fe, 0.001);

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 0, 110);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.enablePan = false;

    // 2. Lights (Brightened for light theme)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight1.position.set(100, 100, 50);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xbbdefb, 0.4);
    dirLight2.position.set(-100, -50, -50);
    scene.add(dirLight2);

    // Glowing PointLight near camera for highlight
    const camLight = new THREE.PointLight(0xff5722, 0.4, 200);
    camera.add(camLight);
    scene.add(camera);

    // 3. Floating Colorful Bokeh Particles
    const starsGeom = new THREE.BufferGeometry();
    const starsPos = [];
    const starsColors = [];
    for (let i = 0; i < 400; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const dist = 150 + Math.random() * 300;
        
        starsPos.push(
            dist * Math.sin(phi) * Math.cos(theta),
            dist * Math.sin(phi) * Math.sin(theta),
            dist * Math.cos(phi)
        );

        // Macaron soft colors: pastel pink, blue, yellow, and green
        const rand = Math.random();
        if (rand < 0.25) {
            starsColors.push(0.98, 0.8, 0.85); // Pastel Pink
        } else if (rand < 0.5) {
            starsColors.push(0.8, 0.92, 0.98); // Pastel Blue
        } else if (rand < 0.75) {
            starsColors.push(0.99, 0.95, 0.75); // Pastel Yellow
        } else {
            starsColors.push(0.8, 0.95, 0.88); // Pastel Mint
        }
    }
    starsGeom.setAttribute('position', new THREE.Float32BufferAttribute(starsPos, 3));
    starsGeom.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    
    const starsMat = new THREE.PointsMaterial({
        size: 7.0, // Large floating bubbles
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        sizeAttenuation: true
    });
    starsPoints = new THREE.Points(starsGeom, starsMat);
    scene.add(starsPoints);

    // 4. Globe Sphere & Texture (Bright earth style)
    const globeGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    
    earthMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0f2fe, // bright pastel blue base
        roughness: 0.5,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9
    });
    globeMesh = new THREE.Mesh(globeGeom, earthMaterial);
    scene.add(globeMesh);

    // Grid Overlay for Holographic look
    const gridGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.05, 32, 32);
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x90caf9, // soft blue grid lines
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const gridMesh = new THREE.Mesh(gridGeom, gridMat);
    globeMesh.add(gridMesh);

    // Try loading a bright earth texture from CDN
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
        (texture) => {
            earthMaterial.map = texture;
            earthMaterial.color.setHex(0xffffff); // reset base color
            earthMaterial.roughness = 0.4;
            earthMaterial.opacity = 0.98;
            earthMaterial.needsUpdate = true;
        },
        undefined,
        (err) => {
            console.warn("無法加載地球明亮貼圖，啟用全彩全息網格模式。");
            earthMaterial.color.setHex(0xe3f2fd);
            earthMaterial.wireframe = false;
            gridMat.opacity = 0.35;
        }
    );

    // 5. Orange Volcanic Atmosphere Glow
    const atmosphereGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 32, 32);
    const atmosphereMat = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
                gl_FragColor = vec4(0.35, 0.75, 1.0, 1.0) * intensity * 0.8; // soft sky-blue glow
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });
    atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    scene.add(atmosphereMesh);

    // 6. Initialize Lava Particles
    initLavaParticleSystem();

    // 7. Raycasting / Mouse Handlers
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onMouseClick);
    window.addEventListener('resize', onWindowResize);

    // Build volcanoes pins
    rebuildVolcanoes();

    // Start render loop
    animate();
}

// Build volcano pins for active countries
function rebuildVolcanoes() {
    // Clear old volcanoes mesh
    Object.keys(volcanoMeshes).forEach(id => {
        globeMesh.remove(volcanoMeshes[id]);
    });
    volcanoMeshes = {};

    const activePool = getActivePool();
    
    // Group active students by countryId
    const countryStudentsMap = {};
    activePool.forEach(student => {
        if (!countryStudentsMap[student.countryId]) {
            countryStudentsMap[student.countryId] = [];
        }
        countryStudentsMap[student.countryId].push(student);
    });

    VOLCANO_COUNTRIES.forEach(country => {
        const studentsInCountry = countryStudentsMap[country.id] || [];
        const hasStudents = studentsInCountry.length > 0;

        // Volcano container
        const group = new THREE.Group();
        const pinPos = latLonToVector3(country.lat, country.lon, GLOBE_RADIUS);
        group.position.copy(pinPos);

        // Align pin outward
        const normal = pinPos.clone().normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        group.setRotationFromQuaternion(quaternion);

        // Volcano Cone Mesh
        const height = 2.2;
        const radius = 0.8;
        const coneGeom = new THREE.ConeGeometry(radius, height, 8);
        // Translate geometry so bottom sits on sphere
        coneGeom.translate(0, height / 2, 0);

        // Active volcano glows hot orange/red, inactive/dormant is bright slate gray
        const color = hasStudents ? 0xff4500 : 0xcfd8dc; // bright slate grey
        const emissive = hasStudents ? 0xff1100 : 0x000000;
        
        const coneMat = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.5,
            metalness: 0.5,
            emissive: emissive,
            emissiveIntensity: hasStudents ? 1.0 : 0.0
        });

        const coneMesh = new THREE.Mesh(coneGeom, coneMat);
        coneMesh.name = `volcano-cone-${country.id}`;
        // Store custom data on mesh for raycaster
        coneMesh.userData = { countryId: country.id, hasStudents: hasStudents };
        group.add(coneMesh);

        // Glowing cap or smoke ring for active ones
        if (hasStudents) {
            const glowGeom = new THREE.SphereGeometry(radius * 0.9, 8, 8);
            glowGeom.translate(0, height, 0);
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 0.8
            });
            const glowMesh = new THREE.Mesh(glowGeom, glowMat);
            glowMesh.name = `glow-cap`;
            group.add(glowMesh);
        }

        globeMesh.add(group);
        volcanoMeshes[country.id] = group;
    });

    // Populate country pills grid list in HTML panel
    populateCountriesGrid(countryStudentsMap);
}

// Particle System for volcano lava eruptions
function initLavaParticleSystem() {
    particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 4); // RGBA
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        // Place particles initially hidden deep inside Earth
        positions[i*3] = 0;
        positions[i*3+1] = -500;
        positions[i*3+2] = 0;

        colors[i*4] = 1.0;     // R
        colors[i*4+1] = 0.5;   // G
        colors[i*4+2] = 0.0;   // B
        colors[i*4+3] = 0.0;   // A (alpha, initially zero)

        sizes[i] = 0.0;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for glowing circles
    const particleMat = new THREE.ShaderMaterial({
        vertexShader: `
            attribute vec4 color;
            attribute float size;
            varying vec4 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec4 vColor;
            void main() {
                // Circle shape
                float dist = length(gl_PointCoord - vec2(0.5, 0.5));
                if (dist > 0.5) discard;
                
                // Soft glow edge
                float alpha = smoothstep(0.5, 0.1, dist) * vColor.a;
                gl_FragColor = vec4(vColor.rgb, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particleGeometry, particleMat);
    scene.add(particleSystem);
}

// Trigger particle eruption at country coordinate
function triggerVisualEruption(countryId) {
    const country = VOLCANO_COUNTRIES.find(c => c.id === countryId);
    if (!country) return;

    // Get current world position of the volcano group
    const basePos = new THREE.Vector3();
    const targetVolcanoGroup = volcanoMeshes[countryId];
    if (targetVolcanoGroup) {
        targetVolcanoGroup.getWorldPosition(basePos);
    } else {
        basePos.copy(latLonToVector3(country.lat, country.lon, GLOBE_RADIUS));
    }

    const normal = basePos.clone().normalize();
    const volcanoTip = basePos.clone().addScaledVector(normal, 2.2); // eruption point (volcano tip)

    // 1. Spawning Particles
    // Find index ranges to reuse in the particle pool
    let spawned = 0;
    const countToSpawn = 300;
    const positions = particleGeometry.attributes.position.array;
    const colors = particleGeometry.attributes.color.array;
    const sizes = particleGeometry.attributes.size.array;

    for (let i = 0; i < particleCount; i++) {
        if (spawned >= countToSpawn) break;
        
        // If particle is dead (alpha <= 0), reuse it
        if (colors[i*4+3] <= 0) {
            // Initial position: volcano tip
            positions[i*3] = volcanoTip.x;
            positions[i*3+1] = volcanoTip.y;
            positions[i*3+2] = volcanoTip.z;

            // Velocity: along normal + random dispersion
            const speed = 10 + Math.random() * 25;
            const velocity = normal.clone()
                .add(new THREE.Vector3(
                    (Math.random() - 0.5) * 0.6,
                    (Math.random() - 0.5) * 0.6,
                    (Math.random() - 0.5) * 0.6
                ))
                .normalize()
                .multiplyScalar(speed);

            // Lava colors: white -> yellow -> orange -> red -> grey smoke
            let r = 1.0, g = 0.9, b = 0.2;
            const randType = Math.random();
            if (randType < 0.2) {
                // High temperature spark (yellow/white)
                r = 1.0; g = 1.0; b = 0.8;
            } else if (randType < 0.6) {
                // Hot magma (orange)
                r = 1.0; g = 0.5; b = 0.0;
            } else {
                // Red glowing lava
                r = 1.0; g = 0.1; b = 0.0;
            }

            colors[i*4] = r;
            colors[i*4+1] = g;
            colors[i*4+2] = b;
            colors[i*4+3] = 1.0; // alpha full

            sizes[i] = 4.0 + Math.random() * 8.0;

            activeParticles.push({
                index: i,
                velocity: velocity,
                life: 1.0 + Math.random() * 1.8,
                maxLife: 2.8,
                type: randType < 0.85 ? 'lava' : 'smoke'
            });

            spawned++;
        }
    }

    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.color.needsUpdate = true;
    particleGeometry.attributes.size.needsUpdate = true;

    // 2. Spawn Expanding Shockwave Ring on globe surface
    const ringGeom = new THREE.RingGeometry(0.1, 1.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    
    // Position slightly above surface to prevent z-fighting
    ringMesh.position.copy(basePos).addScaledVector(normal, 0.2);
    
    // Rotate ring to align with sphere surface
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    ringMesh.setRotationFromQuaternion(quaternion);
    
    scene.add(ringMesh);
    activeShockwaves.push({
        mesh: ringMesh,
        material: ringMat,
        scale: 0.1,
        speed: 16.0,
        maxScale: 25.0
    });

    // 3. Screen Eruption Flash and Page Vibrations
    document.getElementById('flash-overlay').classList.remove('flash-effect');
    void document.getElementById('flash-overlay').offsetWidth; // force reflow
    document.getElementById('flash-overlay').classList.add('flash-effect');

    document.querySelector('.app-container').classList.remove('shake-effect');
    void document.querySelector('.app-container').offsetWidth; // force reflow
    document.querySelector('.app-container').classList.add('shake-effect');
    
    // End page vibration after 2 seconds
    setTimeout(() => {
        document.querySelector('.app-container').classList.remove('shake-effect');
    }, 2000);

    // 3D camera shake intensity
    shakeIntensity = 2.5;
}

// Particle pool update logic
function updateParticles(dt) {
    if (activeParticles.length === 0) return;

    const positions = particleGeometry.attributes.position.array;
    const colors = particleGeometry.attributes.color.array;
    const sizes = particleGeometry.attributes.size.array;

    const gravityConstant = 12.0; // Gravity pulling back to center

    for (let j = activeParticles.length - 1; j >= 0; j--) {
        const p = activeParticles[j];
        const idx = p.index;

        p.life -= dt;

        if (p.life <= 0) {
            // Dead: Hide particle
            colors[idx*4+3] = 0.0;
            positions[idx*3] = 0;
            positions[idx*3+1] = -500;
            positions[idx*3+2] = 0;
            sizes[idx] = 0.0;
            
            activeParticles.splice(j, 1);
        } else {
            // Update Position
            positions[idx*3] += p.velocity.x * dt;
            positions[idx*3+1] += p.velocity.y * dt;
            positions[idx*3+2] += p.velocity.z * dt;

            // Gravity: pull towards globe center (0,0,0)
            const curPos = new THREE.Vector3(positions[idx*3], positions[idx*3+1], positions[idx*3+2]);
            const pullDir = curPos.clone().normalize().negate();
            p.velocity.addScaledVector(pullDir, gravityConstant * dt);

            // Friction/Drag
            p.velocity.multiplyScalar(0.97);

            // Color Transition
            const lifeRatio = p.life / 2.5; // normalized 0-1
            if (p.type === 'lava') {
                if (lifeRatio > 0.6) {
                    // Magma glowing orange
                    colors[idx*4] = 1.0;
                    colors[idx*4+1] = 0.5 + 0.4 * ((lifeRatio-0.6)/0.4);
                    colors[idx*4+2] = 0.0;
                } else if (lifeRatio > 0.2) {
                    // Decay to dark red
                    colors[idx*4] = 1.0;
                    colors[idx*4+1] = 0.5 * (lifeRatio/0.6);
                    colors[idx*4+2] = 0.0;
                } else {
                    // Cool to ash gray smoke
                    colors[idx*4] = 0.3 * (lifeRatio/0.2);
                    colors[idx*4+1] = 0.3 * (lifeRatio/0.2);
                    colors[idx*4+2] = 0.3 * (lifeRatio/0.2);
                }
            } else {
                // Smoke
                colors[idx*4] = 0.4;
                colors[idx*4+1] = 0.4;
                colors[idx*4+2] = 0.4;
            }

            colors[idx*4+3] = Math.max(0.0, lifeRatio); // fade out
            sizes[idx] = (4.0 + 8.0 * lifeRatio) * (1 + (1-lifeRatio)*1.5); // expand slightly as it cools
        }
    }

    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.color.needsUpdate = true;
    particleGeometry.attributes.size.needsUpdate = true;
}

// Shockwave update logic
function updateShockwaves(dt) {
    for (let i = activeShockwaves.length - 1; i >= 0; i--) {
        const ring = activeShockwaves[i];
        ring.scale += ring.speed * dt;
        ring.mesh.scale.set(ring.scale, ring.scale, 1);
        ring.material.opacity = Math.max(0, 1.0 - (ring.scale / ring.maxScale));

        if (ring.scale >= ring.maxScale) {
            scene.remove(ring.mesh);
            ring.mesh.geometry.dispose();
            ring.mesh.material.dispose();
            activeShockwaves.splice(i, 1);
        }
    }
}

// Smooth camera focus panning
function startCameraFocusTween(targetCountryId) {
    const country = VOLCANO_COUNTRIES.find(c => c.id === targetCountryId);
    if (!country) return;

    initAudio();

    // Stop globe rotation to lock the volcano's position in world space
    currentGlobeRotationSpeed = 0;

    // Get current world position of the volcano group
    const targetVolcanoGroup = volcanoMeshes[targetCountryId];
    const worldPos = new THREE.Vector3();
    if (targetVolcanoGroup) {
        targetVolcanoGroup.getWorldPosition(worldPos);
    } else {
        worldPos.copy(latLonToVector3(country.lat, country.lon, GLOBE_RADIUS));
    }

    const normal = worldPos.clone().normalize();
    const distance = 80;

    // Position camera along the normal vector from the center
    const targetCamPos = normal.clone().multiplyScalar(distance);
    // Add a slight tilt upward along Y
    targetCamPos.y += 12;
    targetCamPos.normalize().multiplyScalar(distance);

    tweenStartPos.copy(camera.position);
    tweenEndPos.copy(targetCamPos);
    
    tweenStartLook.copy(currentLookTarget);
    tweenEndLook.copy(worldPos);

    tweenProgress = 0;
    isTweeningCamera = true;
    controls.enabled = false;
}

// Raycasting hover state
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredVolcanoId = null;

function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Test intersections against volcano cones
    const cones = [];
    Object.keys(volcanoMeshes).forEach(id => {
        const cone = volcanoMeshes[id].getObjectByName(`volcano-cone-${id}`);
        if (cone) cones.push(cone);
    });

    const intersects = raycaster.intersectObjects(cones);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const hitCone = intersects[0].object;
        const countryId = hitCone.userData.countryId;

        // Visual hover pulse
        if (hoveredVolcanoId !== countryId) {
            resetHoveredVolcano();
            hoveredVolcanoId = countryId;
            hitCone.material.emissiveIntensity = 2.2;
            
            // Show Tooltip
            const country = VOLCANO_COUNTRIES.find(c => c.id === countryId);
            const activePool = getActivePool();
            const studentsInCountry = activePool.filter(s => s.countryId === countryId).map(s => s.name);
            
            const tooltip = document.getElementById('globe-tooltip');
            tooltip.querySelector('.tooltip-country').textContent = `🌋 ${country.name} - ${country.volcano}`;
            
            const listEl = document.getElementById('tooltip-students-list');
            if (studentsInCountry.length > 0) {
                listEl.textContent = studentsInCountry.join('、');
                tooltip.querySelector('.tooltip-students-label').textContent = `待抽候選名單 (${studentsInCountry.length}人)：`;
            } else {
                listEl.textContent = '此國無候選名單或已全部中獎';
                tooltip.querySelector('.tooltip-students-label').textContent = '';
            }

            tooltip.classList.remove('hide');
        }

        // Position tooltip near cursor
        const tooltip = document.getElementById('globe-tooltip');
        tooltip.style.left = `${event.clientX}px`;
        tooltip.style.top = `${event.clientY}px`;

    } else {
        document.body.style.cursor = 'default';
        if (hoveredVolcanoId !== null) {
            resetHoveredVolcano();
            document.getElementById('globe-tooltip').classList.add('hide');
        }
    }
}

function resetHoveredVolcano() {
    if (hoveredVolcanoId !== null) {
        const group = volcanoMeshes[hoveredVolcanoId];
        if (group) {
            const cone = group.getObjectByName(`volcano-cone-${hoveredVolcanoId}`);
            if (cone && cone.userData.hasStudents) {
                cone.material.emissiveIntensity = 1.0;
            } else if (cone) {
                cone.material.emissiveIntensity = 0.0;
            }
        }
        hoveredVolcanoId = null;
    }
}

function onMouseClick(event) {
    if (isDrawing || isTweeningCamera) return;

    raycaster.setFromCamera(mouse, camera);

    const cones = [];
    Object.keys(volcanoMeshes).forEach(id => {
        const cone = volcanoMeshes[id].getObjectByName(`volcano-cone-${id}`);
        if (cone) cones.push(cone);
    });

    const intersects = raycaster.intersectObjects(cones);

    if (intersects.length > 0) {
        const hitCone = intersects[0].object;
        const countryId = hitCone.userData.countryId;
        
        // Smooth pan camera to volcano
        startCameraFocusTween(countryId);
    }
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Animation loop
let lastTime = 0;
function animate(time) {
    requestAnimationFrame(animate);

    if (!lastTime) lastTime = time;
    let dt = (time - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1; // clamp delta
    lastTime = time;

    // 1. Slow idle rotation or rapid drawing spin
    if (!isTweeningCamera) {
        globeMesh.rotation.y += currentGlobeRotationSpeed;
    }

    // 2. Starfield slow rotation
    if (starsPoints) {
        starsPoints.rotation.y -= 0.0002;
    }

    // 3. Handle camera panning tween
    if (isTweeningCamera) {
        tweenProgress += dt * 1000;
        let t = Math.min(1.0, tweenProgress / tweenDuration);
        
        // Cubic ease out
        let easeT = 1 - Math.pow(1 - t, 3);

        camera.position.lerpVectors(tweenStartPos, tweenEndPos, easeT);
        currentLookTarget.lerpVectors(tweenStartLook, tweenEndLook, easeT);
        camera.lookAt(currentLookTarget);

        if (t >= 1.0) {
            isTweeningCamera = false;
            controls.enabled = true;
            controls.target.copy(currentLookTarget);
            
            // Eruption triggers!
            if (isDrawing && state.currentWinner) {
                executeVolcanicEruption();
            }
        }
    } else {
        controls.update();
    }

    // 4. Update 3D Shake
    if (shakeIntensity > 0.01) {
        camera.position.x += (Math.random() - 0.5) * shakeIntensity;
        camera.position.y += (Math.random() - 0.5) * shakeIntensity;
        camera.position.z += (Math.random() - 0.5) * shakeIntensity;
        shakeIntensity *= 0.92; // decay shake
    }

    // 5. Particles & Rings Update
    updateParticles(dt);
    updateShockwaves(dt);

    renderer.render(scene, camera);
}

// ==========================================================================
// 3. WEB AUDIO API SYNTHESIZER (火山爆發與和弦合成)
// ==========================================================================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Web Audio API Volcano Sound Synthesizer
function playVolcanoEruptionSound() {
    try {
        initAudio();
        const now = audioCtx.currentTime;

        // 1. Explosion Deep Rumble (Low frequency filtered white noise)
        const bufferSize = audioCtx.sampleRate * 4.5; // 4.5 seconds
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const lpFilter = audioCtx.createBiquadFilter();
        lpFilter.type = 'lowpass';
        // Cutoff swept from high (~400Hz) down to deep bass (~20Hz)
        lpFilter.frequency.setValueAtTime(450, now);
        lpFilter.frequency.exponentialRampToValueAtTime(30, now + 3.5);

        const rumbleGain = audioCtx.createGain();
        rumbleGain.gain.setValueAtTime(0.01, now);
        rumbleGain.gain.linearRampToValueAtTime(0.9, now + 0.15); // explosive rise
        rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 4.2); // long rumble decay

        whiteNoise.connect(lpFilter);
        lpFilter.connect(rumbleGain);
        rumbleGain.connect(audioCtx.destination);
        whiteNoise.start(now);

        // 2. High-Frequency Gas Eruption / Magma crackles
        const crackleNoise = audioCtx.createBufferSource();
        crackleNoise.buffer = noiseBuffer;

        const hpFilter = audioCtx.createBiquadFilter();
        hpFilter.type = 'highpass';
        hpFilter.frequency.value = 1500;

        const crackleGain = audioCtx.createGain();
        crackleGain.gain.setValueAtTime(0, now);
        crackleGain.gain.linearRampToValueAtTime(0.12, now + 0.2);
        crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        crackleNoise.connect(hpFilter);
        hpFilter.connect(crackleGain);
        crackleGain.connect(audioCtx.destination);
        crackleNoise.start(now);

        // 3. Triumphant Fanfare Synthesizer (Starts 1.0s into the eruption)
        // Brass synthesizer chord using C Major Triads
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
        const delayStart = 0.8;

        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            // Rich saw wave for synth brass
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + delayStart);

            // Slight low-pass filtering for synth warmth
            const brassFilter = audioCtx.createBiquadFilter();
            brassFilter.type = 'lowpass';
            brassFilter.frequency.setValueAtTime(3000, now + delayStart);
            brassFilter.frequency.exponentialRampToValueAtTime(800, now + delayStart + 1.5);

            // Vibrato LFO for stereophonic chorus feel
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            lfo.frequency.value = 5.5 + idx * 0.2; // slight frequency deviation
            lfoGain.gain.value = 3; 
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            osc.connect(brassFilter);
            brassFilter.connect(gain);
            gain.connect(audioCtx.destination);

            // Envelope: ramp up, long glorious sustain, exponential decay
            gain.gain.setValueAtTime(0, now + delayStart);
            gain.gain.linearRampToValueAtTime(0.08, now + delayStart + 0.15); // smooth attack
            gain.gain.setValueAtTime(0.08, now + delayStart + 1.2);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + delayStart + 2.8);

            lfo.start(now + delayStart);
            osc.start(now + delayStart);

            lfo.stop(now + delayStart + 2.8);
            osc.stop(now + delayStart + 2.8);
        });

    } catch (e) {
        console.warn('音效合成播放失敗', e);
    }
}

// Rolling Tick (woodblock click)
function playTickSound() {
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.04);
        
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
        // fail silently
    }
}

// ==========================================================================
// 4. LUCKY DRAW LOGIC & RIGGING ENGINE (作弊引擎)
// ==========================================================================
let isDrawing = false;
let cheatBuffer = '';
let lastCheatTime = 0;

// Stealth keypress capture
window.addEventListener('keydown', (e) => {
    // Prevent capturing digit cheats when user is typing inside configuration textareas or fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
    }
    
    // Check if key is numeric [0-9]
    if (e.key >= '0' && e.key <= '9') {
        const now = Date.now();
        // Reset buffer if idle for 3 seconds
        if (now - lastCheatTime > 3000) {
            cheatBuffer = '';
        }
        cheatBuffer += e.key;
        lastCheatTime = now;
        
        // Light up stealth-indicator dot on screen subtly as feedback for rigging
        const indicator = document.getElementById('stealth-indicator');
        indicator.classList.add('locked');
        
        console.log('Rigging buffer sequence updated:', cheatBuffer);
    }
});

// Setup brand logo double-click to unlock secret rigging panel
let brandClicks = 0;
let lastBrandClickTime = 0;
document.getElementById('brand-logo-area').addEventListener('click', () => {
    const now = Date.now();
    if (now - lastBrandClickTime > 1500) {
        brandClicks = 0;
    }
    brandClicks++;
    lastBrandClickTime = now;

    if (brandClicks >= 5) {
        brandClicks = 0;
        openSecretPanel();
    }
});

function openSecretPanel() {
    const modal = document.getElementById('secret-panel');
    const select = document.getElementById('select-next-winner');
    
    // Populate active pool candidates in dropdown
    select.innerHTML = '<option value="">-- 隨機抽籤 (正常模式) --</option>';
    const activePool = getActivePool();
    activePool.forEach(student => {
        const country = VOLCANO_COUNTRIES.find(c => c.id === student.countryId);
        const countryName = country ? country.name : "未知國家";
        
        const option = document.createElement('option');
        option.value = student.seq;
        option.textContent = `#${student.seq} ${student.name} (${countryName})`;
        if (state.secretWinnerId === student.seq) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    updateSecretStatusUI();
    modal.classList.remove('hide');
    modal.classList.add('show');
}

function updateSecretStatusUI() {
    const statusText = document.getElementById('secret-status-text');
    if (state.secretWinnerId) {
        const target = state.students.find(s => s.seq === state.secretWinnerId);
        if (target) {
            statusText.textContent = `🎯 鎖定必中: #${target.seq} ${target.name}`;
            statusText.className = 'text-cyan';
            return;
        }
    }
    statusText.textContent = '正常隨機';
    statusText.className = 'text-green';
}

document.getElementById('btn-close-secret').addEventListener('click', () => {
    document.getElementById('secret-panel').classList.remove('show');
    setTimeout(() => document.getElementById('secret-panel').classList.add('hide'), 300);
});

document.getElementById('btn-save-secret').addEventListener('click', () => {
    const val = document.getElementById('select-next-winner').value;
    state.secretWinnerId = val ? parseInt(val) : null;
    
    // Stealth HUD indicator update
    const indicator = document.getElementById('stealth-indicator');
    if (state.secretWinnerId) {
        indicator.classList.add('locked');
    } else {
        indicator.classList.remove('locked');
    }
    
    document.getElementById('secret-panel').classList.remove('show');
    setTimeout(() => document.getElementById('secret-panel').classList.add('hide'), 300);
});

// Trigger Volcano Draw
function startDraw() {
    if (isDrawing) return;

    const activePool = getActivePool();
    if (state.students.length === 0) {
        alert('請先在名單管理頁面中新增或上傳名單！');
        return;
    }
    if (activePool.length === 0) {
        alert('所有人均已中獎！請點擊「重置抽籤狀態」以重啟火山。');
        return;
    }

    isDrawing = true;
    state.currentWinner = null;
    
    // UI adjustments
    document.getElementById('btn-draw').disabled = true;
    document.getElementById('status-text').textContent = '🌋 火山劇烈晃動！地底岩漿翻騰中...';
    document.getElementById('status-text').previousElementSibling.className = 'status-dot pulsing-red';
    document.getElementById('reveal-popup').classList.add('hide');

    // Globe spin animation speed-up
    currentGlobeRotationSpeed = 0.25;

    // 1. Rigging selection
    let winner = null;

    // Check hidden panel rigging first
    if (state.secretWinnerId) {
        const rigged = state.students.find(s => s.seq === state.secretWinnerId);
        if (rigged && activePool.some(s => s.seq === rigged.seq)) {
            winner = rigged;
        }
        state.secretWinnerId = null; // clear it immediately
    }

    // Check keyboard buffer rigging next
    if (!winner && cheatBuffer !== '') {
        const targetSeq = parseInt(cheatBuffer);
        const rigged = state.students.find(s => s.seq === targetSeq);
        if (rigged && activePool.some(s => s.seq === rigged.seq)) {
            winner = rigged;
        }
    }
    
    // Clear keyboard cheat buffer immediately
    cheatBuffer = '';
    document.getElementById('stealth-indicator').classList.remove('locked');

    // Default to random
    if (!winner) {
        const randIdx = Math.floor(Math.random() * activePool.length);
        winner = activePool[randIdx];
    }

    state.currentWinner = winner;

    // 2. Start scrolling marquee text in HUD overlay
    triggerMarqueeScrolling(winner, activePool);
}

// Scrolling HUD Marquee text simulation
function triggerMarqueeScrolling(winner, activePool) {
    const marqueeRollText = document.getElementById('marquee-roll-text');
    let delay = 35; // initial fast delay (ms)
    let elapsed = 0;
    const totalDuration = 2500; // 2.5 seconds scroll duration
    
    function roll() {
        if (elapsed >= totalDuration) {
            // Stop scroll, highlight winner in marquee HUD
            marqueeRollText.textContent = winner.name;
            
            // 3. Initiate camera flying path towards winner's volcano
            startCameraFocusTween(winner.countryId);
            return;
        }

        // Get random student names to render in viewport scroll
        const randS = activePool[Math.floor(Math.random() * activePool.length)];
        marqueeRollText.textContent = randS.name;

        // Play rolling click tick sound
        playTickSound();

        // Slow down marquee progressively near the end
        if (elapsed > totalDuration * 0.7) {
            delay += 25;
        }
        
        elapsed += delay;
        setTimeout(roll, delay);
    }
    
    roll();
}

// Volcano Eruption execution when camera finished centering on volcano
function executeVolcanicEruption() {
    const winner = state.currentWinner;
    if (!winner) return;

    // 1. Play synthesized volcano explosion sound
    playVolcanoEruptionSound();

    // 2. Trigger 3D Particle Eruption & shockwave ring
    triggerVisualEruption(winner.countryId);

    // 3. Update HUD text status
    const country = VOLCANO_COUNTRIES.find(c => c.id === winner.countryId);
    const countryName = country ? country.name : "未知國家";
    document.getElementById('status-text').textContent = `💥 火山大噴發！中獎國家：${countryName}`;

    // 4. Save winner record
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    
    const newWinner = {
        winSeq: state.winners.length + 1,
        seq: winner.seq,
        name: winner.name,
        countryName: countryName,
        timestamp: timestamp
    };
    
    state.winners.push(newWinner);
    saveState();

    // 5. Pop up Winner Grand Reveal card
    setTimeout(() => {
        document.getElementById('reveal-country-name').textContent = countryName;
        document.getElementById('reveal-winner-name').textContent = winner.name;
        document.getElementById('reveal-winner-seq').textContent = `序號: #${winner.seq.toString().padStart(3, '0')}`;
        
        const popup = document.getElementById('reveal-popup');
        popup.classList.remove('hide');
        void popup.offsetWidth;
        popup.classList.add('show');
    }, 800);
}

// Reset/Close Winner Reveal Popup
document.getElementById('btn-close-reveal').addEventListener('click', () => {
    const popup = document.getElementById('reveal-popup');
    popup.classList.remove('show');
    setTimeout(() => {
        popup.classList.add('hide');
        
        // Reset state
        isDrawing = false;
        state.currentWinner = null;
        currentGlobeRotationSpeed = baseGlobeRotationSpeed;
        
        document.getElementById('btn-draw').disabled = false;
        document.getElementById('status-text').textContent = '火山處於休眠狀態 (READY)';
        document.getElementById('status-text').previousElementSibling.className = 'status-dot pulsing-green';
        document.getElementById('marquee-roll-text').textContent = '準備爆發...';
        
        // Rebuild volcanos mesh because active pool has changed
        rebuildVolcanoes();
    }, 300);
});

// ==========================================================================
// 5. DATA MANAGEMENT & IMPORTS (CSV/EXCEL SHEETJS)
// ==========================================================================

// Parse manual textarea input list
function saveManualStudents() {
    const text = document.getElementById('text-students').value.trim();
    if (text === '') {
        alert('請先輸入名單資料！');
        return;
    }

    const lines = text.split('\n');
    const list = [];
    let autoSeq = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

        const parts = line.split(',');
        let seq = autoSeq;
        let name = '';
        let countryId = null;

        if (parts.length >= 2) {
            // Format: seq,name,countryId
            const parsedSeq = parseInt(parts[0]);
            seq = isNaN(parsedSeq) ? autoSeq : parsedSeq;
            name = parts[1].trim();
            if (parts[2]) {
                countryId = parseInt(parts[2].trim());
            }
        } else {
            // Format: name
            name = line;
        }

        // Clean name
        if (name === '') continue;

        // Auto distribute country ID if unspecified (randomly assign to 1-102)
        if (!countryId || isNaN(countryId) || countryId < 1 || countryId > VOLCANO_COUNTRIES.length) {
            countryId = Math.floor(Math.random() * VOLCANO_COUNTRIES.length) + 1;
        }

        list.push({ seq: seq, name: name, countryId: countryId });
        autoSeq = Math.max(autoSeq, seq) + 1;
    }

    state.students = list;
    state.winners = []; // reset winners when modifying names pool
    saveState();
    rebuildVolcanoes();
    
    alert(`成功匯入 ${list.length} 位學生名單，且已重新配置火山並重設中獎紀錄！`);
    switchPanel('panel-stage');
}

// Download CSV template file
function downloadCSVTemplate() {
    const csvContent = "\ufeff序號,姓名,火山國家編號(1-102)\n1,張三,1\n2,李四,2\n3,王五,3\n4,趙六,1\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "火山抽籤名單範本.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Drag & Drop Handlers
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-upload');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    if (e.dataTransfer.files.length > 0) {
        handleUploadedFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleUploadedFile(e.target.files[0]);
    }
});

function handleUploadedFile(file) {
    const reader = new FileReader();
    const isCsv = file.name.endsWith('.csv');

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (rows.length < 2) {
                alert('表格檔案無足夠數據！');
                return;
            }

            // Headers scan
            const headers = rows[0].map(h => String(h).trim());
            let seqIdx = headers.findIndex(h => h.includes('序') || h.includes('號') || h.includes('ID') || h.includes('id'));
            let nameIdx = headers.findIndex(h => h.includes('名') || h.includes('姓') || h.includes('人'));
            let countryIdx = headers.findIndex(h => h.includes('國') || h.includes('編') || h.includes('地') || h.includes('火山'));

            // Fallbacks if header labels don't match standard
            if (nameIdx === -1) nameIdx = 1; 
            if (seqIdx === -1) seqIdx = 0;

            const list = [];
            let autoSeq = 1;

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length === 0) continue;

                let name = row[nameIdx] ? String(row[nameIdx]).trim() : '';
                if (name === '') continue;

                let seq = row[seqIdx] ? parseInt(row[seqIdx]) : autoSeq;
                if (isNaN(seq)) seq = autoSeq;

                let countryId = countryIdx !== -1 && row[countryIdx] ? parseInt(row[countryIdx]) : null;

                if (!countryId || isNaN(countryId) || countryId < 1 || countryId > VOLCANO_COUNTRIES.length) {
                    countryId = Math.floor(Math.random() * VOLCANO_COUNTRIES.length) + 1;
                }

                list.push({ seq: seq, name: name, countryId: countryId });
                autoSeq = Math.max(autoSeq, seq) + 1;
            }

            state.students = list;
            state.winners = [];
            saveState();
            rebuildVolcanoes();

            // UI feedback
            const statusBox = document.getElementById('upload-status');
            document.getElementById('upload-status-text').textContent = `成功解析：${list.length} 名學生！已重新配置地球。`;
            statusBox.classList.remove('hide');

            alert(`匯入成功！共解析出 ${list.length} 名學生，已完成 3D 火山群分佈對齊。`);
            switchPanel('panel-stage');

        } catch (err) {
            console.error(err);
            alert('檔案解析出錯，請確認是否為符合格式的 Excel 或 CSV 檔案！');
        }
    };

    reader.readAsArrayBuffer(file);
}

// Re-populate sidebar values and textareas
function updateStatsUI() {
    const total = state.students.length;
    const activePool = getActivePool();
    const active = activePool.length;
    const wonCount = state.winners.length;

    // Sidebar
    document.getElementById('sidebar-active-count').textContent = active;
    document.getElementById('sidebar-total-count').textContent = total;

    // Drawing Button
    const drawBtn = document.getElementById('btn-draw');
    if (active > 0) {
        drawBtn.removeAttribute('disabled');
        document.getElementById('btn-draw-text').textContent = '引爆火山 (START)';
    } else {
        drawBtn.setAttribute('disabled', 'true');
        document.getElementById('btn-draw-text').textContent = '名單已空 (EMPTY)';
    }

    // Students panel manually textarea initial fill
    document.getElementById('student-count-manual').textContent = total;
    
    // Fill text editor if empty or matching list
    const area = document.getElementById('text-students');
    // Only update textarea if it's not focused to avoid disrupting user input
    if (document.activeElement !== area) {
        area.value = state.students.map(s => `${s.seq},${s.name},${s.countryId}`).join('\n');
    }

    // Re-fill winners table
    populateWinnersTable();
}

// Populate grid mapping countries in setup panel
function populateCountriesGrid(countryStudentsMap) {
    const grid = document.getElementById('countries-grid');
    grid.innerHTML = '';

    VOLCANO_COUNTRIES.forEach(country => {
        const students = countryStudentsMap[country.id] || [];
        const count = students.length;

        const pill = document.createElement('div');
        pill.className = `country-pill ${count > 0 ? 'has-students' : ''}`;
        
        pill.innerHTML = `
            <span class="country-pill-name" title="${country.volcano}">🌋 ${country.id}. ${country.name.split(' ')[0]}</span>
            <span class="country-pill-count">${count}人</span>
        `;
        
        // Let clicking pill focus camera on it
        pill.addEventListener('click', () => {
            switchPanel('panel-stage');
            startCameraFocusTween(country.id);
        });

        grid.appendChild(pill);
    });
}

// Render winners history table
function populateWinnersTable() {
    const tbody = document.getElementById('winners-table-body');
    const exportBtn = document.getElementById('btn-export-winners');
    const clearBtn = document.getElementById('btn-clear-winners');

    if (state.winners.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">目前尚無中獎紀錄，快去首頁引爆火山吧！</td>
            </tr>
        `;
        exportBtn.setAttribute('disabled', 'true');
        clearBtn.setAttribute('disabled', 'true');
    } else {
        tbody.innerHTML = '';
        exportBtn.removeAttribute('disabled');
        clearBtn.removeAttribute('disabled');

        // Render latest winners on top
        const reversed = [...state.winners].reverse();
        reversed.forEach(w => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${w.winSeq}</strong></td>
                <td>#${w.seq.toString().padStart(3,'0')}</td>
                <td>${w.name}</td>
                <td>🌋 ${w.countryName}</td>
                <td>${w.timestamp}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Clear winners history
document.getElementById('btn-clear-winners').addEventListener('click', () => {
    if (confirm('確定要清除所有中獎人紀錄嗎？清除後，這些名單會重新放回抽籤池中。')) {
        state.winners = [];
        saveState();
        rebuildVolcanoes();
        alert('已清除所有中獎紀錄！');
    }
});

// Clear active pool draw flags only (similar reset)
document.getElementById('btn-reset-pool').addEventListener('click', () => {
    if (confirm('這將清除所有中獎紀錄並將火山重歸平靜，確定重置嗎？')) {
        state.winners = [];
        saveState();
        rebuildVolcanoes();
        alert('抽籤記錄已重置！');
    }
});

// Export Winners to CSV
document.getElementById('btn-export-winners').addEventListener('click', () => {
    if (state.winners.length === 0) return;

    let csvContent = "\ufeff中獎順序,學生原始序號,學生姓名,噴發火山國別,中獎時間\n";
    state.winners.forEach(w => {
        csvContent += `${w.winSeq},${w.seq},${w.name},${w.countryName},${w.timestamp}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "火山抽籤_中獎名單.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Save manual names
document.getElementById('btn-save-students').addEventListener('click', saveManualStudents);
document.getElementById('btn-download-template').addEventListener('click', downloadCSVTemplate);

// ==========================================================================
// 6. UI TABS SWITCHING
// ==========================================================================
const navButtons = document.querySelectorAll('.nav-btn');
const contentPanels = document.querySelectorAll('.content-panel');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        switchPanel(target);
    });
});

function switchPanel(panelId) {
    navButtons.forEach(b => {
        if (b.getAttribute('data-target') === panelId) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

    contentPanels.forEach(p => {
        if (p.id === panelId) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
    
    // Resize 3D canvas if switching back to draw stage
    if (panelId === 'panel-stage') {
        setTimeout(onWindowResize, 50);
    }
}

// Shuffle countries for all students
function shuffleCountriesForStudents() {
    if (state.students.length === 0) {
        alert('請先在名單管理頁面中新增或上傳名單！');
        return;
    }
    state.students.forEach(s => {
        s.countryId = Math.floor(Math.random() * VOLCANO_COUNTRIES.length) + 1;
    });
    state.winners = []; // reset winners to prevent inconsistent country data
    saveState();
    rebuildVolcanoes();
    alert('已將名單所有人隨機重新分配至不同國家，且已重設中獎紀錄！');
}

// Bind Shuffle Countries
document.getElementById('btn-shuffle-countries').addEventListener('click', shuffleCountriesForStudents);

// Draw trigger
document.getElementById('btn-draw').addEventListener('click', startDraw);

// ==========================================================================
// 7. INITIALIZATION STARTUP
// ==========================================================================
window.addEventListener('load', () => {
    loadState();
    init3D();
    
    // Trigger standard resize to align canvas correctly
    setTimeout(onWindowResize, 100);
});
