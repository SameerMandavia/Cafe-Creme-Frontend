const festivalBanner = document.querySelector("#festival-banner");

const festivalCalendar = [
  {
    id: "lohri",
    start: "2026-01-13",
    end: "2026-01-14",
    name: "Lohri",
    tradition: "Punjabi and Sikh tradition",
    eyebrow: "Warm fires, warm cups",
    title: "Gather around the winter table",
    message: "Celebrate Lohri with jaggery sweetness, roasted flavours, and a comforting cup of chai.",
    art: "✦",
    action: "Explore the menu",
    actionUrl: "menu.html"
  },
  {
    id: "makar-sankranti",
    start: "2026-01-14",
    end: "2026-01-16",
    name: "Makar Sankranti",
    tradition: "Hindu tradition",
    eyebrow: "A brighter turn",
    title: "Sweet beginnings in the sun",
    message: "Share til, jaggery, and sunshine-inspired treats with your favourite people.",
    art: "☀",
    action: "View festive offers",
    actionUrl: "offers.html"
  },
  {
    id: "pongal",
    start: "2026-01-15",
    end: "2026-01-18",
    name: "Pongal",
    tradition: "Tamil harvest tradition",
    eyebrow: "Thai Pongal wishes",
    title: "A harvest worth sharing",
    message: "Celebrate gratitude, abundance, and the flavours of a generous South Indian table.",
    art: "✿",
    action: "Explore the menu",
    actionUrl: "menu.html"
  },
  {
    id: "vasant-panchami",
    start: "2026-01-23",
    end: "2026-01-24",
    name: "Vasant Panchami",
    tradition: "Hindu tradition",
    eyebrow: "The first touch of spring",
    title: "A bright cup for a bright season",
    message: "Welcome spring with saffron warmth, golden bakes, and a little creative energy.",
    art: "✦",
    action: "See the menu",
    actionUrl: "menu.html"
  },
  {
    id: "valentines-day",
    start: "2026-02-01",
    end: "2026-02-14",
    name: "Valentine's Day",
    tradition: "Contemporary celebration",
    eyebrow: "Made for two",
    title: "Sweet moments, shared slowly",
    message: "Make space for a quiet coffee, a warm bake, and someone special.",
    art: "♥",
    action: "Reserve a table",
    actionUrl: "reservations.html"
  },
  {
    id: "maha-shivratri",
    start: "2026-02-15",
    end: "2026-02-16",
    name: "Maha Shivratri",
    tradition: "Hindu tradition",
    eyebrow: "A quiet moment",
    title: "Pause, reflect, reconnect",
    message: "A calm cafe table and a warm drink make space for a thoughtful evening.",
    art: "ॐ",
    action: "Plan your table",
    actionUrl: "reservations.html"
  },
  {
    id: "holi",
    start: "2026-03-01",
    end: "2026-03-08",
    name: "Holi",
    tradition: "Hindu tradition",
    eyebrow: "Bring on the colour",
    title: "Bright flavours for bright days",
    message: "Celebrate the season with colourful coolers, playful sweets, and friends around the table.",
    art: "●",
    action: "See the menu",
    actionUrl: "menu.html"
  },
  {
    id: "ramadan",
    start: "2026-02-18",
    end: "2026-03-19",
    name: "Ramadan",
    tradition: "Muslim tradition",
    eyebrow: "A month of reflection",
    title: "Gather with generosity",
    message: "Wishing our community a peaceful Ramadan filled with kindness, reflection, and togetherness.",
    art: "☾",
    action: "Plan your table",
    actionUrl: "reservations.html"
  },
  {
    id: "eid-al-fitr",
    start: "2026-03-20",
    end: "2026-03-22",
    name: "Eid al-Fitr",
    tradition: "Muslim tradition",
    eyebrow: "Eid Mubarak",
    title: "A joyful table for everyone",
    message: "Celebrate the close of Ramadan with sweetness, gratitude, and time together.",
    art: "☾",
    action: "Reserve a table",
    actionUrl: "reservations.html"
  },
  {
    id: "mahavir-jayanti",
    start: "2026-04-01",
    end: "2026-04-02",
    name: "Mahavir Jayanti",
    tradition: "Jain tradition",
    eyebrow: "Peace and compassion",
    title: "A gentle pause in the day",
    message: "Mark the occasion with simplicity, mindfulness, and a welcoming vegetarian table.",
    art: "✦",
    action: "Explore the menu",
    actionUrl: "menu.html"
  },
  {
    id: "good-friday",
    start: "2026-04-03",
    end: "2026-04-03",
    name: "Good Friday",
    tradition: "Christian tradition",
    eyebrow: "A day for reflection",
    title: "A peaceful place to pause",
    message: "Wishing our Christian community a reflective and peaceful Good Friday.",
    art: "✝",
    action: "Contact us",
    actionUrl: "contact.html"
  },
  {
    id: "easter",
    start: "2026-04-05",
    end: "2026-04-06",
    name: "Easter",
    tradition: "Christian tradition",
    eyebrow: "A season of renewal",
    title: "Fresh bakes, fresh beginnings",
    message: "Celebrate Easter with bright mornings, shared tables, and something sweet from our bakery.",
    art: "✿",
    action: "Explore the menu",
    actionUrl: "menu.html"
  },
  {
    id: "baisakhi",
    start: "2026-04-14",
    end: "2026-04-15",
    name: "Baisakhi",
    tradition: "Punjabi and Sikh tradition",
    eyebrow: "Harvest and community",
    title: "A table full of gratitude",
    message: "Celebrate Baisakhi with bright flavours, generous portions, and good company.",
    art: "✦",
    action: "View festive offers",
    actionUrl: "offers.html"
  },
  {
    id: "buddha-purnima",
    start: "2026-05-01",
    end: "2026-05-02",
    name: "Buddha Purnima",
    tradition: "Buddhist tradition",
    eyebrow: "Mindful moments",
    title: "Slow down and be present",
    message: "Wishing our community a peaceful day of compassion, wisdom, and mindful connection.",
    art: "☸",
    action: "Reserve a table",
    actionUrl: "reservations.html"
  },
  {
    id: "eid-al-adha",
    start: "2026-05-27",
    end: "2026-05-29",
    name: "Eid al-Adha",
    tradition: "Muslim tradition",
    eyebrow: "Eid Mubarak",
    title: "A celebration of generosity",
    message: "May Eid bring peace, kindness, and joyful gatherings to every home.",
    art: "☾",
    action: "Plan your table",
    actionUrl: "reservations.html"
  },
  {
    id: "rath-yatra",
    start: "2026-07-16",
    end: "2026-07-18",
    name: "Rath Yatra",
    tradition: "Hindu tradition",
    eyebrow: "A joyful journey",
    title: "Move through the season together",
    message: "Celebrate Rath Yatra with a bright table, comforting chai, and shared sweetness.",
    art: "✦",
    action: "Explore the menu",
    actionUrl: "menu.html"
  },
  {
    id: "parsi-new-year",
    start: "2026-08-16",
    end: "2026-08-17",
    name: "Parsi New Year",
    tradition: "Parsi Zoroastrian tradition",
    eyebrow: "Navu Saal Mubarak",
    title: "A fresh year, warmly welcomed",
    message: "Wishing our Parsi community a bright new year filled with health, joy, and togetherness.",
    art: "✦",
    action: "View festive offers",
    actionUrl: "offers.html"
  },
  {
    id: "onam",
    start: "2026-08-25",
    end: "2026-08-29",
    name: "Onam",
    tradition: "Kerala harvest tradition",
    eyebrow: "Onam wishes",
    title: "A generous season of welcome",
    message: "Celebrate Onam with hospitality, abundance, and a table made for sharing.",
    art: "✿",
    action: "Explore the menu",
    actionUrl: "menu.html"
  },
  {
    id: "janmashtami",
    start: "2026-09-04",
    end: "2026-09-05",
    name: "Janmashtami",
    tradition: "Hindu tradition",
    eyebrow: "A joyful birthday celebration",
    title: "Sweetness for the evening",
    message: "Mark Janmashtami with warm hospitality, festive treats, and time with your community.",
    art: "ॐ",
    action: "View festive offers",
    actionUrl: "offers.html"
  },
  {
    id: "ganesh-chaturthi",
    start: "2026-09-01",
    end: "2026-09-24",
    name: "Ganesh Chaturthi",
    tradition: "Hindu tradition",
    eyebrow: "Ganpati Bappa Morya",
    title: "A sweet season of new beginnings",
    message: "Celebrate with saffron chai, cardamom bakes, and a little extra sweetness at Cafe-Creme.",
    art: "ॐ",
    action: "View festive offers",
    actionUrl: "offers.html"
  },
  {
    id: "navratri",
    start: "2026-10-11",
    end: "2026-10-20",
    name: "Navratri",
    tradition: "Hindu tradition",
    eyebrow: "Nine nights, many flavours",
    title: "Gather around something warm",
    message: "A festive table of spiced chai, saffron treats, and bright seasonal plates awaits.",
    art: "✦",
    action: "Explore the menu",
    actionUrl: "menu.html"
  },
  {
    id: "diwali",
    start: "2026-11-01",
    end: "2026-11-12",
    name: "Diwali",
    tradition: "Hindu, Jain, Sikh, and regional traditions",
    eyebrow: "A little more light",
    title: "Share the glow",
    message: "Bring your favourite people together for festive sweets, coffee, and glowing evenings.",
    art: "दीप",
    action: "Plan your table",
    actionUrl: "reservations.html"
  },
  {
    id: "guru-nanak-gurpurab",
    start: "2026-11-24",
    end: "2026-11-25",
    name: "Guru Nanak Gurpurab",
    tradition: "Sikh tradition",
    eyebrow: "Chardi Kala",
    title: "A table rooted in service",
    message: "Wishing our Sikh community a meaningful Gurpurab filled with seva, peace, and fellowship.",
    art: "ੴ",
    action: "Reserve a table",
    actionUrl: "reservations.html"
  },
  {
    id: "christmas",
    start: "2026-12-24",
    end: "2026-12-26",
    name: "Christmas",
    tradition: "Christian tradition",
    eyebrow: "Merry Christmas",
    title: "Make room for joy",
    message: "Celebrate with festive bakes, warm coffee, and a table where everyone feels welcome.",
    art: "✦",
    action: "Reserve a table",
    actionUrl: "reservations.html"
  }
];

