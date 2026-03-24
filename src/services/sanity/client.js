/**
 * Sanity CMS Client Configuration
 * Single source of truth for all Sanity CMS interactions
 *
 * @see https://www.sanity.io/docs/javascript-client
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

/**
 * Sanity configuration object
 */
export const sanityConfig = {
  projectId: '2r50s816',
  dataset: 'production',
  apiVersion: '2026-03-23',
  useCdn: true
}

/**
 * Sanity client instance with configuration from environment variables
 * Falls back to hardcoded values for development convenience
 */
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || sanityConfig.projectId,
  dataset: import.meta.env.VITE_SANITY_DATASET || sanityConfig.dataset,
  apiVersion: sanityConfig.apiVersion,
  useCdn: import.meta.env.PROD ?? sanityConfig.useCdn,
  token: import.meta.env.VITE_SANITY_API_TOKEN,
  perspective: 'published'
})

/**
 * Image URL builder for Sanity images
 * @param {Object} source - Sanity image asset reference
 * @returns {Object} Image URL builder instance
 *
 * @example
 * import { urlFor } from '@services/sanity/client'
 *
 * const imageUrl = urlFor(product.image).width(400).height(300).url()
 */
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source) {
  return builder.image(source)
}

/**
 * Helper function to get optimized image URLs
 * @param {Object} image - Sanity image asset
 * @param {Object} options - Image transformation options
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(image, options = {}) {
  const { width = 800, height, quality = 80, format = 'webp' } = options

  let imageBuilder = urlFor(image).auto('format').format(format)

  if (width) imageBuilder = imageBuilder.width(width)
  if (height) imageBuilder = imageBuilder.height(height)
  if (quality) imageBuilder = imageBuilder.quality(quality)

  return imageBuilder.url()
}

export default sanityClient

/**
 * Fetch products from Sanity with optional filters
 * @param {Object} filters - Filter options
 * @param {boolean} [filters.featured] - Filter for featured products only
 * @param {boolean} [filters.inStock] - Filter for in-stock products only
 * @param {string} [filters.category] - Filter by category slug
 * @param {number} [filters.limit] - Limit number of results
 * @returns {Promise<Array>} Array of product documents
 */
export async function fetchProducts(filters = {}) {
  const { featured, inStock, category, limit } = filters

  let filterConditions = ['_type == "product"', 'defined(slug.current)']

  if (featured !== undefined) {
    filterConditions.push(`featured == ${featured}`)
  }

  if (inStock !== undefined) {
    filterConditions.push(`inStock == ${inStock}`)
  }

  if (category) {
    filterConditions.push(`category->slug.current == "${category}"`)
  }

  const filterString = filterConditions.join(' && ')
  const limitString = limit ? `[0...${limit}]` : ''

  const query = `
    *[${filterString}] | order(_createdAt desc) ${limitString} {
      _id,
      _createdAt,
      title,
      "name": title,
      slug,
      description,
      price,
      salePrice,
      image,
      images,
      category->{
        _id,
        title,
        slug
      },
      inStock,
      stockCount,
      featured
    }
  `

  try {
    const products = await sanityClient.fetch(query)
    return products
  } catch (error) {
    console.error('Error fetching products from Sanity:', error)
    throw error
  }
}

/**
 * Fetch gallery images from Sanity
 * @param {Object} options - Fetch options
 * @param {number} [options.limit] - Limit number of results
 * @returns {Promise<Array>} Array of gallery documents
 */
export async function fetchGallery(options = {}) {
  const { limit } = options
  const limitString = limit ? `[0...${limit}]` : ''

  const query = `
    *[_type == "gallery" && defined(slug.current)] | order(publishedAt desc) ${limitString} {
      _id,
      title,
      slug,
      images[] {
        asset->{
          _id,
          url,
          metadata
        },
        alt,
        caption
      },
      publishedAt
    }
  `

  try {
    const gallery = await sanityClient.fetch(query)
    return gallery
  } catch (error) {
    console.error('Error fetching gallery from Sanity:', error)
    throw error
  }
}
