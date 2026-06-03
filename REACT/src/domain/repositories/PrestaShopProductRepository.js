import { Product } from '../models/Product';
import { CONFIG } from '../../config'; // Idéalement vos clés d'API sont ici

export class PrestaShopProductRepository {
  constructor() {
    // Remplacer par vos accès PrestaShop réels
    this.baseUrl = "https://votre-boutique.com/api";
    this.apiKey = "VOTRE_CLE_API_PRESTASHOP";
  }

  async getAllProducts() {
    // Appel à l'API PrestaShop pour l'entité products
    const response = await fetch(`${this.baseUrl}/products?ws_key=${this.apiKey}&output_format=JSON&display=full`);
    
    if (!response.ok) {
      throw new Error("Impossible de récupérer la liste des produits");
    }
    
    const data = await response.json();
    const rawProducts = data.products || [];

    // Mapping : On transforme le tableau JSON en tableau d'objets "Product"
    return rawProducts.map(raw => new Product(
      raw.id,
      raw.name?.[0]?.value || raw.name || "Produit sans nom", // Gestion du multi-langue PrestaShop
      raw.price,
      raw.id_default_image ? `${this.baseUrl}/images/products/${raw.id}/${raw.id_default_image}?ws_key=${this.apiKey}` : 'https://via.placeholder.com/150'
    ));
  }
}