function getCurrentFestival() {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const adminSetting = JSON.parse(localStorage.getItem("cafe-creme-active-festival") || "null");
  if (adminSetting && Object.prototype.hasOwnProperty.call(adminSetting, "enabled")) {
    if (!adminSetting.enabled || !adminSetting.festivalId) return null;
    const schedule = adminSetting.schedule;
    if (schedule?.enabled && (!schedule.start || !schedule.end || today < schedule.start || today > schedule.end)) return null;
    return festivalCalendar.find((festival) => festival.id === adminSetting.festivalId) || null;
  }
  const previewFestival = new URLSearchParams(window.location.search).get("festival");
  const previewKey = "cafe-creme-festival-preview";
  if (previewFestival === "none") {
    sessionStorage.removeItem(previewKey);
    return null;
  }
  if (previewFestival) {
    const selectedFestival = festivalCalendar.find((festival) => festival.id === previewFestival);
    if (selectedFestival) sessionStorage.setItem(previewKey, selectedFestival.id);
    return selectedFestival;
  }
  const savedPreview = sessionStorage.getItem(previewKey);
  if (savedPreview) return festivalCalendar.find((festival) => festival.id === savedPreview) || null;
  return festivalCalendar
    .filter((festival) => today >= festival.start && today <= festival.end)
    .sort((first, second) => (festivalPriority[second.id] || 0) - (festivalPriority[first.id] || 0))[0];
}

