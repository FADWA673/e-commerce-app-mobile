// mobile/src/utils/productMapper.js
import { getImageUrl } from './constants';

// Fonction utilitaire pour mapper les produits de l'API vers le format UI
export const mapProductToUI = (product) => {
  if (!product) return null;
  
  const imageUrl = getImageUrl(product.image_url) || 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Produit';
  
  return {
    id: product.id || 0,
    nom: product.nom || 'Produit sans nom', // Garder le nom original pour ProductCard
    name: product.nom || 'Produit sans nom', // Alias pour HomeScreen
    prix: parseFloat(product.prix) || 0, // Prix original pour ProductCard
    price: parseFloat(product.prix) || 0, // Alias pour HomeScreen
    priceFormatted: `${parseFloat(product.prix) || 0} DH`,
    image_url: imageUrl, // Pour ProductCard
    image: imageUrl, // Pour HomeScreen
    description: product.description || '',
    category_name: product.category_name || 'Catégorie', // Pour ProductCard
    category: product.category_name || 'Catégorie', // Alias pour HomeScreen
    category_id: product.category_id || 0,
    categoryId: product.category_id || 0, // Alias pour HomeScreen
    brand_name: product.brand_name || '',
    brand: product.brand_name || '', // Alias pour HomeScreen
    brand_id: product.brand_id || 0,
    brandId: product.brand_id || 0, // Alias pour HomeScreen
    stock: parseInt(product.stock) || 0,
    is_bestseller: product.is_bestseller || false,
    is_new: product.is_new || false,
    is_featured: product.is_featured || false,
    isNew: product.is_new === 1 || product.is_new === true,
    isBestseller: product.is_bestseller === 1 || product.is_bestseller === true,
    isFeatured: product.is_featured === 1 || product.is_featured === true,
    rating: generateRandomRating(),
    created_at: product.created_at || '',
  };
};

// Mapper plusieurs produits
export const mapProductsToUI = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(mapProductToUI).filter(product => product !== null);
};

// Générer une note aléatoire (en attendant un vrai système de notation)
const generateRandomRating = () => {
  return (Math.random() * 2 + 3).toFixed(1); // Entre 3.0 et 5.0
};