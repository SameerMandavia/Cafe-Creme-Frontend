const cartKey = "cafe-creme-cart";
const deliveryCharge = 39;
const freeDeliveryThreshold = 499;
const cartItemsContainer = document.querySelector("#cart-items");
const cartContent = document.querySelector("#cart-content");
const emptyCart = document.querySelector("#cart-empty");
const cartSubtotal = document.querySelector("#cart-subtotal");
const deliveryFee = document.querySelector("#delivery-fee");
const cartTotal = document.querySelector("#cart-total");
const placeOrderTotal = document.querySelector("#place-order-total");
const checkoutForm = document.querySelector("#checkout-form");
const deliveryFields = document.querySelector("#delivery-fields");
const addressInput = document.querySelector("#checkout-address");
const timeHeading = document.querySelector("#time-heading");
const cart = JSON.parse(localStorage.getItem(cartKey) || "{}");
const sessionUser = JSON.parse(localStorage.getItem("cafe-creme-current-user") || "null");
const registeredUsers = JSON.parse(localStorage.getItem("cafe-creme-users") || "[]");
const checkoutUser = registeredUsers.find((user) => user.email === sessionUser?.email) || sessionUser;
const addressSearch = document.querySelector("#address-search");
const useCurrentLocationButton = document.querySelector("#use-current-location");
const locationStatus = document.querySelector("#location-status");
const latitudeInput = document.querySelector("#checkout-latitude");
const longitudeInput = document.querySelector("#checkout-longitude");
const mobileOrderTotal = document.querySelector("#mobile-order-total");
const mobilePlaceOrder = document.querySelector("#mobile-place-order");
const mapToggle = document.querySelector("#toggle-map");
const mobileOrderBar = document.querySelector(".mobile-order-bar");
const cartPanel = document.querySelector(".cart-panel");
const cartItemsToggle = document.querySelector("#toggle-cart-items");
const couponInput = document.querySelector("#checkout-coupon");
const couponStatus = document.querySelector("#coupon-status");
const discountRow = document.querySelector("#discount-row");
const couponDiscount = document.querySelector("#coupon-discount");
let cafeMap;
let cafeMarker;
let cafeGeocoder;
let leafletMap;
let leafletMarker;

function escapeHtml(value = "") { const node = document.createElement("div"); node.textContent = String(value); return node.innerHTML; }

function setSelectedLocation(latitude, longitude, address = "") {
  latitudeInput.value = Number(latitude).toFixed(6);
  longitudeInput.value = Number(longitude).toFixed(6);
  const coordinateLabel = `GPS location (${Number(latitude).toFixed(5)}, ${Number(longitude).toFixed(5)})`;
  if (address) {
    addressInput.value = address;
    addressSearch.value = address;
  } else if (!addressInput.value.trim()) {
    addressInput.value = coordinateLabel;
  }
  localStorage.setItem("cafe-creme-saved-address", JSON.stringify({ address: address || coordinateLabel, latitude: latitudeInput.value, longitude: longitudeInput.value }));
  if (cafeMap && cafeMarker) { const position = { lat: Number(latitude), lng: Number(longitude) }; cafeMap.setCenter(position); cafeMarker.setPosition(position); }
  if (leafletMap) { const position = [Number(latitude), Number(longitude)]; leafletMap.setView(position, 16); leafletMarker.setLatLng(position); }
  if (mapToggle.getAttribute("aria-expanded") !== "true") { mapToggle.setAttribute("aria-expanded", "true"); mapToggle.textContent = "Hide map"; document.querySelector("#address-map").classList.remove("is-collapsed"); if (leafletMap) window.setTimeout(() => leafletMap.invalidateSize(), 80); }
  locationStatus.textContent = address ? "Address selected. You can adjust the pin or address below." : `${coordinateLabel}. Add your house or street details below.`;
}

