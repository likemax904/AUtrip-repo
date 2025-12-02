const API_URL = "/api";
let expensesData = [];
const TARGET_DATE = "2026-01-28T09:00:00";
let expensePieChart = null;
let expenseBarChart = null;
let itineraryAllData = null; //存API回來的全部資料
let currentDayFilter = 1; //預設顯示D1(1/28)

// --- 預設靜態資料 (Mock Data) ---
// 用於預覽時或連線失敗時顯示
const mockItinerary = [
  {
    id: 101,
    day: 1,
    location: "桃園機場 (Taoyuan Airport)",
    activity: "從台中出發至桃園機場",
    notes:
      "預計下午2:30台中出發，下午5:30抵達桃園機場，並享受悠閒的晚餐，晚上11:45搭機出發🛫!!。",
    time_range: "14:30~0:00",
    map_location: [
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17190.067805134073!2d121.22159890696936!3d25.075898776168348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34429fc062d215d5%3A0x70a3b690a9b5b109!2z6Ie654Gj5qGD5ZyS5ZyL6Zqb5qmf5aC0!5e0!3m2!1szh-TW!2stw!4v1764257708281!5m2!1szh-TW!2stw" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    ],
  },
  {
    id: 102,
    day: 2,
    location: "雪梨 (Sydney)",
    activity: "世界遺產巡禮：雪梨歌劇院與海港大橋",
    notes: "上午參加歌劇院內部導覽，下午漫步岩石區 (The Rocks) 感受歷史氛圍。",
  },
  {
    id: 103,
    day: 3,
    location: "雪梨 (Sydney)",
    activity: "陽光與海浪：邦代海灘 (Bondi Beach) 衝浪體驗",
    notes: "沿著海岸步道散步至 Coogee Beach，風景絕美。",
  },
  {
    id: 104,
    day: 4,
    location: "藍山 (Blue Mountains)",
    activity: "大自然的鬼斧神工：藍山國家公園一日遊",
    notes: "搭乘景觀纜車欣賞三姊妹峰 (Three Sisters)，空氣清新。",
  },
  {
    id: 105,
    day: 5,
    location: "墨爾本 (Melbourne)",
    activity: "文化之都：飛往墨爾本，探索咖啡巷弄",
    notes: "參觀維多利亞女王市場，品嚐當地美食與咖啡。",
  },
  {
    id: 106,
    day: 6,
    location: "墨爾本 (Melbourne)",
    activity: "公路旅行經典：大洋路 (Great Ocean Road) 十二門徒",
    notes: "路途較遠，建議清晨出發，沿途海岸線壯觀。",
  },
  {
    id: 107,
    day: 7,
    location: "墨爾本 (Melbourne)",
    activity: "城市慢活：普芬比利蒸汽火車與菲利普島企鵝歸巢",
    notes: "晚上在海邊等待小企鵝上岸，請注意保暖。",
  },
  {
    id: 108,
    day: 8,
    location: "開恩茲 (Cairns)",
    activity: "熱帶冒險：飛往開恩茲，漫步海濱大道",
    notes: "入住度假村，晚上逛開恩茲夜市。",
  },
  {
    id: 109,
    day: 9,
    location: "開恩茲 (Cairns)",
    activity: "海底總動員：大堡礁 (Great Barrier Reef) 豪華遊船",
    notes: "全日出海浮潛或深潛，探索絢麗的珊瑚礁。",
  },
  {
    id: 110,
    day: 10,
    location: "開恩茲 / 返程",
    activity: "完美句點：庫蘭達熱帶雨林纜車，搭機返家",
    notes: "購買最後的紀念品，前往機場。",
  },
];

const mockExpenses = [
  {
    id: 201,
    item: "台北-雪梨 來回機票",
    cost: 28000,
    payer: "Joe",
    sharedBy: 2,
  },
  {
    id: 202,
    item: "澳洲國內線機票 (兩段)",
    cost: 8500,
    payer: "Joe",
    sharedBy: 2,
  },
  {
    id: 203,
    item: "雪梨飯店 (4晚)",
    cost: 16000,
    payer: "Jane",
    sharedBy: 2,
  },
  {
    id: 204,
    item: "大堡礁一日遊行程",
    cost: 5500,
    payer: "Jane",
    sharedBy: 2,
  },
  { id: 205, item: "第一天晚餐", cost: 2400, payer: "Joe", sharedBy: 2 },
];

// --- 圖片網址對照表 (確保圖片穩定顯示) ---
const imageMap = {
  "Taoyuan Airport":
    "https://www.taoyuan-airport.com/api/imagecrop/coverImage/F906A942-E7B9-F011-BC1A-0050569094FE",
  "Blue Mountains":
    "https://images.unsplash.com/photo-1540326966838-3b32c6c39a08?auto=format&fit=crop&w=800&q=80",
  Melbourne:
    "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=800&q=80",
  "Great Ocean Road":
    "https://images.unsplash.com/photo-1490079027102-cd08f2308c73?auto=format&fit=crop&w=800&q=80",
  Cairns:
    "https://images.unsplash.com/photo-1565516040854-325d7b51b3b1?auto=format&fit=crop&w=800&q=80",
  "Barrier Reef":
    "https://images.unsplash.com/photo-1582967788606-a171f1080ca8?auto=format&fit=crop&w=800&q=80",
  Default:
    "https://www.taoyuan-airport.com/api/imagecrop/coverImage/F906A942-E7B9-F011-BC1A-0050569094FE",
};

function initCountdown() {
  // 防呆：如果這一頁沒有倒數計時器元素，直接結束函式
  const displayElement = document.getElementById("target-date-display");
  if (!displayElement) return;

  displayElement.textContent = TARGET_DATE.split("T")[0];

  const target = new Date(TARGET_DATE).getTime();

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = target - now;

    const timerElement = document.getElementById("countdown-timer");
    // 防呆：確保元素還在（例如切換頁面後）
    if (!timerElement) {
      clearInterval(timer);
      return;
    }

    if (distance < 0) {
      clearInterval(timer);
      timerElement.innerHTML =
        "<div class='text-4xl font-bold tracking-wider animate-bounce'>🎉 旅程已經開始！ Have Fun! 🎉</div>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 再次確認元素存在才更新
    const elDay = document.getElementById("cd-days");
    if (elDay) elDay.innerText = String(days).padStart(2, "0");

    const elHour = document.getElementById("cd-hours");
    if (elHour) elHour.innerText = String(hours).padStart(2, "0");

    const elMin = document.getElementById("cd-minutes");
    if (elMin) elMin.innerText = String(minutes).padStart(2, "0");

    const elSec = document.getElementById("cd-seconds");
    if (elSec) elSec.innerText = String(seconds).padStart(2, "0");
  }, 1000);
}

