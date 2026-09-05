const menuItems = [
  { id: "masala-chai", name: "Masala Chai", description: "Black tea, cardamom, ginger, and warming spices.", category: "Chai and Coffee", price: 120 },
  { id: "filter-coffee", name: "Filter Coffee", description: "South Indian filter coffee with creamy steamed milk.", category: "Chai and Coffee", price: 160 },
  { id: "velvet-latte", name: "Velvet Latte", description: "House espresso with silky steamed milk.", category: "Chai and Coffee", price: 190 },
  { id: "ginger-honey-tea", name: "Ginger Honey Tea", description: "Fresh ginger, local honey, and delicate black tea.", category: "Chai and Coffee", price: 140 },
  { id: "cardamom-bun", name: "Cardamom Bun", description: "Soft, fragrant, and finished with a sweet glaze.", category: "From the Bakery", price: 150 },
  { id: "butter-croissant", name: "Butter Croissant", description: "Flaky layers baked golden and crisp.", category: "From the Bakery", price: 180 },
  { id: "saffron-milk-cake", name: "Saffron Milk Cake", description: "Soft sponge, saffron cream, and toasted pistachio.", category: "From the Bakery", price: 220 },
  { id: "chocolate-brownie", name: "Chocolate Brownie", description: "Rich dark chocolate with a fudgy centre.", category: "From the Bakery", price: 170 }
];

function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