function reverseGeocode(latitude, longitude) {
  if (!cafeGeocoder) { setSelectedLocation(latitude, longitude); return; }
  cafeGeocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
    setSelectedLocation(latitude, longitude, status === "OK" && results[0] ? results[0].formatted_address : "");
  });
}

function initCafeMap() {
  const mapElement = document.querySelector("#address-map");
  if (!mapElement || !window.google?.maps) return;
  cafeMap = new google.maps.Map(mapElement, { center: { lat: 19.2813, lng: 73.0483 }, zoom: 14, mapTypeControl: false, streetViewControl: false, fullscreenControl: false });
  cafeMarker = new google.maps.Marker({ map: cafeMap, position: cafeMap.getCenter(), draggable: true, title: "Your delivery location" });
  cafeGeocoder = new google.maps.Geocoder();
  const autocomplete = new google.maps.places.Autocomplete(addressSearch, { fields: ["formatted_address", "geometry"], componentRestrictions: { country: "in" } });
  autocomplete.addListener("place_changed", () => { const place = autocomplete.getPlace(); if (!place.geometry?.location) { locationStatus.textContent = "Choose an address from the suggestions."; return; } setSelectedLocation(place.geometry.location.lat(), place.geometry.location.lng(), place.formatted_address); });
  cafeMarker.addListener("dragend", () => { const position = cafeMarker.getPosition(); reverseGeocode(position.lat(), position.lng()); });
  locationStatus.textContent = "Search an address or drag the pin to adjust it.";
}

function initLeafletMap() {
  const mapElement = document.querySelector("#address-map");
  if (!mapElement || !window.L || cafeMap) return;
  leafletMap = window.L.map(mapElement).setView([19.2813, 73.0483], 14);
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }).addTo(leafletMap);
  leafletMarker = window.L.marker([19.2813, 73.0483], { draggable: true }).addTo(leafletMap);
  leafletMarker.on("dragend", () => { const position = leafletMarker.getLatLng(); setSelectedLocation(position.lat, position.lng); });
  leafletMap.on("click", (event) => { setSelectedLocation(event.latlng.lat, event.latlng.lng); });
  locationStatus.textContent = "Drag the pin or tap the map to choose your location.";
}