// --- ☀️ 新增：獲取天氣邏輯 ---
async function fetchWeather() {
  const container = document.getElementById("weather-container");
  const loading = document.getElementById("weather-loading");

  if (!container) return; // 如果不是首頁，跳過

  try {
    // 使用 Open-Meteo API  https://api.open-meteo.com (免費，無需 Key)
    // 請求：最高溫、最低溫、天氣代碼，時區設為澳洲/墨爾本
    const url = `https://api.open-meteo.com/v1/forecast?latitude=-37.814&longitude=144.9633&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.daily) throw new Error("無天氣數據");

    // 隱藏 Loading
    loading.classList.add("hidden");
    container.classList.remove("hidden");

    // 渲染 5 天天氣卡片
    let html = "";
    const days = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

    data.daily.time.forEach((dateStr, index) => {
      const date = new Date(dateStr);
      const dayName = index === 0 ? "今天" : days[date.getDay()]; // 第一天顯示今天
      const code = data.daily.weather_code[index];
      const maxTemp = Math.round(data.daily.temperature_2m_max[index]);
      const minTemp = Math.round(data.daily.temperature_2m_min[index]);
      const precipitationMax = data.daily.precipitation_probability_max[index]; //降雨機率

      // 取得天氣圖示與描述
      const { icon, desc } = getWeatherIcon(code);

      html += `
            <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[90px] border border-white/30 flex flex-col items-center">
                <span class="text-xs font-bold opacity-90 mb-1 ">${dayName}</span>
                <span class="text-xs opacity-75 mb-2">${dateStr
                  .slice(5)
                  .replace("-", "/")}</span>
                <span class="text-3xl mb-1">${icon}</span>
                <span class="text-xs font-medium mb-1">${precipitationMax}%</span>
                <span class="text-xs font-medium mb-1">${desc}</span>
                <span class="text-sm font-bold">${minTemp}° - ${maxTemp}°</span>
            </div>
            `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error("天氣載入失敗:", err);
    loading.textContent = "暫時無法取得天氣資訊";
  }
}

// 簡單的天氣代碼轉換 (WMO Weather interpretation codes)
function getWeatherIcon(code) {
  if (code === 0) return { icon: "☀️", desc: "晴朗" };
  if (code >= 1 && code <= 3) return { icon: "⛅", desc: "多雲" };
  if (code >= 45 && code <= 48) return { icon: "🌫️", desc: "有霧" };
  if (code >= 51 && code <= 55) return { icon: "🌧️", desc: "毛毛雨" };
  if (code >= 61 && code <= 67) return { icon: "🌧️", desc: "下雨" };
  if (code >= 80 && code <= 82) return { icon: "🌦️", desc: "陣雨" };
  if (code >= 95) return { icon: "⚡", desc: "雷雨" };
  return { icon: "☁️", desc: "陰天" };
}

document.addEventListener("DOMContentLoaded", () => {
  fetchItinerary();
  fetchExpenses();
  fetchWeather();
  switchTab("planner");
  initCountdown();
  updateStatus();
});

// 1. 獲取行程 (含錯誤處理與降級機制)
async function fetchItinerary() {
  try {
    // 設定 2 秒 timeout，避免連線過久
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(API_URL + "/itinerary", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("連線失敗");

    const plans = await res.json();
    itineraryAllData = plans;
    renderItineraryByDay(currentDayFilter);
    //renderItinerary(plans);
    updateStatus(true);
  } catch (err) {
    console.warn("無法連線後端，切換至靜態預覽模式。", err);

    // 靜態模式也要組成同樣的結構
    itineraryAllData = {
      itinerary_data: mockItinerary,
      imagemap_data: imageMap,
    };
    renderItineraryByDay(currentDayFilter);

    //renderItinerary(mockItinerary); // 使用靜態資料
    updateStatus(false);
  }
}

// 2. 獲取費用
async function fetchExpenses() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(API_URL + "/expenses", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("連線失敗");

    expensesData = await res.json();

    renderExpenses(expensesData);
    calculateStats();
    updateExpenseCharts(expensesData);
    updateStatus(true);
  } catch (err) {
    expensesData = mockExpenses; // 使用靜態資料
    renderExpenses(mockExpenses);
    calculateStats();
    updateExpenseCharts(expensesData);
    updateStatus(false);
  }
}

// 3. 新增費用
async function addExpense() {
  const item = document.getElementById("expense-item").value;
  const cost = parseFloat(document.getElementById("expense-cost").value);
  const payer = document.getElementById("expense-payer").value;
  const sharedBy = parseInt(document.getElementById("expense-shared-by").value);

  try {
    const res = await fetch(API_URL + "/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, cost, payer, shared_by: sharedBy }),
    });

    if (res.ok) {
      document.getElementById("add-expense-form").reset();
      fetchExpenses();
    } else {
      alert("後端連線失敗，無法儲存 (目前為預覽模式)");
    }
  } catch (err) {
    alert("後端連線失敗，無法儲存 (目前為預覽模式)");
  }
}

// 4. 刪除費用
async function deleteExpense(id) {
  if (!confirm("確定要刪除此項目嗎？")) return;
  try {
    await fetch(API_URL + "/expenses/" + id, { method: "DELETE" });
    fetchExpenses();
  } catch (err) {
    alert("預覽模式無法刪除後端資料");
  }
}

// --- 渲染邏輯 ---

function updateStatus(isOnline) {
  const statusEl = document.getElementById("connection-status");
  if (isOnline) {
    statusEl.innerHTML =
      '<span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span> 資料庫已連線';
    statusEl.classList.remove("text-gray-500", "text-yellow-600");
    statusEl.classList.add("text-green-600");
  } else {
    statusEl.innerHTML =
      '<span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span> 預覽模式 (靜態資料)';
    statusEl.classList.remove("text-gray-500", "text-green-600");
    statusEl.classList.add("text-yellow-600");
  }
}

function getImageKeyword(location) {
  if (location.includes("桃園機場") || location.includes("Taoyuan Airport"))
    return "Taoyuan Airport";
  if (location.includes("墨爾本聯邦廣場") || location.includes("Fed Square"))
    return "Fed Square";
  if (location.includes("墨爾本港區") || location.includes("Docklands"))
    return "Docklands";
  if (location.includes("墨爾本飯店") || location.includes("Hotel"))
    return "Hotel";
  if (location.includes("墨爾本") || location.includes("Melbourne"))
    return "Melbourne";
  if (location.includes("澳網球場區") || location.includes("Rod Laver Arena"))
    return "Rod Laver Arena";
  if (location.includes("開恩茲") || location.includes("Cairns"))
    return "Cairns";
  if (location.includes("大堡礁") || location.includes("Barrier Reef"))
    return "Barrier Reef";
  return "Default";
}

function renderItineraryByDay(day) {
  if (!itineraryAllData) return;

  currentDayFilter = day;

  const allPlans = itineraryAllData.itinerary_data || [];
  const imagemap = itineraryAllData.imagemap_data || {};

  const filteredPlans = allPlans.filter((p) => p.day === day);

  renderItinerary({
    itinerary_data: filteredPlans,
    imagemap_data: imagemap,
  });

  highlightDayButton(day);
}

function highlightDayButton(day) {
  const buttons = document.querySelectorAll('[id^="day-btn-"]');
  buttons.forEach((btn) => {
    btn.classList.remove(
      "bg-primary-blue",
      "text-white",
      "border-primary-blue"
    );
    btn.classList.add("bg-white", "text-gray-700", "border-gray-300");
  });

  const activeBtn = document.getElementById(`day-btn-${day}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-white", "text-gray-700", "border-gray-300");
    activeBtn.classList.add(
      "bg-primary-blue",
      "text-white",
      "border-primary-blue"
    );
  }
}

