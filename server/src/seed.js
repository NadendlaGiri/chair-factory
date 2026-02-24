require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const products = [
    {
        name: 'Executive Oak Chair',
        slug: 'executive-oak-chair',
        category: 'CHAIR',
        description: 'Handcrafted executive chair made from premium solid oak. Features ergonomic design with lumbar support, padded armrests, and a classic finish that suits any executive office.',
        material: 'Solid Oak',
        dimensions: '70cm W × 65cm D × 110cm H',
        price: 1200,
        availability: true,
        featured: true,
        images: [],
        tags: ['office', 'executive', 'oak', 'ergonomic'],
    },
    {
        name: 'Industrial Steel Bench',
        slug: 'industrial-steel-bench',
        category: 'BENCH',
        description: 'Heavy-duty steel bench designed for industrial and commercial environments. Weather-resistant coating and reinforced frame supports up to 400kg.',
        material: 'Powder-coated Steel',
        dimensions: '180cm W × 45cm D × 48cm H',
        price: 850,
        availability: true,
        featured: true,
        images: [],
        tags: ['industrial', 'outdoor', 'steel', 'heavy-duty'],
    },
    {
        name: 'Teak Garden Chair',
        slug: 'teak-garden-chair',
        category: 'CHAIR',
        description: 'Elegant teak garden chair with natural oil finish. UV and moisture resistant, perfect for outdoor patios and gardens. Foldable for easy storage.',
        material: 'Teak Wood',
        dimensions: '60cm W × 58cm D × 90cm H',
        price: 680,
        availability: true,
        featured: true,
        images: [],
        tags: ['outdoor', 'garden', 'teak', 'foldable'],
    },
    {
        name: 'Modern Mesh Office Chair',
        slug: 'modern-mesh-office-chair',
        category: 'CHAIR',
        description: 'Contemporary ergonomic chair with breathable mesh backrest and adjustable lumbar support. Five-star nylon base with smooth-rolling castors.',
        material: 'Mesh & Aluminum Frame',
        dimensions: '65cm W × 60cm D × 95-105cm H',
        price: 950,
        availability: true,
        featured: false,
        images: [],
        tags: ['office', 'mesh', 'ergonomic', 'adjustable'],
    },
    {
        name: 'Walnut Dining Chair',
        slug: 'walnut-dining-chair',
        category: 'CHAIR',
        description: 'Mid-century modern dining chair crafted from American black walnut. Upholstered seat in premium fabric, ideal for dining rooms and commercial restaurants.',
        material: 'American Black Walnut',
        dimensions: '55cm W × 52cm D × 82cm H',
        price: 420,
        availability: true,
        featured: false,
        images: [],
        tags: ['dining', 'walnut', 'mid-century', 'restaurant'],
    },
    {
        name: 'Park Wooden Bench',
        slug: 'park-wooden-bench',
        category: 'BENCH',
        description: 'Classic park bench with cast iron legs and treated pine slats. Galvanized steel hardware for long-lasting outdoor use.',
        material: 'Pine & Cast Iron',
        dimensions: '150cm W × 55cm D × 80cm H',
        price: 580,
        availability: true,
        featured: true,
        images: [],
        tags: ['park', 'outdoor', 'pine', 'cast-iron'],
    },
    {
        name: 'Stacking Banquet Chair',
        slug: 'stacking-banquet-chair',
        category: 'CHAIR',
        description: 'Lightweight stackable chair ideal for events and banquets. Padded seat and back upholstered in commercial-grade fabric. Stacks up to 20 high.',
        material: 'Steel Frame & Fabric',
        dimensions: '48cm W × 50cm D × 88cm H',
        price: 180,
        availability: true,
        featured: false,
        images: [],
        tags: ['banquet', 'event', 'stackable', 'commercial'],
    },
    {
        name: 'Rustic Pine Bench',
        slug: 'rustic-pine-bench',
        category: 'BENCH',
        description: 'Chunky rustic-style bench hewn from solid pine with a natural wax finish. Ideal for entryways, dining rooms, or outdoor spaces under a covered patio.',
        material: 'Solid Pine',
        dimensions: '140cm W × 40cm D × 46cm H',
        price: 320,
        availability: true,
        featured: false,
        images: [],
        tags: ['rustic', 'pine', 'indoor', 'dining'],
    },
    {
        name: 'Leather Executive Throne',
        slug: 'leather-executive-throne',
        category: 'CHAIR',
        description: 'Premium full-grain leather executive chair with chrome base and power-adjustable lumbar. The pinnacle of boardroom seating.',
        material: 'Full-Grain Leather & Chrome',
        dimensions: '72cm W × 70cm D × 115-125cm H',
        price: 2200,
        availability: true,
        featured: true,
        images: [],
        tags: ['leather', 'executive', 'premium', 'boardroom'],
    },
    {
        name: 'Custom Bulk Order',
        slug: 'custom-bulk-order',
        category: 'CUSTOM',
        description: 'Need a large number of chairs or benches for your office, hotel, school, or facility? Contact us for a custom bulk order quote. We manufacture to your specifications.',
        material: 'Custom',
        dimensions: 'Custom',
        price: null,
        availability: true,
        featured: false,
        images: [],
        tags: ['custom', 'bulk', 'wholesale', 'commercial'],
    },
    {
        name: 'Café Bistro Chair',
        slug: 'cafe-bistro-chair',
        category: 'CHAIR',
        description: 'Classic French bistro-style chair with rattan weave seat and powder-coated steel frame. Stackable and weather-resistant for indoor and outdoor café use.',
        material: 'Steel & Rattan',
        dimensions: '42cm W × 46cm D × 80cm H',
        price: 280,
        availability: true,
        featured: false,
        images: [],
        tags: ['café', 'bistro', 'rattan', 'outdoor'],
    },
    {
        name: 'Oak Storage Bench',
        slug: 'oak-storage-bench',
        category: 'BENCH',
        description: 'Dual-purpose oak bench with hinged lid and spacious storage compartment inside. Perfect for hallways and mudrooms, finished in natural lacquer.',
        material: 'Solid Oak',
        dimensions: '120cm W × 40cm D × 50cm H',
        price: 760,
        availability: true,
        featured: false,
        images: [],
        tags: ['storage', 'oak', 'hallway', 'indoor'],
    },
];

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@1234', 10);
    await prisma.admin.upsert({
        where: { email: process.env.ADMIN_EMAIL || 'admin@chairfactory.com' },
        update: {},
        create: {
            email: process.env.ADMIN_EMAIL || 'admin@chairfactory.com',
            passwordHash,
            name: process.env.ADMIN_NAME || 'Factory Admin',
        },
    });
    console.log('✅ Admin created');

    // Seed products
    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }
    console.log(`✅ ${products.length} products seeded`);

    // Seed default site content
    const defaultContent = {
        hero: {
            title: 'Crafting Premium Chairs Since 1998',
            subtitle: 'Factory-direct quality furniture for homes, offices, and commercial spaces.',
            ctaText: 'Browse Catalog',
            ctaLink: '/products',
        },
        about: {
            title: 'About Our Factory',
            description: 'With over 25 years of experience, we manufacture high-quality chairs and benches for residential and commercial clients across the country. Our state-of-the-art facility combines traditional craftsmanship with modern manufacturing techniques.',
            stats: [
                { label: 'Years of Experience', value: '25+' },
                { label: 'Products Manufactured', value: '50,000+' },
                { label: 'Happy Clients', value: '2,000+' },
                { label: 'Countries Served', value: '15+' },
            ],
        },
        contact: {
            address: '123 Industrial Park, Manufacturing District, City - 400001',
            phone: '+91 98765 43210',
            email: 'info@chairfactory.com',
            whatsapp: '+919876543210',
            hours: 'Mon–Sat: 9:00 AM – 6:00 PM',
        },
    };

    for (const [key, value] of Object.entries(defaultContent)) {
        await prisma.siteContent.upsert({
            where: { key },
            update: {},
            create: { key, value },
        });
    }
    console.log('✅ Site content seeded');

    // Seed default theme
    const existingTheme = await prisma.themeConfig.findFirst();
    if (!existingTheme) {
        await prisma.themeConfig.create({ data: { defaultTheme: 'light' } });
    }
    console.log('✅ Theme config seeded');

    console.log('🎉 Database seeding complete!');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
