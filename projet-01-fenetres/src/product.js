export const PRODUCTS = [
  {
    id: '125',
    price: 125,
    image: '/assets/fenetre-125.jpg',
    label: 'Fenêtre bois classique',
    kicker: 'Le choix rassurant',
    description: 'Une fenêtre bois au style chaleureux, proposée à un prix déjà très accessible.',
  },
  {
    id: '109',
    price: 109,
    image: '/assets/fenetre-109.jpg',
    label: 'Fenêtre bois prix malin',
    kicker: 'Notre prix le plus bas',
    description: 'Le même esprit bois, avec 16 € de moins à investir ailleurs dans votre projet.',
  },
];

export function getSaving(selectedPrice) {
  return Math.max(0, 125 - selectedPrice);
}

export function getProductById(id) {
  return PRODUCTS.find((product) => product.id === id) ?? PRODUCTS[0];
}
