const express = require("express");
const path = require("node:path");
const crypto = require("node:crypto");

const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 3000;
const frontendRoot = path.join(__dirname, "..");
const htmlRoot = path.join(frontendRoot, "html");

const menuItems = [
  { id: "masala-chai", name: "Masala Chai", price: 120 },
  { id: "filter-coffee", name: "Filter Coffee", price: 160 },
  { id: "velvet-latte", name: "Velvet Latte", price: 190 },
  { id: "ginger-honey-tea", name: "Ginger Honey Tea", price: 140 },
  { id: "cardamom-bun", name: "Cardamom Bun", price: 150 },
  { id: "butter-croissant", name: "Butter Croissant", price: 180 },
  { id: "saffron-milk-cake", name: "Saffron Milk Cake", price: 220 },
  { id: "chocolate-brownie", name: "Chocolate Brownie", price: 170 }
];

const orders = [];
const reservations = [];
const messages = [];

app.use(express.json({ limit: "100kb" }));
app.use(express.static(htmlRoot));
app.use(express.static(frontendRoot));

app.get("/", (request, response) => response.sendFile(path.join(frontendRoot, "html", "home.html")));
app.get("/api/menu", (request, response) => response.json(menuItems));
app.get("/api/health", (request, response) => response.json({ status: "ok", orders: orders.length, reservations: reservations.length, messages: messages.length }));

app.post("/api/orders", (request, response) => {
  const { items } = request.body;
  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ error: "At least one menu item is required." });
  }

  const orderItems = items.map(({ menuItemId, quantity }) => {
    const menuItem = menuItems.find((item) => item.id === menuItemId);
    const parsedQuantity = Number(quantity);
    if (!menuItem || !Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 20) return null;
    return { ...menuItem, quantity: parsedQuantity, subtotal: menuItem.price * parsedQuantity };
  });

  if (orderItems.some((item) => !item)) return response.status(400).json({ error: "One or more order items are invalid." });
  const order = { id: `CC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, items: orderItems, total: orderItems.reduce((sum, item) => sum + item.subtotal, 0), status: "received", createdAt: new Date().toISOString() };
  orders.push(order);
  return response.status(201).json(order);
});

app.post("/api/reservations", (request, response) => {
  const { name, email, date, time, guests, note = "" } = request.body;
  const guestCount = Number(guests);
  if (!name || !email || !date || !time || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
    return response.status(400).json({ error: "Name, email, date, time, and a valid guest count are required." });
  }
  const reservation = { id: `RES-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, name, email, date, time, guests: guestCount, note, status: "requested", createdAt: new Date().toISOString() };
  reservations.push(reservation);
  return response.status(201).json(reservation);
});

app.post("/api/contact", (request, response) => {
  const { name, email, message } = request.body;
  if (!name || !email || !message) return response.status(400).json({ error: "Name, email, and message are required." });
  const contactMessage = { id: crypto.randomUUID(), name, email, message, createdAt: new Date().toISOString() };
  messages.push(contactMessage);
  return response.status(201).json({ message: "Message received." });
});

app.listen(port, () => console.log(`Cafe-Creme server running at http://localhost:${port}`));
