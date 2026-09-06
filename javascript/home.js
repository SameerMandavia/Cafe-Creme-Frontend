const timeGreeting = document.querySelector("#time-greeting");
const localDate = document.querySelector("#local-date");
const cafeStatus = document.querySelector("#cafe-status");
const homeLocationLabel = document.querySelector("#home-location-label");
const heroAddressForm = document.querySelector("#hero-address-form");
const heroAddressInput = document.querySelector("#hero-address-input");
const homeOrderTracker = document.querySelector("#home-order-tracker");
const homeTrackerStatus = document.querySelector("#home-tracker-status");
const homeTrackerMeta = document.querySelector("#home-tracker-meta");
const savedAddress = JSON.parse(localStorage.getItem("cafe-creme-saved-address") || "null");
if (homeLocationLabel && savedAddress?.address) {
  const displayAddress = /^GPS location/i.test(savedAddress.address) ? "Current location" : savedAddress.address;
  homeLocationLabel.textContent = displayAddress.length > 30 ? `${displayAddress.slice(0, 30)}…` : displayAddress;
}
if (heroAddressInput && savedAddress?.address && !/^GPS location/i.test(savedAddress.address)) heroAddressInput.value = savedAddress.address;
heroAddressForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const address = heroAddressInput.value.trim();
  if (!address) { heroAddressInput.focus(); return; }
  localStorage.setItem("cafe-creme-saved-address", JSON.stringify({ address, latitude: "", longitude: "" }));
  if (homeLocationLabel) homeLocationLabel.textContent = address.length > 30 ? `${address.slice(0, 30)}…` : address;
  const locationLabel = document.querySelector(".nav-location strong");
  if (locationLabel) locationLabel.textContent = address.length > 24 ? `${address.slice(0, 24)}…` : address;
  window.location.href = "menu.html";
});
const recentOrders = JSON.parse(localStorage.getItem("cafe-creme-orders") || "[]");
const activeDeliveryOrder = recentOrders.find((order) => order.fulfilment === "delivery" && !["Delivered", "Cancelled"].includes(order.status));
const latestOrder = activeDeliveryOrder || recentOrders[0];
if (latestOrder && homeOrderTracker) {
  homeOrderTracker.classList.remove("d-none");
  const latestStatus = latestOrder.status || "Order received";
  homeTrackerStatus.textContent = latestStatus === "Delivered" ? "Latest order delivered" : latestStatus;
  homeTrackerMeta.textContent = activeDeliveryOrder ? (latestStatus === "Out for delivery" ? "Arriving soon · ETA 25–35 min" : "We’re preparing it with care") : "View your previous order details";
  const trackerLink = homeOrderTracker.querySelector("a");
  trackerLink.textContent = activeDeliveryOrder ? "Track now →" : "View orders →";
  trackerLink.href = activeDeliveryOrder ? "orders.html" : "orders.html";
}

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
