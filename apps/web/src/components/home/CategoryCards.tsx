"use client";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Cakes", slug: "cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
  { name: "Cookies", slug: "bakery", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80" },
  { name: "Pastries", slug: "bakery", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80" },
  { name: "Brownies", slug: "bakery", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
  { name: "Beverages", slug: "beverages", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
  { name: "Burgers", slug: "food-menu", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { name: "Pizza", slug: "food-menu", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
  { name: "Hampers", slug: "festive-hampers", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80" },
];

export default function CategoryCards() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-6">
          Explore Categories
        </h2>
        <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${cat.slug}`}
              className="flex-shrink-0 group text-center"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-3 border-brand-cream group-hover:border-brand-red transition-colors duration-300 mx-auto">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="112px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-text-primary group-hover:text-brand-red transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