function renderItinerary(plans) {
  const container = document.getElementById("itinerary-list");
  const imageMap = plans.imagemap_data;
  container.innerHTML = plans.itinerary_data
    .map((plan) => {
      const imgKey = getImageKeyword(plan.location);
      const imageUrl = imageMap[imgKey] || imageMap["Default"];

      return `
                <div class="group flex flex-col md:flex-row md:items-start bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden mb-6 border border-gray-100">
                    <!-- 左側圖片區塊 -->
                    <div class="md:w-1/3 h-56 md:h-64 relative overflow-hidden bg-gray-200 flex-shrink-0">
                        <img src="${imageUrl}" 
                        alt="${plan.location}" 
                        class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 img-fade-in"
                        loading="lazy">

                        <!-- 懸浮日期標籤 -->
                        <div class="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-10">
                            <span class="bg-secondary-yellow text-white text-xs font-bold px-2 py-0.5 rounded-full">D${
                              plan.day
                            }</span>
                            <span class="text-sm font-bold text-gray-800">${
                              plan.location.split(" ")[0]
                            }</span>
                        </div>
                    </div>

                    <!-- 右側內容區塊 -->
                    <div class="  p-6 md:w-2/3 flex flex-col justify-between">
                        <div class="flex flex-row md:flex-col justify-between  "> 
                            <div>
                              <div class=" flex items-center hover:underline gap-2 mb-3 text-sm text-gray-500">
                                  <svg class=" w-4 h-4 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                  
                                    ${plan.location}
                                  
                              </div>
                              
                              <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-blue transition-colors">
                                  ${
                                    plan.activity.length > 25
                                      ? plan.activity.substring(0, 25) + "..."
                                      : plan.activity
                                  }
                              </h3>
                              
                              <p class="text-gray-600 leading-relaxed mb-4 text-sm line-clamp-2">
                                  ${plan.notes}
                              </p>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                            <span class="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded"></span>
                            
                            <!-- 展開按鈕 -->
                            <button id="toggleBtn-${plan.id}"
                            onclick="toggleDetails(${plan.id})"
                            class="text-sm font-bold text-primary-blue hover:text-blue-700 flex items-center gap-1 transition-colors py-1 px-3 hover:bg-blue-50 rounded-lg"
                            >
                              查看明細
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform transition-transform duration-300" 
                                id="icon-${plan.id}" 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                        </div>

                        <!-- 隱藏的詳細內容區塊 -->
                        <div id="details-${plan.id}" 
                        class="hidden mt-4 pt-4 bg-gray-50 rounded-xl p-4 text-sm text-gray-600 border border-gray-100"
                        >
                          <div class="mb-3">
                            <h4 class="font-bold text-gray-800 mb-1 flex items-center">
                              📌 詳細活動內容
                            </h4>
                            <p class="leading-relaxed">
                              ${plan.information ? plan.information : ""}
                            </p>
                            <div >
                              ${
                                plan.map_location
                                  ? `
                                  <div class="mt-3 map-frame aspect-video w-full rounded-xl overflow-hidden border border-gray-200">
                                    ${plan.map_location}
                                  </div>
                                  `
                                  : ""
                              }
                            </div>
                          </div>
                          ${
                            plan.little_text
                              ? `
                          <div class="pt-3 border-t border-gray-200/60">
                            <h4 class="font-bold text-secondary-yellow mb-1 flex items-center">
                                💡 貼心備註
                            </h4>
                            <p class="leading-relaxed">${plan.little_text}</p>
                          </div>`
                              : ""
                          }
                          ${
                            plan.food_places && plan.food_places.length
                              ? `
                          <div class="mt-3 pt-3 border-t border-dashed border-gray-300 ">
                            <h4 class="font-bold text-gray-800 mb-2 flex items-center">
                              🍴 推薦美食地點
                            </h4>
                            <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                              ${plan.food_places
                                .map(
                                  (f) =>
                                    `
                              <div class="bg-white/60 rounded-lg p-3 text-sm text-gray-700">
                                <h3 class="text-primary-blue">
                                  ${f.name}
                                </h3>
                                <div class="mt-3 map-frame aspect-video w-full rounded-xl overflow-hidden border border-gray-200 ">
                                  ${f.url}
                                </div>
                              </div>
                              `
                                )
                                .join("")}
                            </div>
                          </div>
                          `
                              : ""
                          }      
                          <button type="button"onclick="toggleDetails(${
                            plan.id
                          })"
                          class="mt-3 w-full text-right text-sm text-gray-500 hover:text-primary-blue"
                          >
                            ▲ 收合明細
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
    })
    .join("");
}

function renderExpenses(expenses) {
  const tbody = document.getElementById("expense-list");
  if (expenses.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center py-4 text-gray-500">尚無費用資料</td></tr>';
    return;
  }
  tbody.innerHTML = expenses
    .map(
      (e) => `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">${
                      e.item
                    }</td>
                    <td class="px-4 py-3 text-sm text-gray-700 font-mono">$${e.cost.toFixed(
                      2
                    )}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                        <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">${
                          e.payer
                        }</span>
                    </td>
                    <td class="px-4 py-3 text-sm hidden">
                        <button onclick="deleteExpense(${
                          e.id
                        })" class="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </td>
                </tr>
            `
    )
    .join("");
}

function calculateStats() {
  const total = expensesData.reduce((sum, item) => sum + item.cost, 0);
  const people = parseInt(document.getElementById("num-people").value) || 1;

  document.getElementById("total-expense").textContent = total.toFixed(2);
  document.getElementById("avg-expense").textContent = (total / people).toFixed(
    2
  );
}

// 依項目名稱自動歸類
function categorizeExpense(itemName) {
  if (!itemName) return "其他";

  if (itemName.includes("機票")) return "機票";
  if (itemName.includes("飯店") || itemName.includes("住宿")) return "住宿";
  if (itemName.includes("套裝") || itemName.includes("門票"))
    return "行程 / 門票";
  if (
    itemName.includes("飲食") ||
    itemName.includes("餐") ||
    itemName.includes("早餐") ||
    itemName.includes("午餐") ||
    itemName.includes("晚餐")
  )
    return "飲食";
  if (itemName.includes("交通")) return "交通";

  return "其他";
}

// 更新費用圖表（圓餅圖 + 直條圖）
function updateExpenseCharts(expenses) {
  const pieCanvas = document.getElementById("expense-pie-chart");
  const barCanvas = document.getElementById("expense-bar-chart");

  function shortenLabel(label, max = 6) {
    return label.length > max ? label.substring(0, max) + "..." : label;
  }

  // 如果當前頁面沒有這兩個元素（例如在首頁），就不用做事
  if (!pieCanvas || !barCanvas) return;

  // 1) 準備類別占比資料
  const categoryTotals = {};
  expenses.forEach((e) => {
    const cat = categorizeExpense(e.item);
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (e.cost || 0);
  });

  const pieLabels = Object.keys(categoryTotals);
  const pieData = Object.values(categoryTotals);

  // 2) 準備各項目金額資料
  const barLabels = expenses.map((e) => shortenLabel(e.item));
  const barData = expenses.map((e) => e.cost || 0);

  // 如果已經有舊圖表，先銷毀避免重疊
  if (expensePieChart) {
    expensePieChart.destroy();
  }
  if (expenseBarChart) {
    expenseBarChart.destroy();
  }

  // 3) 建立圓餅圖
  expensePieChart = new Chart(pieCanvas, {
    type: "pie",
    data: {
      labels: pieLabels,
      datasets: [
        {
          data: pieData,
          // 不特別指定顏色，使用 Chart.js 預設配色即可
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // 4) 建立直條圖
  expenseBarChart = new Chart(barCanvas, {
    type: "bar",
    data: {
      labels: barLabels,
      datasets: [
        {
          label: "金額 (TWD)",
          data: barData,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: (items) => {
              // 滑鼠移上去時仍顯示完整名稱
              const index = items[0].dataIndex;
              return expenses[index].item;
            },
          },
        },
      },
    },
  });
}

// --- UI 交互邏輯 ---
function switchTab(tabName) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll('button[id^="tab-"]')
    .forEach((el) => el.classList.remove("tab-active"));

  var contentId = tabName + "-content";
  var tabId = "tab-" + tabName;

  if (document.getElementById(contentId)) {
    document.getElementById(contentId).classList.remove("hidden");
  }
  if (document.getElementById(tabId)) {
    document.getElementById(tabId).classList.add("tab-active");
  }
}

function toggleDetails(id) {
  const details = document.getElementById("details-" + id);
  const icon = document.getElementById("icon-" + id);
  const map_details = document.getElementById("map_details-" + id);
  const btn = document.getElementById("toggleBtn-" + id);

  if (details.classList.contains("hidden")) {
    details.classList.remove("hidden");
    icon.classList.add("rotate-180");
  } else {
    details.classList.add("hidden");
    icon.classList.remove("rotate-180");
    btn.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  if (map_details.classList.contains("hidden")) {
    map_details.classList.remove("hidden");
  } else {
    map_details.classList.add("hidden");
    btn.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// 明確掛載至 window
window.switchTab = switchTab;
window.addExpense = addExpense;
window.deleteExpense = deleteExpense;
window.calculateStats = calculateStats;
window.toggleDetails = toggleDetails;
window.renderItineraryByDay = renderItineraryByDay;