window.initCafeMap = initCafeMap;
if (window.CAFE_GOOGLE_MAPS_API_KEY) { const mapsScript = document.createElement("script"); mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(window.CAFE_GOOGLE_MAPS_API_KEY)}&libraries=places&callback=initCafeMap`; mapsScript.async = true; mapsScript.defer = true; mapsScript.onerror = () => { locationStatus.textContent = "Google Maps could not load. You can still choose a point on the fallback map."; initLeafletMap(); }; document.head.appendChild(mapsScript); } else { initLeafletMap(); }

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  const cartCount = document.querySelector("#cart-count");
  if (cartCount) cartCount.textContent = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

function getItems() {
  const availableItems = getMenuItems().filter((product) => product.isAvailable);
  let changed = false;
  const items = Object.entries(cart).map(([id, quantity]) => ({ item: availableItems.find((product) => product.id === id), quantity })).filter(({ item, quantity }) => {
    if (!item || quantity < 1) { changed = true; return false; }
    return true;
  });
  if (changed) {
    Object.keys(cart).forEach((id) => { if (!availableItems.some((item) => item.id === id) || cart[id] < 1) delete cart[id]; });
    saveCart();
  }
  return items;
}

function selectedFulfilment() { return checkoutForm.elements.fulfilment.value; }

function getCosts(items = getItems()) {
  const subtotal = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const isDelivery = selectedFulfilment() === "delivery";
  const fee = isDelivery && subtotal < freeDeliveryThreshold ? deliveryCharge : 0;
  const coupon = couponInput?.value.trim().toUpperCase();
  const discount = coupon === "CAFE10" ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, fee, discount, total: subtotal + fee - discount };
}

function updateCheckoutProgress(items = getItems()) {
  const steps = [...document.querySelectorAll(".checkout-steps [data-step]")];
  if (!steps.length) return;
  const currentStep = !items.length ? 1 : checkoutForm.checkValidity() ? 3 : 2;
  steps.forEach((step) => {
    const number = Number(step.dataset.step);
    step.classList.toggle("is-active", number === currentStep);
    step.classList.toggle("is-complete", number < currentStep);
  });
}

function updateFulfilmentUI() {
  const isDelivery = selectedFulfilment() === "delivery";
  deliveryFields.classList.toggle("d-none", !isDelivery);
  addressInput.required = isDelivery;
  addressInput.disabled = !isDelivery;
  timeHeading.textContent = isDelivery ? "Delivery time" : "Pickup time";
  document.querySelectorAll(".fulfilment-option").forEach((option) => option.classList.toggle("is-active", option.querySelector("input").checked));
  if (isDelivery) window.setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); if (cafeMap && window.google?.maps) window.google.maps.event.trigger(cafeMap, "resize"); }, 80);
  renderCart();
}

function renderCart() {
  if (!checkoutUser) return;
  const items = getItems();
  const hasItems = items.length > 0;
  const costs = getCosts(items);
  updateCheckoutProgress(items);
  cartContent.classList.toggle("d-none", !hasItems);
  emptyCart.classList.toggle("d-none", hasItems);
  mobileOrderBar.classList.toggle("is-hidden", !hasItems);
  cartSubtotal.textContent = formatCurrency(costs.subtotal);
  deliveryFee.textContent = costs.fee ? formatCurrency(costs.fee) : "Free";
  discountRow?.classList.toggle("d-none", !costs.discount);
  if (couponDiscount) couponDiscount.textContent = `-${formatCurrency(costs.discount)}`;
  cartTotal.textContent = formatCurrency(costs.total);
  placeOrderTotal.textContent = formatCurrency(costs.total);
  mobileOrderTotal.textContent = formatCurrency(costs.total);
  cartItemsContainer.innerHTML = items.map(({ item, quantity }) => `
    <article class="cart-product"><div><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.description)}</p><strong>${formatCurrency(item.price)}</strong></div>
    <div class="cart-controls" aria-label="${escapeHtml(item.name)} quantity"><button class="decrease-cart" data-id="${item.id}" type="button" aria-label="Remove one ${escapeHtml(item.name)}">−</button><span>${quantity}</span><button class="increase-cart" data-id="${item.id}" type="button" aria-label="Add one ${escapeHtml(item.name)}">+</button></div></article>`).join("");
}

if (checkoutUser) {
  document.querySelector("#checkout-name").value = checkoutUser.name || "";
  document.querySelector("#checkout-phone").value = checkoutUser.phone || "";
  const savedDeliveryAddress = JSON.parse(localStorage.getItem("cafe-creme-saved-address") || "null");
  if (savedDeliveryAddress?.address) { addressInput.value = savedDeliveryAddress.address; addressSearch.value = savedDeliveryAddress.address; }
  if (savedDeliveryAddress?.latitude && savedDeliveryAddress?.longitude) { latitudeInput.value = savedDeliveryAddress.latitude; longitudeInput.value = savedDeliveryAddress.longitude; }
} else {
  cartContent.classList.add("d-none");
  emptyCart.classList.remove("d-none");
  mobileOrderBar.classList.add("is-hidden");
  emptyCart.innerHTML = '<h2>Login required</h2><p>Log in to view your cart and continue to checkout.</p><a class="btn btn-dark" href="login.html">Login to continue</a>';
}

cartItemsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  const change = button.classList.contains("increase-cart") ? 1 : -1;
  cart[button.dataset.id] = (cart[button.dataset.id] || 0) + change;
  if (cart[button.dataset.id] <= 0) delete cart[button.dataset.id];
  saveCart();
  renderCart();
});

checkoutForm.addEventListener("change", (event) => { if (event.target.name === "fulfilment") updateFulfilmentUI(); });
checkoutForm.addEventListener("input", () => updateCheckoutProgress());
document.querySelectorAll(".payment-method input").forEach((input) => input.addEventListener("change", () => document.querySelectorAll(".payment-method").forEach((method) => method.classList.toggle("is-active", method.querySelector("input").checked))));
document.querySelector("#apply-coupon")?.addEventListener("click", () => { const code = couponInput.value.trim().toUpperCase(); couponInput.value = code; couponStatus.textContent = code === "CAFE10" ? "Coupon applied: 10% off your items." : "Try CAFE10 for a demo discount."; couponStatus.className = code === "CAFE10" ? "form-hint is-success" : "form-hint is-error"; renderCart(); });
mapToggle.addEventListener("click", () => {
  const isExpanded = mapToggle.getAttribute("aria-expanded") === "true";
  mapToggle.setAttribute("aria-expanded", String(!isExpanded));
  mapToggle.textContent = isExpanded ? "Show map" : "Hide map";
  document.querySelector("#address-map").classList.toggle("is-collapsed", isExpanded);
  if (!isExpanded && leafletMap) window.setTimeout(() => leafletMap.invalidateSize(), 80);
});
mobilePlaceOrder.addEventListener("click", () => checkoutForm.requestSubmit());
cartItemsToggle.addEventListener("click", () => {
  const expanded = cartItemsToggle.getAttribute("aria-expanded") === "true";
  cartItemsToggle.setAttribute("aria-expanded", String(!expanded));
  cartItemsToggle.textContent = expanded ? "Show items" : "Collapse";
  cartPanel.classList.toggle("is-collapsed", expanded);
});
useCurrentLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) { locationStatus.textContent = "Location is not supported here. Enter your address manually."; return; }
  useCurrentLocationButton.disabled = true;
  locationStatus.textContent = "Finding your location...";
  navigator.geolocation.getCurrentPosition((position) => {
    reverseGeocode(position.coords.latitude, position.coords.longitude);
    useCurrentLocationButton.disabled = false;
  }, (error) => {
    const message = error.code === 1 ? "Location permission was denied. Allow access in browser settings or enter your address manually." : error.code === 3 ? "Location request timed out. Try again or enter your address manually." : "We could not access your location. Enter your address manually.";
    locationStatus.textContent = message;
    useCurrentLocationButton.disabled = false;
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
});
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const items = getItems();
  if (!items.length) return;
  const details = Object.fromEntries(new FormData(checkoutForm).entries());
  const costs = getCosts(items);
  const order = {
    id: `CC-${Date.now().toString().slice(-6)}`,
    customer: details.name,
    phone: details.phone,
    fulfilment: details.fulfilment,
    address: details.address || "",
    landmark: details.landmark || "",
    latitude: details.latitude || "",
    longitude: details.longitude || "",
    collectionTime: details.collectionTime,
    payment: details.payment || "Cash on delivery",
    coupon: details.coupon || "",
    note: details.note || "",
    items: items.map(({ item, quantity }) => ({ name: item.name, price: item.price, quantity })),
    subtotal: costs.subtotal,
    deliveryFee: costs.fee,
    discount: costs.discount,
    total: costs.total,
    status: "Order received",
    createdAt: new Date().toISOString()
  };
  const orders = JSON.parse(localStorage.getItem("cafe-creme-orders") || "[]");
  orders.unshift(order);
  localStorage.setItem("cafe-creme-orders", JSON.stringify(orders));
  localStorage.setItem("cafe-creme-last-order", JSON.stringify(order));
  if (order.address) localStorage.setItem("cafe-creme-saved-address", JSON.stringify({ address: order.address, latitude: order.latitude, longitude: order.longitude }));
  Object.keys(cart).forEach((key) => delete cart[key]);
  saveCart();
  window.location.href = "order-success.html";
});

updateFulfilmentUI();