const festivalThemes = {
  default: { coffee: "#4a2c24", cream: "#fff7e8", peach: "#e8bd82", caramel: "#c56a2d", cardamom: "#596b4f", surface: "#ffffff", border: "#eadbca" },
  saffron: { coffee: "#5b2c1b", cream: "#fff8e8", peach: "#e8ad35", caramel: "#c35425", cardamom: "#596b3f", surface: "#fffdf7", border: "#e5c47c" },
  muslim: { coffee: "#203f38", cream: "#f7fbef", peach: "#d6b45c", caramel: "#9c6b1f", cardamom: "#3d765b", surface: "#fcfdf7", border: "#cfd9ae" },
  sikh: { coffee: "#173c68", cream: "#f7f9fc", peach: "#e2a33b", caramel: "#b76820", cardamom: "#47736b", surface: "#ffffff", border: "#c6d5e5" },
  christian: { coffee: "#4c2930", cream: "#fff9f3", peach: "#c98761", caramel: "#a44b3c", cardamom: "#3f654d", surface: "#fffdf9", border: "#e3c0b4" },
  buddhist: { coffee: "#4b3320", cream: "#fff9e8", peach: "#dda444", caramel: "#bf6f25", cardamom: "#39766c", surface: "#fffdf7", border: "#e4cb91" },
  jain: { coffee: "#344b3d", cream: "#fffdf3", peach: "#d7ba70", caramel: "#718b43", cardamom: "#48705b", surface: "#ffffff", border: "#d9dfbd" },
  parsi: { coffee: "#1e4661", cream: "#f7fbfc", peach: "#d5ae4d", caramel: "#ad702b", cardamom: "#4d766d", surface: "#ffffff", border: "#c7dbe1" },
  rose: { coffee: "#612b38", cream: "#fff5f4", peach: "#e7a0a9", caramel: "#a9354d", cardamom: "#66705a", surface: "#fffafb", border: "#e7b8bd" },
  harvest: { coffee: "#5a3423", cream: "#fff8e7", peach: "#e6ad62", caramel: "#b8572d", cardamom: "#5d704d", surface: "#fffdf7", border: "#e3c18d" },
  spring: { coffee: "#54302a", cream: "#fff7eb", peach: "#f0ae72", caramel: "#bd4b43", cardamom: "#58704f", surface: "#fffdf8", border: "#e5b69a" }
};

