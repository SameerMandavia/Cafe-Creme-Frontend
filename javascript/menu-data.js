const defaultMenuItems = [
  { id: "masala-chai", name: "Masala Chai", description: "Black tea, cardamom, ginger, and warming spices.", category: "Chai and Coffee", price: 120, dietary: "Vegetarian", rating: 4.8, prepTime: "10 min", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=240&q=80" },
  { id: "filter-coffee", name: "Filter Coffee", description: "South Indian filter coffee with creamy steamed milk.", category: "Chai and Coffee", price: 160, dietary: "Vegetarian", rating: 4.9, prepTime: "10 min", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=240&q=80" },
  { id: "velvet-latte", name: "Velvet Latte", description: "House espresso with silky steamed milk.", category: "Chai and Coffee", price: 190, dietary: "Vegetarian", rating: 4.9, prepTime: "12 min", isPopular: true, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=240&q=80" },
  { id: "ginger-honey-tea", name: "Ginger Honey Tea", description: "Fresh ginger, local honey, and delicate black tea.", category: "Chai and Coffee", price: 140, dietary: "Vegetarian", rating: 4.7, prepTime: "8 min", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=240&q=80" },
  { id: "cardamom-bun", name: "Cardamom Bun", description: "Soft, fragrant, and finished with a sweet glaze.", category: "From the Bakery", price: 150, dietary: "Vegetarian", rating: 4.8, prepTime: "5 min", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&q=80" },
  { id: "butter-croissant", name: "Butter Croissant", description: "Flaky layers baked golden and crisp.", category: "From the Bakery", price: 180, dietary: "Vegetarian", rating: 4.9, prepTime: "5 min", isPopular: true, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=240&q=80" },
  { id: "saffron-milk-cake", name: "Saffron Milk Cake", description: "Soft sponge, saffron cream, and toasted pistachio.", category: "From the Bakery", price: 220, dietary: "Vegetarian", rating: 4.8, prepTime: "5 min", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&q=80" },
  { id: "chocolate-brownie", name: "Chocolate Brownie", description: "Rich dark chocolate with a fudgy centre.", category: "From the Bakery", price: 170, dietary: "Vegetarian", rating: 4.7, prepTime: "5 min", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=240&q=80" },
  { id: "cappuccino", name: "Classic Cappuccino", description: "Double espresso, velvety milk, and a soft cocoa finish.", category: "Chai and Coffee", price: 180, dietary: "Vegetarian", rating: 4.8, prepTime: "10 min", isPopular: true, image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=240&q=80" },
  { id: "cold-coffee", name: "Cafe Cold Coffee", description: "Chilled coffee blended with milk and a hint of vanilla.", category: "Cold & Refreshing", price: 210, dietary: "Vegetarian", rating: 4.8, prepTime: "8 min", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=240&q=80" },
  { id: "iced-peach-tea", name: "Iced Peach Tea", description: "Black tea, ripe peach, citrus, and plenty of ice.", category: "Cold & Refreshing", price: 180, dietary: "Vegan", rating: 4.6, prepTime: "6 min", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=240&q=80" },
  { id: "mango-saffron-lassi", name: "Mango Saffron Lassi", description: "Creamy Alphonso mango, yogurt, saffron, and pistachio.", category: "Cold & Refreshing", price: 220, dietary: "Vegetarian", rating: 4.7, prepTime: "7 min", image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=240&q=80" },
  { id: "veg-grilled-sandwich", name: "Veg Grilled Sandwich", description: "Grilled sourdough, vegetables, cheese, and our house spread.", category: "Savoury Bites", price: 240, dietary: "Vegetarian", rating: 4.7, prepTime: "15 min", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=240&q=80" },
  { id: "paneer-tikka-sandwich", name: "Paneer Tikka Sandwich", description: "Smoky paneer, peppers, mint chutney, and toasted bread.", category: "Savoury Bites", price: 280, dietary: "Vegetarian", rating: 4.8, prepTime: "18 min", image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=240&q=80" },
  { id: "creamy-pesto-pasta", name: "Creamy Pesto Pasta", description: "Penne tossed in basil pesto, cream, parmesan, and herbs.", category: "Savoury Bites", price: 320, dietary: "Vegetarian", rating: 4.7, prepTime: "20 min", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=240&q=80" },
  { id: "loaded-peri-peri-fries", name: "Loaded Peri-Peri Fries", description: "Crisp fries, cheese sauce, herbs, and a bright peri-peri kick.", category: "Savoury Bites", price: 220, dietary: "Vegetarian", rating: 4.6, prepTime: "12 min", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=240&q=80" },
  { id: "blueberry-cheesecake", name: "Blueberry Cheesecake", description: "Silky baked cheesecake with blueberry compote.", category: "Desserts", price: 260, dietary: "Vegetarian", rating: 4.9, prepTime: "5 min", isPopular: true, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=240&q=80" },
  { id: "classic-tiramisu", name: "Classic Tiramisu", description: "Coffee-soaked sponge, mascarpone cream, and cocoa.", category: "Desserts", price: 280, dietary: "Contains egg", rating: 4.8, prepTime: "5 min", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=240&q=80" },
  { id: "gulab-jamun-cheesecake", name: "Gulab Jamun Cheesecake", description: "A Cafe-Creme twist with cardamom, cream cheese, and gulab jamun.", category: "Desserts", price: 290, dietary: "Vegetarian", rating: 4.8, prepTime: "5 min", image: "https://images.unsplash.com/photo-1551024506-0BCCd828d307?auto=format&fit=crop&w=240&q=80" },
  { id: "dark-hot-chocolate", name: "Dark Hot Chocolate", description: "Rich dark cocoa, steamed milk, and a toasted marshmallow finish.", category: "Desserts", price: 210, dietary: "Vegetarian", rating: 4.8, prepTime: "10 min", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=240&q=80" }
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
  const saved = JSON.parse(savedItems).map(normaliseMenuItem);
  const existingIds = new Set(saved.map((item) => item.id));
  const missingDefaults = defaultMenuItems.filter((item) => !existingIds.has(item.id)).map(normaliseMenuItem);
  if (missingDefaults.length) {
    const merged = [...saved, ...missingDefaults];
    localStorage.setItem("cafe-creme-menu", JSON.stringify(merged));
    return merged;
  }
  return saved;
}

function saveMenuItems(items) { localStorage.setItem("cafe-creme-menu", JSON.stringify(items.map(normaliseMenuItem))); }
