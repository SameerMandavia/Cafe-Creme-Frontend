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
  },
  {
    id: "new-year",
    start: "2026-01-01", end: "2026-01-03", name: "New Year", tradition: "National celebration",
    eyebrow: "A fresh start", title: "Begin the year around a warm table", message: "Raise a cup to new rituals, good company, and bright beginnings.", art: "*", action: "Order a celebration box", actionUrl: "menu.html"
  },
  {
    id: "republic-day",
    start: "2026-01-26", end: "2026-01-27", name: "Republic Day", tradition: "Indian national occasion",
    eyebrow: "Pride and togetherness", title: "A table for every India", message: "Celebrate the spirit of India with familiar flavours and good company.", art: "*", action: "Explore the menu", actionUrl: "menu.html"
  },
  {
    id: "ugadi",
    start: "2026-03-19", end: "2026-03-20", name: "Ugadi", tradition: "Kannada and Telugu New Year",
    eyebrow: "A new season begins", title: "Welcome the year with sweetness", message: "Share a hopeful new beginning with a warm cup and something freshly baked.", art: "*", action: "Explore festive picks", actionUrl: "menu.html"
  },
  {
    id: "gudi-padwa",
    start: "2026-03-19", end: "2026-03-20", name: "Gudi Padwa", tradition: "Maharashtrian and Konkani New Year",
    eyebrow: "A bright new beginning", title: "Celebrate a year of abundance", message: "Gather with family, festive sweetness, and a little Cafe-Creme comfort.", art: "*", action: "Explore festive picks", actionUrl: "menu.html"
  },
  {
    id: "ram-navami",
    start: "2026-03-27", end: "2026-03-28", name: "Ram Navami", tradition: "Hindu tradition",
    eyebrow: "A day of devotion", title: "A peaceful table to share", message: "Mark the occasion with warmth, hospitality, and mindful moments together.", art: "*", action: "Plan your table", actionUrl: "reservations.html"
  },
  {
    id: "tamil-new-year",
    start: "2026-04-14", end: "2026-04-15", name: "Tamil New Year", tradition: "Tamil New Year celebration",
    eyebrow: "Puthandu vazhthukkal", title: "A sweet start to the year", message: "Welcome Puthandu with a generous table, fresh bakes, and a comforting cup.", art: "*", action: "Explore the menu", actionUrl: "menu.html"
  },
  {
    id: "vishu",
    start: "2026-04-14", end: "2026-04-15", name: "Vishu", tradition: "Malayali New Year celebration",
    eyebrow: "Vishu wishes", title: "A bright beginning", message: "Celebrate the season with gratitude, sweetness, and time with loved ones.", art: "*", action: "Explore the menu", actionUrl: "menu.html"
  },
  {
    id: "bihu",
    start: "2026-04-14", end: "2026-04-15", name: "Bohag Bihu", tradition: "Assamese harvest celebration",
    eyebrow: "New season, new energy", title: "Celebrate the harvest together", message: "A warm welcome to spring, community, and generous sharing.", art: "*", action: "Explore festive picks", actionUrl: "menu.html"
  },
  {
    id: "akshaya-tritiya",
    start: "2026-04-19", end: "2026-04-20", name: "Akshaya Tritiya", tradition: "Hindu and Jain tradition",
    eyebrow: "Auspicious beginnings", title: "Make room for something good", message: "Share a sweet moment and start a new ritual with Cafe-Creme.", art: "*", action: "View festive offers", actionUrl: "offers.html"
  },
  {
    id: "independence-day",
    start: "2026-08-15", end: "2026-08-16", name: "Independence Day", tradition: "Indian national occasion",
    eyebrow: "Pride in every place", title: "Flavours that bring us together", message: "Celebrate the colours, stories, and shared spirit of India.", art: "*", action: "Explore the menu", actionUrl: "menu.html"
  },
  {
    id: "raksha-bandhan",
    start: "2026-08-28", end: "2026-08-29", name: "Raksha Bandhan", tradition: "Hindu and regional tradition",
    eyebrow: "Made for the people who know you best", title: "Share a little sweetness", message: "Celebrate sibling bonds with a thoughtful coffee, bake, or gift box.", art: "*", action: "Send a gift", actionUrl: "menu.html"
  },
  {
    id: "teachers-day",
    start: "2026-09-05", end: "2026-09-06", name: "Teachers' Day", tradition: "Indian appreciation occasion",
    eyebrow: "For the ones who guide us", title: "Say thank you over coffee", message: "Make a teacher's day with a warm cup and a thoughtful treat.", art: "*", action: "Explore gift picks", actionUrl: "menu.html"
  },
  {
    id: "dussehra",
    start: "2026-10-20", end: "2026-10-21", name: "Dussehra", tradition: "Hindu and regional tradition",
    eyebrow: "A hopeful victory", title: "Gather around something good", message: "Celebrate courage, renewal, and the people who make every day brighter.", art: "*", action: "Explore the menu", actionUrl: "menu.html"
  },
  {
    id: "karwa-chauth",
    start: "2026-10-29", end: "2026-10-30", name: "Karwa Chauth", tradition: "Hindu and regional tradition",
    eyebrow: "Made for togetherness", title: "A thoughtful table for two", message: "Plan a warm evening with coffee, sweetness, and a little time together.", art: "*", action: "Reserve a table", actionUrl: "reservations.html"
  },
  {
    id: "dhanteras",
    start: "2026-11-06", end: "2026-11-07", name: "Dhanteras", tradition: "Hindu, Jain, and regional tradition",
    eyebrow: "A little more light", title: "Begin the festive week", message: "Welcome prosperity with glowing tables, festive bakes, and good company.", art: "*", action: "View festive offers", actionUrl: "offers.html"
  },
  {
    id: "bhai-dooj",
    start: "2026-11-11", end: "2026-11-12", name: "Bhai Dooj", tradition: "Hindu and regional tradition",
    eyebrow: "For the bond that lasts", title: "One more sweet moment together", message: "Share a coffee, a bake, and a memory with your sibling.", art: "*", action: "Order a gift", actionUrl: "menu.html"
  },
  {
    id: "childrens-day",
    start: "2026-11-14", end: "2026-11-15", name: "Children's Day", tradition: "Indian appreciation occasion",
    eyebrow: "Small joys, big smiles", title: "Make room for a little fun", message: "Celebrate the children in your life with playful treats and a welcoming table.", art: "*", action: "See sweet treats", actionUrl: "menu.html"
  },
  {
    id: "womens-day",
    start: "2026-03-08", end: "2026-03-09", name: "International Women's Day", tradition: "Global appreciation occasion",
    eyebrow: "Celebrating everyday strength", title: "Make time for the women you love", message: "Gather over coffee, conversation, and a table made for meaningful moments.", art: "*", action: "Reserve a table", actionUrl: "reservations.html"
  },
  {
    id: "mothers-day",
    start: "2026-05-10", end: "2026-05-11", name: "Mother's Day", tradition: "Contemporary celebration",
    eyebrow: "For the heart of every home", title: "Give her a slower morning", message: "Send a thoughtful breakfast box or bring her in for coffee and cake.", art: "*", action: "Send a gift", actionUrl: "menu.html"
  },
  {
    id: "fathers-day",
    start: "2026-06-21", end: "2026-06-22", name: "Father's Day", tradition: "Contemporary celebration",
    eyebrow: "For the one who is always there", title: "Coffee, cake, and a proper thank you", message: "Celebrate Dad with his favourite cup and a little time together.", art: "*", action: "Explore gift picks", actionUrl: "menu.html"
  },
  {
    id: "friendship-day",
    start: "2026-08-02", end: "2026-08-03", name: "Friendship Day", tradition: "Contemporary celebration",
    eyebrow: "Better together", title: "Bring your people to the table", message: "Share a round of favourites and make space for the stories that keep you close.", art: "*", action: "Plan your table", actionUrl: "reservations.html"
  },
  {
    id: "govardhan-puja",
    start: "2026-11-11", end: "2026-11-12", name: "Govardhan Puja", tradition: "Hindu and regional tradition",
    eyebrow: "Gratitude and abundance", title: "A generous table for sharing", message: "Continue the festive spirit with comforting flavours and warm hospitality.", art: "*", action: "Explore festive picks", actionUrl: "menu.html"
  },
  {
    id: "chhath-puja",
    start: "2026-11-13", end: "2026-11-17", name: "Chhath Puja", tradition: "Bihar, Jharkhand, eastern Uttar Pradesh, and regional tradition",
    eyebrow: "Gratitude to the sun", title: "A peaceful moment of togetherness", message: "Wishing our community a meaningful Chhath filled with faith, gratitude, and family.", art: "*", action: "Explore the menu", actionUrl: "menu.html"
  },
  {
    id: "muharram",
    start: "2026-06-17", end: "2026-06-27", name: "Muharram", tradition: "Muslim tradition",
    eyebrow: "A time for reflection", title: "A peaceful place to pause", message: "Wishing our community a meaningful period of reflection, remembrance, and togetherness.", art: "*", action: "Plan your table", actionUrl: "reservations.html"
  },
  {
    id: "milad-un-nabi",
    start: "2026-08-25", end: "2026-08-27", name: "Milad-un-Nabi", tradition: "Muslim tradition",
    eyebrow: "Peace and goodwill", title: "Gather with kindness", message: "Wishing our community peace, generosity, and warm moments shared together.", art: "*", action: "Explore the menu", actionUrl: "menu.html"
  }
];

