import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "About Us", href: "/about" },
    { label: "All Products", href: "/products" },
    { label: "Custom Cake Builder", href: "/custom-cake" },
    { label: "Health Subscriptions", href: "/subscriptions" },
    { label: "Track Order", href: "/track-order" },
    { label: "Careers", href: "/careers" },
  ],
  Categories: [
    { label: "Cakes", href: "/category/cakes" },
    { label: "Bakery", href: "/category/bakery" },
    { label: "Beverages", href: "/category/beverages" },
    { label: "Food Menu", href: "/category/food-menu" },
    { label: "Festive Hampers", href: "/category/festive-hampers" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-red text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Image
              src="https://bakenshake.in/web_components/images/logo.png"
              alt="Bake N' Shake"
              width={160}
              height={56}
              className="h-12 w-auto brightness-0 invert mb-4"
            />
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm">
              Premium bakery and cafe chain delivering happiness across Bhopal,
              Indore & Gwalior. Fresh cakes, cookies, pastries, and more — baked
              with love every day.
            </p>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Bhopal | Indore | Gwalior, Madhya Pradesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>+91 78989 89898</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span>hello@bakenshake.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="flex-shrink-0" />
                <span>Open Daily: 8:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display text-lg font-bold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Bake N&apos; Shake. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Made with love in Madhya Pradesh
          </p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/917898989898"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </footer>
  );
}
