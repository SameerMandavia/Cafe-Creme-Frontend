const defaultMenuItems = [
  { id: "masala-chai", name: "Masala Chai", description: "Black tea, cardamom, ginger, and warming spices.", category: "Chai and Coffee", price: 120, dietary: "Vegetarian", rating: 4.8, prepTime: "10 min", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=240&q=80" },
  { id: "filter-coffee", name: "Filter Coffee", description: "South Indian filter coffee with creamy steamed milk.", category: "Chai and Coffee", price: 160, dietary: "Vegetarian", rating: 4.9, prepTime: "10 min", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=240&q=80" },
  { id: "velvet-latte", name: "Velvet Latte", description: "House espresso with silky steamed milk.", category: "Chai and Coffee", price: 190, dietary: "Vegetarian", rating: 4.9, prepTime: "12 min", isPopular: true, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=240&q=80" },
  { id: "ginger-honey-tea", name: "Ginger Honey Tea", description: "Fresh ginger, local honey, and delicate black tea.", category: "Chai and Coffee", price: 140, dietary: "Vegetarian", rating: 4.7, prepTime: "8 min", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=240&q=80" },
  { id: "cardamom-bun", name: "Cardamom Bun", description: "Soft, fragrant, and finished with a sweet glaze.", category: "From the Bakery", price: 150, dietary: "Vegetarian", rating: 4.8, prepTime: "5 min", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&q=80" },
  { id: "butter-croissant", name: "Butter Croissant", description: "Flaky layers baked golden and crisp.", category: "From the Bakery", price: 180, dietary: "Vegetarian", rating: 4.9, prepTime: "5 min", isPopular: true, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=240&q=80" },
  { id: "saffron-milk-cake", name: "Saffron Milk Cake", description: "Soft sponge, saffron cream, and toasted pistachio.", category: "From the Bakery", price: 220, dietary: "Vegetarian", rating: 4.8, prepTime: "5 min", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&q=80" },
  { id: "chocolate-brownie", name: "Chocolate Brownie", description: "Rich dark chocolate with a fudgy centre.", category: "From the Bakery", price: 170, dietary: "Vegetarian", rating: 4.7, prepTime: "5 min", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=240&q=80" }
];

function formatCurrency(amount) { return `${String.fromCodePoint(0x20B9)}${Number(amount || 0).toLocaleString("en-IN")}`; }

function normaliseMenuItem(item) {
  const defaultItem = defaultMenuItems.find((candidate) => candidate.id === item.id) || {};
  const status = item.status || (item.isAvailable === false ? "hidden" : "available");
  const image = /^https?:\/\//i.test(item.image || "") ? item.image : "";
  return { ...defaultItem, ...item, image: image || defaultItem.image || "", rating: item.rating || defaultItem.rating || 4.7, prepTime: item.prepTime || defaultItem.prepTime || "10 min", dietary: item.dietary || "Not specified", status, isAvailable: status === "available" };
}

function getMenuItems() {
  const savedItems = localStorage.getItem("cafe-creme-menu");
  if (!savedItems) {
    const initialItems = defaultMenuItems.map((item) => normaliseMenuItem(item));
    localStorage.setItem("cafe-creme-menu", JSON.stringify(initialItems));
    return initialItems;
  }
  return JSON.parse(savedItems).map(normaliseMenuItem);
}

function saveMenuItems(items) { localStorage.setItem("cafe-creme-menu", JSON.stringify(items.map(normaliseMenuItem))); }

if (window.CafeCremeApi) {
  window.CafeCremeApi.menu().then((items) => {
    saveMenuItems(items);
    window.dispatchEvent(new Event("cafe-creme-menu-ready"));
  }).catch(() => { /* local catalog remains the fallback */ });
}
