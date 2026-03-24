import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'madeToOrder',
      title: 'Made to Order',
      type: 'boolean',
      description: 'All products are handcrafted to order — always available!',
      initialValue: true,
      readOnly: true,
    }),
    defineField({
      name: 'estimatedDays',
      title: 'Estimated Delivery (days)',
      type: 'number',
      description: 'Approximate crafting + delivery time in days (e.g., 7 for "5-7 days")',
      initialValue: 7,
      validation: (Rule) => Rule.min(1).max(60),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      price: 'price',
      estimatedDays: 'estimatedDays',
    },
    prepare({title, media, price, estimatedDays}) {
      const deliveryText = estimatedDays ? `~${estimatedDays} days` : ''
      return {
        title,
        subtitle: price ? `₹${price} • ${deliveryText}` : 'No price set',
        media,
      }
    },
  },
})
