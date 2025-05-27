<template>
  <section class="py-10 px-4 bg-white">
    <h2 class="text-2xl font-bold text-center mb-6">Explore Top Brands</h2>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto"
    >
      <router-link
        v-for="brand in brands"
        :key="brand.name"
        :to="`/brand/${brand.slug}`"
        class="flex flex-col items-center justify-center p-4 rounded-lg border shadow hover:shadow-lg transition cursor-pointer bg-white hover:bg-gray-50"
      >
        <img :src="brand.logo" :alt="brand.name" class="h-16 mb-2 object-contain" />
        <p class="text-sm font-medium text-gray-800">{{ brand.name }}</p>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import Nike from '@/assets/brands/nike.png'
import Adidas from '@/assets/brands/adidas.svg'
import Puma from '@/assets/brands/puma.svg'
import NewBalance from '@/assets/brands/new-balance.png'
import Vans from '@/assets/brands/vans.png'
import Salomon from '@/assets/brands/salomon.png'
import Converse from '@/assets/brands/converse.png'
import Asics from '@/assets/brands/asics.png'
import On from '@/assets/brands/on.svg'
import Jordan from '@/assets/brands/jordan.svg'

const brands = [
  { name: 'Nike', slug: 'nike', logo: Nike },
  { name: 'Adidas', slug: 'adidas', logo: Adidas },
  { name: 'Puma', slug: 'puma', logo: Puma },
  { name: 'New Balance', slug: 'new balance', logo: NewBalance },
  { name: 'Vans', slug: 'vans', logo: Vans },
  { name: 'Salomon', slug: 'salomon', logo: Salomon },
  { name: 'Converse', slug: 'converse', logo: Converse },
  { name: 'ASICS', slug: 'asics', logo: Asics },
  { name: 'On', slug: 'on', logo: On },
  { name: 'Air Jordan', slug: 'air jordan', logo: Jordan },
]
</script>
