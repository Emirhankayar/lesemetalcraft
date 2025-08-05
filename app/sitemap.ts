// app/sitemap.js (for App Router)
import { createClient } from '@/lib/sbClient'

export default async function sitemap() {
  const baseUrl = 'https://www.lesemetalcraft.com'
  
  // Static pages (public pages only)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  let productPages = []
  
  try {
    const supabase = createClient()

    const { data: products, error } = await supabase.rpc('get_shop_products_simple', {
      limit_count: 1000, 
      offset_count: 0,
      category_filter: null,
      in_stock_only: true, 
      featured_only: false,
      search_term: null
    })

    if (error) {
      console.error('Error fetching products for sitemap:', error)
    } else if (products) {
      // Create sitemap entries for each product
      productPages = products.map((product: { id: string; date_published: string }) => ({
        url: `${baseUrl}/shop/${product.id}`,
        lastModified: new Date(product.date_published),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }

  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    // Continue with empty product pages if fetch fails
  }

  return [
    ...staticPages,
    ...productPages,
  ]
}

// Note: We exclude /auth, /profile, and /checkout as these are:
// - /auth: login page (low SEO value)
// - /profile: requires authentication (not accessible to crawlers)
// - /checkout: requires authentication + items in cart (not accessible)