const festivalThemeNames = {
  "valentines-day": "rose",
  "diwali": "saffron",
  holi: "spring",
  navratri: "saffron",
  "ganesh-chaturthi": "saffron",
  lohri: "harvest",
  "makar-sankranti": "harvest",
  pongal: "harvest",
  "vasant-panchami": "saffron",
  "maha-shivratri": "saffron",
  ramadan: "muslim",
  "eid-al-fitr": "muslim",
  "eid-al-adha": "muslim",
  "mahavir-jayanti": "jain",
  "good-friday": "christian",
  easter: "christian",
  baisakhi: "sikh",
  "buddha-purnima": "buddhist",
  "rath-yatra": "saffron",
  "parsi-new-year": "parsi",
  onam: "harvest",
  janmashtami: "saffron",
  "guru-nanak-gurpurab": "sikh",
  christmas: "christian"
};

const festivalPriority = {
  "ganesh-chaturthi": 100,
  diwali: 100,
  holi: 95,
  navratri: 95,
  "janmashtami": 90,
  ramadan: 85,
  "eid-al-fitr": 90,
  "eid-al-adha": 90,
  christmas: 90
};

function applyFestivalThemeVariables(festival) {
  const festivalClasses = festivalCalendar.map((item) => `festival-${item.id}`);
  document.body.classList.remove(...festivalClasses);
  if (!festival) {
    document.body.removeAttribute("data-festival");
    Object.entries(festivalThemes.default).forEach(([name, value]) => document.body.style.setProperty(`--${name}`, value));
    return;
  }
  document.body.classList.add(`festival-${festival.id}`);
  document.body.dataset.festival = festival.id;
  const theme = festivalThemes[festivalThemeNames[festival.id] || "default"];
  Object.entries(theme).forEach(([name, value]) => document.body.style.setProperty(`--${name}`, value));
}

const currentFestival = getCurrentFestival();
if (currentFestival) {
  applyFestivalThemeVariables(currentFestival);
  if (festivalBanner) {
    festivalBanner.classList.remove("d-none");
    festivalBanner.innerHTML = `
    <div class="festival-art" aria-hidden="true">${currentFestival.art}</div>
    <div class="festival-copy"><p class="festival-eyebrow">${currentFestival.eyebrow}</p><h2>${currentFestival.title}</h2><p>${currentFestival.message}</p><small class="festival-tradition">${currentFestival.tradition}</small><div><a class="btn btn-dark" href="${currentFestival.actionUrl}">${currentFestival.action}</a></div></div>
    <div class="festival-name">${currentFestival.name}</div>
  `;
  }
} else {
  applyFestivalThemeVariables(null);
}

window.addEventListener("storage", (event) => {
  if (event.key === "cafe-creme-active-festival") window.location.reload();
});
window.addEventListener("cafe-creme-festival-change", (event) => {
  applyFestivalThemeVariables(getCurrentFestival());
});
window.setInterval(() => {
  const latestFestivalId = getCurrentFestival()?.id || "";
  if (latestFestivalId !== (currentFestival?.id || "")) window.location.reload();
}, 60000);

const festivalCampaigns = {
  "ganesh-chaturthi": { offer: "Ganpati Bappa Sharing Box", price: "₹299", discount: "10% off", coupon: "GANPATI10", note: "Saffron chai, cardamom bun, and a festive sweet." },
  diwali: { offer: "Diwali Glow Box", price: "₹499", discount: "15% off", coupon: "DIWALI15", note: "A shareable box of coffee, bakes, and festive sweetness." },
  holi: { offer: "Holi Coolers Combo", price: "₹349", discount: "10% off", coupon: "HOLI10", note: "Colourful coolers and playful bakery treats." },
  christmas: { offer: "Christmas Bake Box", price: "₹599", discount: "15% off", coupon: "MERRY15", note: "Festive bakes made for sharing." },
  "valentines-day": { offer: "Made-for-two Coffee Box", price: "₹399", discount: "10% off", coupon: "LOVE10", note: "Two coffees and something sweet to share." }
};