function getCurrentFestival() {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const previewFestival = new URLSearchParams(window.location.search).get("festival");
  const previewKey = "cafe-creme-festival-preview";
  if (previewFestival === "none") {
    sessionStorage.removeItem(previewKey);
    return null;
  }
  if (previewFestival) {
    const selectedFestival = festivalCalendar.find((festival) => festival.id === previewFestival);
    if (selectedFestival) {
      sessionStorage.setItem(previewKey, selectedFestival.id);
      return selectedFestival;
    }
  }
  const adminSetting = JSON.parse(localStorage.getItem("cafe-creme-active-festival") || "null");
  if (adminSetting && Object.prototype.hasOwnProperty.call(adminSetting, "enabled")) {
    if (!adminSetting.enabled || !adminSetting.festivalId) return null;
    const schedule = adminSetting.schedule;
    if (schedule?.enabled && (!schedule.start || !schedule.end || today < schedule.start || today > schedule.end)) return null;
    return festivalCalendar.find((festival) => festival.id === adminSetting.festivalId) || null;
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
  spring: { coffee: "#54302a", cream: "#fff7eb", peach: "#f0ae72", caramel: "#bd4b43", cardamom: "#58704f", surface: "#fffdf8", border: "#e5b69a" },
  diya: { coffee: "#30254f", cream: "#fff8e8", peach: "#e5b84f", caramel: "#c15b2d", cardamom: "#49604b", surface: "#fffdf5", border: "#dfbd68" },
  holi: { coffee: "#442448", cream: "#fff8f1", peach: "#f1b447", caramel: "#d84d65", cardamom: "#36716b", surface: "#fffdf9", border: "#e5a4ad" },
  navratri: { coffee: "#3c204e", cream: "#fff7ed", peach: "#d89a3b", caramel: "#a93650", cardamom: "#3f6659", surface: "#fffdf8", border: "#d9a3a9" },
  peacock: { coffee: "#123f52", cream: "#f5fbf4", peach: "#e5ba52", caramel: "#bd7530", cardamom: "#327169", surface: "#fcfdf8", border: "#b9d9c9" },
  shiva: { coffee: "#202d50", cream: "#f6f8fc", peach: "#aab9d4", caramel: "#65789e", cardamom: "#4e756e", surface: "#ffffff", border: "#c5d0e2" },
  ram: { coffee: "#5a2d22", cream: "#fff8e9", peach: "#e4ac4b", caramel: "#bd542b", cardamom: "#56704b", surface: "#fffdf7", border: "#e1bd7c" },
  rangoli: { coffee: "#401e45", cream: "#fff8f1", peach: "#e9a53f", caramel: "#c94d54", cardamom: "#47715e", surface: "#fffdf8", border: "#dda5af" },
  rakhi: { coffee: "#512d49", cream: "#fff7f7", peach: "#e5a0a5", caramel: "#b64b68", cardamom: "#657251", surface: "#fffafd", border: "#e4b8c4" },
  sunrise: { coffee: "#25465b", cream: "#fff9ed", peach: "#efa75d", caramel: "#cd6334", cardamom: "#4b7264", surface: "#fffdf8", border: "#e6bd94" },
  pongal: { coffee: "#4a3020", cream: "#fff9e8", peach: "#e2b64e", caramel: "#b9682e", cardamom: "#58704b", surface: "#fffdf7", border: "#e1c27f" },
  onam: { coffee: "#285348", cream: "#fffdf0", peach: "#e2bd67", caramel: "#bd7934", cardamom: "#4c795a", surface: "#fffef9", border: "#cbd9b0" }
};

const festivalThemeNames = {
  "valentines-day": "rose",
  "diwali": "diya",
  holi: "holi",
  navratri: "navratri",
  "ganesh-chaturthi": "diya",
  lohri: "harvest",
  "makar-sankranti": "harvest",
  pongal: "pongal",
  "vasant-panchami": "saffron",
  "maha-shivratri": "shiva",
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
  onam: "onam",
  janmashtami: "peacock",
  "guru-nanak-gurpurab": "sikh",
  christmas: "christian",
  "new-year": "spring",
  "republic-day": "saffron",
  "ugadi": "rangoli",
  "gudi-padwa": "rangoli",
  "ram-navami": "ram",
  "tamil-new-year": "harvest",
  vishu: "harvest",
  bihu: "harvest",
  "akshaya-tritiya": "diya",
  "independence-day": "saffron",
  "raksha-bandhan": "rakhi",
  "teachers-day": "spring",
  "dussehra": "rangoli",
  "karwa-chauth": "rose",
  "dhanteras": "diya",
  "bhai-dooj": "rose",
  "childrens-day": "spring",
  "womens-day": "rose",
  "mothers-day": "rose",
  "fathers-day": "spring",
  "friendship-day": "rose",
  "govardhan-puja": "saffron",
  "chhath-puja": "sunrise",
  "muharram": "muslim",
  "milad-un-nabi": "muslim"
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
    ["--festival-surface", "--festival-border", "--festival-accent"].forEach((name) => document.body.style.removeProperty(name));
    Object.entries(festivalThemes.default).forEach(([name, value]) => document.body.style.setProperty(`--${name}`, value));
    return;
  }
  document.body.classList.add(`festival-${festival.id}`);
  document.body.dataset.festival = festival.id;
  const theme = festivalThemes[festivalThemeNames[festival.id] || "default"];
  Object.entries(theme).forEach(([name, value]) => document.body.style.setProperty(`--${name}`, value));
  document.body.style.setProperty("--festival-surface", theme.peach);
  document.body.style.setProperty("--festival-border", theme.caramel);
  document.body.style.setProperty("--festival-accent", theme.caramel);
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
    const [offer, price, discount, coupon, note, heroImage, heroAlt] = value;
    savedFestivalCampaigns[id] = { offer: offer || "Seasonal Cafe Special", price: price || "", discount: discount || "", coupon: coupon || "", note: note || "Discover something special from the Cafe-Creme kitchen.", heroImage: heroImage || "", heroAlt: heroAlt || "Festive Cafe-Creme special" };
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

const festivalSpecials = document.querySelector("#festival-specials");
const festivalVisualImages = {
  christmas: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=900&q=85",
  diwali: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  holi: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=85",
  "valentines-day": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=85",
  "ganesh-chaturthi": "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=85"
};
const celebrationImage = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=85";
[
  "lohri", "makar-sankranti", "pongal", "vasant-panchami", "maha-shivratri", "ramadan", "eid-al-fitr", "mahavir-jayanti", "good-friday", "easter", "baisakhi", "buddha-purnima", "eid-al-adha", "rath-yatra", "parsi-new-year", "onam", "janmashtami", "guru-nanak-gurpurab", "new-year", "republic-day", "ugadi", "gudi-padwa", "ram-navami", "tamil-new-year", "vishu", "bihu", "akshaya-tritiya", "independence-day", "raksha-bandhan", "teachers-day", "dussehra", "karwa-chauth", "dhanteras", "bhai-dooj", "childrens-day", "womens-day", "mothers-day", "fathers-day", "friendship-day", "govardhan-puja", "chhath-puja"
  , "muharram", "milad-un-nabi"
].forEach((id) => { festivalVisualImages[id] = celebrationImage; });
const festivalSpecialItems = {
  "ganesh-chaturthi": [
    { id: "filter-coffee", name: "Festive Filter Coffee", note: "Smooth coffee for a warm gathering.", price: 160, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" },
    { id: "cardamom-bun", name: "Cardamom Sharing Bun", note: "Soft, fragrant, and made to share.", price: 150, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" },
    { id: "saffron-milk-cake", name: "Saffron Milk Cake", note: "A golden sweet finish with pistachio.", price: 220, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80" }
  ],
  diwali: [
    { id: "velvet-latte", name: "Diwali Velvet Latte", note: "Silky espresso for glowing evenings.", price: 190, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" },
    { id: "saffron-milk-cake", name: "Saffron Milk Cake", note: "A festive bakery favourite.", price: 220, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80" },
    { id: "butter-croissant", name: "Golden Bake Box", note: "Freshly baked treats for the table.", price: 180, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80" }
  ],
  holi: [
    { id: "ginger-honey-tea", name: "Ginger Honey Cooler", note: "Bright, refreshing, and lightly sweet.", price: 140, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80" },
    { id: "chocolate-brownie", name: "Colourful Brownie Pair", note: "Playful sweetness for sharing.", price: 170, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80" }
  ]
};

function renderFestivalSpecials() {
  if (!festivalSpecials || !currentFestival) return;
  const campaign = festivalCampaigns[currentFestival.id] || {};
  const items = festivalSpecialItems[currentFestival.id] || [
    { id: "masala-chai", name: `${currentFestival.name} Masala Chai`, note: "A comforting cup for the occasion.", price: 120, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80" },
    { id: "cardamom-bun", name: "Cardamom Celebration Bun", note: "Freshly baked and gently spiced.", price: 150, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" },
    { id: "saffron-milk-cake", name: "Saffron Milk Cake", note: "A soft, festive sweet to share.", price: 220, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80" }
  ];
  festivalSpecials.classList.remove("d-none");
  festivalSpecials.innerHTML = `<div class="festival-specials-heading"><div><p class="cafe-eyebrow">Only for a limited time</p><h2 id="festival-specials-title">${currentFestival.name} specials</h2><p>Small-batch favourites inspired by the season, prepared fresh at Cafe-Creme.</p></div><a class="section-link" href="menu.html">View full menu</a></div><div class="festival-specials-track">${items.map((item) => `<article class="festival-special-card"><img src="${item.image}" alt="${item.name}" loading="lazy" /><div><span class="festival-special-tag">Festive pick</span><h3>${item.name}</h3><p>${item.note}</p><strong>${festivalCurrency(item.price)}</strong><button class="btn btn-dark btn-sm festival-add-button" type="button" data-festival-item="${item.id}">Add to order</button></div></article>`).join("")}</div>${campaign.coupon ? `<p class="festival-specials-note">Save with <strong>${campaign.coupon}</strong> at checkout.</p>` : ""}`;
  festivalSpecials.querySelectorAll(".festival-add-button").forEach((button) => button.addEventListener("click", () => { const cart = JSON.parse(localStorage.getItem("cafe-creme-cart") || "{}"); cart[button.dataset.festivalItem] = (cart[button.dataset.festivalItem] || 0) + 1; localStorage.setItem("cafe-creme-cart", JSON.stringify(cart)); button.textContent = "Added"; button.classList.add("is-added"); window.dispatchEvent(new StorageEvent("storage", { key: "cafe-creme-cart" })); }));
}

function safeFestivalArt(festival) {
  if (festival.art && !/[ÃÂâà]/.test(festival.art)) return festival.art;
  return { diwali: "✦", holi: "●", "valentines-day": "♥", christmas: "✦" }[festival.id] || "✦";
}

if (currentFestival && festivalBanner) {
  const campaign = festivalCampaigns[currentFestival.id] || { offer: "Seasonal Cafe Special", price: "", discount: "", coupon: "", note: "Discover something special from the Cafe-Creme kitchen." };
  const festivalSymbol = currentFestival.id === "holi" ? String.fromCodePoint(0x25cf) : currentFestival.id === "valentines-day" ? String.fromCodePoint(0x2665) : String.fromCodePoint(0x2726);
  const dismissKey = `cafe-creme-festival-dismissed-${currentFestival.id}`;
  const isPreview = new URLSearchParams(window.location.search).has("festival");
  const dismissed = !isPreview && sessionStorage.getItem(dismissKey) === "true";
  if (!dismissed) {
    const endDate = new Date(`${currentFestival.end}T23:59:59+05:30`);
    festivalBanner.innerHTML = `<button class="festival-dismiss" type="button" aria-label="Dismiss festival offer">×</button><div class="festival-art" aria-hidden="true">${festivalSymbol}</div><div class="festival-copy"><p class="festival-eyebrow">${currentFestival.eyebrow}</p><h2>${currentFestival.title}</h2><p>${currentFestival.message}</p><div class="festival-offer"><strong>${campaign.offer}</strong>${campaign.price ? `<span>${festivalCurrency(campaign.price)} · ${campaign.discount}</span>` : ""}<small>${campaign.note}</small></div><div class="festival-actions"><a class="btn btn-dark" href="${currentFestival.actionUrl}">${currentFestival.action}</a>${campaign.coupon ? `<span class="festival-coupon">Use ${campaign.coupon}</span>` : ""}<small class="festival-countdown" data-end="${endDate.toISOString()}"></small></div><small class="festival-tradition">${currentFestival.tradition}</small></div><div class="festival-name">${currentFestival.name}</div>`;
    const festivalVisual = document.createElement("div");
    festivalVisual.className = "festival-visual";
    festivalVisual.innerHTML = `<div class="festival-visual-glow"></div><img src="${festivalVisualImages[currentFestival.id] || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"}" alt="Festive Cafe-Creme special" loading="eager" /><span class="festival-decoration festival-decoration-one">*</span><span class="festival-decoration festival-decoration-two">+</span>`;
    if (campaign.heroImage) festivalVisual.querySelector("img").src = campaign.heroImage;
    if (campaign.heroAlt) festivalVisual.querySelector("img").alt = campaign.heroAlt;
    const festivalName = festivalBanner.querySelector(".festival-name");
    if (festivalName) festivalVisual.appendChild(festivalName);
    festivalBanner.appendChild(festivalVisual);
    festivalBanner.classList.add("has-visual");
    festivalBanner.querySelector(".festival-dismiss").textContent = String.fromCodePoint(0x00d7);
    const offerPrice = festivalBanner.querySelector(".festival-offer span");
    if (offerPrice) offerPrice.textContent = `${festivalCurrency(campaign.price)} ${String.fromCodePoint(0x00b7)} ${campaign.discount}`;
    festivalBanner.querySelector(".festival-dismiss").addEventListener("click", () => { sessionStorage.setItem(dismissKey, "true"); festivalBanner.remove(); });
    const countdown = festivalBanner.querySelector(".festival-countdown");
    const updateCountdown = () => { const remaining = Math.max(0, endDate - new Date()); const days = Math.floor(remaining / 86400000); const hours = Math.floor((remaining % 86400000) / 3600000); countdown.textContent = remaining ? `Offer ends in ${days}d ${hours}h` : "Offer ends today"; };
    updateCountdown(); window.setInterval(updateCountdown, 60000);
  } else festivalBanner.classList.add("d-none");
}

renderFestivalSpecials();
