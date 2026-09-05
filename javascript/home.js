const timeGreeting = document.querySelector("#time-greeting");
const localDate = document.querySelector("#local-date");
const cafeStatus = document.querySelector("#cafe-status");

function updateCafeContext() {
  const now = new Date();
  const indiaTime = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: false
  }).formatToParts(now);
  const hours = Number(indiaTime.find((part) => part.type === "hour").value);
  const minutes = Number(indiaTime.find((part) => part.type === "minute").value);
  const currentMinutes = hours * 60 + minutes;
  const weekday = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long" }).format(now);
  const dateLabel = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" }).format(now);
  const isWeekend = weekday === "Saturday" || weekday === "Sunday";
  const openingMinutes = isWeekend ? 9 * 60 : 8 * 60;
  const closingMinutes = isWeekend ? 22 * 60 : 21 * 60;
  const isOpen = currentMinutes >= openingMinutes && currentMinutes < closingMinutes;

  let greeting = "Good evening";
  if (hours < 12) greeting = "Good morning";
  else if (hours < 17) greeting = "Good afternoon";
  timeGreeting.textContent = greeting;
  localDate.textContent = `${weekday}, ${dateLabel} · India time`;
  const openingLabel = isWeekend ? "9:00 AM" : "8:00 AM";
  cafeStatus.textContent = isOpen ? "Open now" : `Closed · opens ${openingLabel}`;
  cafeStatus.classList.toggle("is-open", isOpen);
  cafeStatus.classList.toggle("is-closed", !isOpen);
}

updateCafeContext();
setInterval(updateCafeContext, 60000);