Object.values(festivalCampaigns).forEach((campaign) => { campaign.price = String(campaign.price).replace(/[^0-9]/g, ""); });
const festivalCurrency = (amount) => `${String.fromCodePoint(0x20B9)}${amount}`;
const savedFestivalCampaigns = JSON.parse(localStorage.getItem("cafe-creme-festival-campaigns") || "{}");
Object.entries(savedFestivalCampaigns).forEach(([id, value]) => {
  if (Array.isArray(value)) {
    const [offer, price, discount, coupon, note] = value;
    savedFestivalCampaigns[id] = { offer: offer || "Seasonal Cafe Special", price: price || "", discount: discount || "", coupon: coupon || "", note: note || "Discover something special from the Cafe-Creme kitchen." };
  }
});
Object.assign(festivalCampaigns, savedFestivalCampaigns);
Object.values(festivalCampaigns).forEach((campaign) => {
  campaign.offer = campaign.offer || "Seasonal Cafe Special";
  campaign.price = String(campaign.price || "").replace(/[^0-9]/g, "");
  campaign.discount = campaign.discount || "Seasonal saving";
  campaign.coupon = campaign.coupon || "";
  campaign.note = campaign.note || "Discover something special from the Cafe-Creme kitchen.";
});
window.festivalCampaigns = festivalCampaigns;

function safeFestivalArt(festival) {
  if (festival.art && !/[ÃÂâà]/.test(festival.art)) return festival.art;
  return { diwali: "✦", holi: "●", "valentines-day": "♥", christmas: "✦" }[festival.id] || "✦";
}

if (currentFestival && festivalBanner) {
  const campaign = festivalCampaigns[currentFestival.id] || { offer: "Seasonal Cafe Special", price: "", discount: "", coupon: "", note: "Discover something special from the Cafe-Creme kitchen." };
  const festivalSymbol = currentFestival.id === "holi" ? String.fromCodePoint(0x25cf) : currentFestival.id === "valentines-day" ? String.fromCodePoint(0x2665) : String.fromCodePoint(0x2726);
  const dismissKey = `cafe-creme-festival-dismissed-${currentFestival.id}`;
  const dismissed = sessionStorage.getItem(dismissKey) === "true";
  if (!dismissed) {
    const endDate = new Date(`${currentFestival.end}T23:59:59+05:30`);
    festivalBanner.innerHTML = `<button class="festival-dismiss" type="button" aria-label="Dismiss festival offer">×</button><div class="festival-art" aria-hidden="true">${festivalSymbol}</div><div class="festival-copy"><p class="festival-eyebrow">${currentFestival.eyebrow}</p><h2>${currentFestival.title}</h2><p>${currentFestival.message}</p><div class="festival-offer"><strong>${campaign.offer}</strong>${campaign.price ? `<span>${festivalCurrency(campaign.price)} · ${campaign.discount}</span>` : ""}<small>${campaign.note}</small></div><div class="festival-actions"><a class="btn btn-dark" href="${currentFestival.actionUrl}">${currentFestival.action}</a>${campaign.coupon ? `<span class="festival-coupon">Use ${campaign.coupon}</span>` : ""}<small class="festival-countdown" data-end="${endDate.toISOString()}"></small></div><small class="festival-tradition">${currentFestival.tradition}</small></div><div class="festival-name">${currentFestival.name}</div>`;
    festivalBanner.querySelector(".festival-dismiss").textContent = String.fromCodePoint(0x00d7);
    const offerPrice = festivalBanner.querySelector(".festival-offer span");
    if (offerPrice) offerPrice.textContent = `${festivalCurrency(campaign.price)} ${String.fromCodePoint(0x00b7)} ${campaign.discount}`;
    festivalBanner.querySelector(".festival-dismiss").addEventListener("click", () => { sessionStorage.setItem(dismissKey, "true"); festivalBanner.remove(); });
    const countdown = festivalBanner.querySelector(".festival-countdown");
    const updateCountdown = () => { const remaining = Math.max(0, endDate - new Date()); const days = Math.floor(remaining / 86400000); const hours = Math.floor((remaining % 86400000) / 3600000); countdown.textContent = remaining ? `Offer ends in ${days}d ${hours}h` : "Offer ends today"; };
    updateCountdown(); window.setInterval(updateCountdown, 60000);
  } else festivalBanner.classList.add("d-none");
}
