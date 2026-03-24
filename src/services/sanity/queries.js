/**
 * Sanity GROQ Queries
 * Centralized query definitions for all Sanity CMS data fetching
 *
 * Keep queries DRY and reusable across the application
 */

/**
 * Product Queries
 */
export const PRODUCT_QUERIES = {
  /**
   * Get all published products
   * @returns {Array} Array of product documents
   */
  allProducts: `
    *[_type == "product" && defined(slug.current)] | order(_createdAt desc) {
      _id,
      _createdAt,
      name,
      slug,
      description,
      price,
      salePrice,
      currency,
      images,
      category->{
        _id,
        name,
        slug
      },
      tags,
      inStock,
      stockCount,
      featured
    }
  `,

  /**
   * Get a single product by slug
   * @param {string} slug - Product slug
   */
  productBySlug: `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
      name,
      slug,
      description,
      longDescription,
      price,
      salePrice,
      currency,
      images[] {
        asset->{
          _id,
          url,
          metadata
        },
        alt,
        hotspot
      },
      category->{
        _id,
        name,
        slug,
        description
      },
      relatedProducts[]->{
        _id,
        name,
        slug,
        price,
        images[0]
      },
      tags,
      inStock,
      stockCount,
      featured,
      specifications
    }
  `,

  /**
   * Get featured products
   */
  featuredProducts: `
    *[_type == "product" && featured == true] | order(_createdAt desc) [0...8] {
      _id,
      name,
      slug,
      price,
      salePrice,
      images[0],
      inStock
    }
  `,

  /**
   * Get products by category
   */
  productsByCategory: `
    *[_type == "product" && category->slug.current == $category] | order(_createdAt desc) {
      _id,
      name,
      slug,
      price,
      salePrice,
      images[0],
      inStock
    }
  `,

  /**
   * Get all product categories
   */
  categories: `
    *[_type == "category"] | order(name asc) {
      _id,
      name,
      slug,
      description,
      image
    }
  `
}

/**
 * Blog/Content Queries (Future)
 */
export const CONTENT_QUERIES = {
  /**
   * Get all blog posts
   */
  allPosts: `
    *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{
        name,
        image
      }
    }
  `,

  /**
   * Get a single post by slug
   */
  postBySlug: `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      content,
      excerpt,
      mainImage,
      publishedAt,
      author->{
        name,
        bio,
        image
      },
      tags
    }
  `,

  /**
   * Get gallery items
   */
  galleryItems: `
    *[_type == "galleryItem"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      images[] {
        asset->{
          url,
          metadata
        },
        alt
      },
      description
    }
  `
}

/**
 * Site Settings Queries
 */
export const SETTINGS_QUERIES = {
  /**
   * Get global site settings
   */
  siteSettings: `
    *[_type == "siteSettings"][0] {
      siteName,
      tagline,
      contactEmail,
      socialMedia {
        facebook,
        instagram,
        pinterest
      },
      shippingInfo,
      returnPolicy
    }
  `,

  /**
   * Get homepage content
   */
  homepageContent: `
    *[_type == "homepage"][0] {
      hero {
        title,
        subtitle,
        ctaText,
        ctaLink,
        backgroundImage
      },
      featuredCategories[]->{
        _id,
        name,
        slug
      },
      testimonials[] {
        text,
        author,
        rating
      }
    }
  `
}

/**
 * Combined export for easy importing
 */
export const queries = {
  ...PRODUCT_QUERIES,
  ...CONTENT_QUERIES,
  ...SETTINGS_QUERIES
}

export default queries
