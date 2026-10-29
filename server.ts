import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import type { Product, Category, StoreSettings } from './src/types/store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

app.use('/uploads', express.static(UPLOADS_DIR));

const DB_FILE = path.join(DATA_DIR, 'store_database.json');

// Initial seed data with our generated editorial images
const initialData = {
  adminUser: {
    id: 'admin_1',
    email: 'admin@aiistore99.com',
    passwordHash: crypto.createHash('sha256').update('admin123').digest('hex'),
    name: 'AiiStore99 Administrator',
    role: 'superadmin'
  },
  settings: {
    storeName: 'AiiStore99',
    tagline: 'Your Everyday Beauty & Style.',
    subheadline: 'Discover beauty, essentials, and timeless style in one place.',
    heroImage: '/src/assets/images/hero_editorial_beauty_1793243310383.jpg',
    heroBadgeText: "Editorial Edition '26",
    announcementBarText: 'Kurasi eksklusif kecantikan & busana pilihan · Konsultasi & pemesanan langsung via WhatsApp',
    isAnnouncementBarActive: true,
    whatsappNumber: '6281234567890',
    whatsappDefaultMessage: 'Halo AiiStore99, saya ingin berkonsultasi mengenai produk berikut dan melanjutkan pemesanan:',
    email: 'hello@aiistore99.com',
    instagramUrl: 'https://www.instagram.com/aiistore99',
    operationalHours: 'Senin - Sabtu: 09:00 - 20:00 WIB',
    address: 'Jakarta & Surabaya, Indonesia',
    freeShippingThreshold: 250000,
    promoBannerTitle: 'Timeless Elegance Collection',
    promoBannerSubtitle: 'Dirancang untuk menonjolkan keanggunan alami Anda setiap hari dengan kualitas bahan terbaik.',
    promoBannerButtonText: 'Jelajahi Koleksi',
    paymentMethods: [
      {
        id: 'bca',
        name: 'Transfer Bank BCA',
        description: 'Pembayaran manual via transfer ATM / Mobile Banking BCA.',
        accountNumber: '8830 1928 99',
        accountName: 'AiiStore99 Official',
        isActive: true
      },
      {
        id: 'mandiri',
        name: 'Transfer Bank Mandiri',
        description: 'Pembayaran transfer antar bank rekening Mandiri.',
        accountNumber: '1420 0192 8899',
        accountName: 'AiiStore99 Official',
        isActive: true
      },
      {
        id: 'qris',
        name: 'QRIS (Gopay / OVO / ShopeePay / Dana)',
        description: 'Scan kode QRIS yang akan kami kirimkan via WhatsApp setelah pesanan terkonfirmasi.',
        accountNumber: 'ID10200392819',
        accountName: 'AiiStore99 Merchant',
        isActive: true
      },
      {
        id: 'cod',
        name: 'Cash On Delivery (COD)',
        description: 'Bayar tunai saat barang sampai (khusus area Jabodetabek & Surabaya).',
        accountNumber: '',
        accountName: '',
        isActive: true
      }
    ]
  },
  categories: [
    {
      id: 'cat-skincare',
      name: 'Skincare',
      slug: 'skincare',
      description: 'Perawatan wajah esensial dengan formula lembut dan hidrasi mendalam.',
      image: '/src/assets/images/product_skincare_serum_1793243311550.jpg',
      order: 1,
      isActive: true
    },
    {
      id: 'cat-cosmetics',
      name: 'Cosmetics',
      slug: 'cosmetics',
      description: 'Kosmetik berpigmentasi halus untuk tampilan segar, alami, dan percaya diri.',
      image: '/src/assets/images/product_cosmetics_lipstick_1793243311358.jpg',
      order: 2,
      isActive: true
    },
    {
      id: 'cat-accessories',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Perhiasan champagne gold dan aksesoris elegan bernuansa minimalis.',
      image: '/src/assets/images/product_accessory_necklace_1793243312624.jpg',
      order: 3,
      isActive: true
    },
    {
      id: 'cat-fashion',
      name: 'Fashion',
      slug: 'fashion',
      description: 'Pakaian berbahan linen premium dan siluet kontemporer serbaguna.',
      image: '/src/assets/images/product_fashion_blazer_1793243312432.jpg',
      order: 4,
      isActive: true
    }
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Radiance Botanical Glow Dropper Serum',
      slug: 'radiance-botanical-glow-dropper-serum',
      category: 'skincare',
      shortDescription: 'Serum wajah konsentrat dengan tekstur ringan untuk hidrasi tahan lama dan kilau alami kulit.',
      fullDescription: 'Radiance Botanical Glow Dropper Serum dirancang khusus untuk memenuhi kebutuhan hidrasi harian kulit Anda.\n\nKeunggulan Formula:\n• Tekstur cair ringan cepat meresap tanpa rasa lengket\n• Menjaga kelembapan optimal sepanjang hari\n• Cocok untuk semua jenis kulit, termasuk kulit sensitif\n• Kemasan botol kaca frosted premium dengan aplikator dropper higienis\n\nCara Pemakaian:\nTeteskan 3-4 tetes serum pada wajah dan leher yang telah dibersihkan. Tepuk lembut dengan ujung jari hingga meresap sempurna sebelum menggunakan pelembap.',
      price: 189000,
      originalPrice: 229000,
      sku: 'SKIN-RAD-01',
      stock: 45,
      variants: [
        { id: 'v1', name: '30 ml (Standard)', sku: 'SKIN-RAD-01-30', stock: 30, priceDelta: 0 },
        { id: 'v2', name: '50 ml (Value Size)', sku: 'SKIN-RAD-01-50', stock: 15, priceDelta: 70000 }
      ],
      primaryImage: '/src/assets/images/product_skincare_serum_1793243311550.jpg',
      gallery: [
        '/src/assets/images/product_skincare_serum_1793243311550.jpg'
      ],
      altText: 'Botol kaca frosted serum wajah premium dengan pipet dropper amber',
      label: 'Best Seller' as const,
      isActive: true,
      isFeatured: true,
      createdAt: '2026-10-20T10:00:00Z',
      updatedAt: '2026-10-28T10:00:00Z'
    },
    {
      id: 'prod-2',
      name: 'Aurelia Velvet Matte Hydrating Lip Tint',
      slug: 'aurelia-velvet-matte-hydrating-lip-tint',
      category: 'cosmetics',
      shortDescription: 'Lipstik matte bertekstur velvet lembut dengan formula nyaman yang tidak membuat bibir kering.',
      fullDescription: 'Aurelia Velvet Matte Hydrating Lip Tint menghadirkan sentuhan warna hangat yang menyatu harmonis dengan warna bibir alami.\n\nDetail Produk:\n• Sentuhan akhir matte halus seperti beludru\n• Pigmentasi tinggi hanya dengan satu pulasan halus\n• Casing champagne gold dengan magnetik cap eksklusif\n• Nyaman dipakai seharian tanpa rasa berat\n\nPilihan Shade:\n• Warm Nude: Warna nude hangat untuk kegiatan harian\n• Terracotta Rose: Sentuhan merah bata lembut berkarakter',
      price: 145000,
      originalPrice: 175000,
      sku: 'COS-LIP-02',
      stock: 60,
      variants: [
        { id: 'v3', name: 'Warm Nude (01)', sku: 'COS-LIP-01', stock: 35, priceDelta: 0 },
        { id: 'v4', name: 'Terracotta Rose (02)', sku: 'COS-LIP-02', stock: 25, priceDelta: 0 }
      ],
      primaryImage: '/src/assets/images/product_cosmetics_lipstick_1793243311358.jpg',
      gallery: [
        '/src/assets/images/product_cosmetics_lipstick_1793243311358.jpg'
      ],
      altText: 'Lipstik velvet matte nude elegan dengan kemasan champagne gold dan hitam',
      label: 'New Arrival' as const,
      isActive: true,
      isFeatured: true,
      createdAt: '2026-10-22T11:30:00Z',
      updatedAt: '2026-10-28T10:00:00Z'
    },
    {
      id: 'prod-3',
      name: 'Aurelia 18K Gold Hammered Medallion Pendant',
      slug: 'aurelia-18k-gold-hammered-medallion-pendant',
      category: 'accessories',
      shortDescription: 'Kalung rantai halus berhias liontin medali emas dengan tekstur hammered bernuansa artisanal.',
      fullDescription: 'Kalung liontin emas 18K dengan teknik hammered tangan yang memberikan kilau cahaya lembut yang unik di setiap sudutnya.\n\nSpesifikasi:\n• Rantai tipis elegan tahan luntur\n• Liontin medali bulat dengan tekstur hammered organik\n• Kancing pengait lobster kokoh\n• Bebas nikel dan ramah untuk kulit sensitif\n\nPerawatan:\nHindari kontak langsung dengan parfum atau bahan kimia keras. Simpan dalam kantong kain lembut saat tidak digunakan.',
      price: 265000,
      originalPrice: 299000,
      sku: 'ACC-NECK-03',
      stock: 28,
      variants: [
        { id: 'v5', name: 'Rantai 42 cm', sku: 'ACC-NECK-03-42', stock: 16, priceDelta: 0 },
        { id: 'v6', name: 'Rantai 48 cm', sku: 'ACC-NECK-03-48', stock: 12, priceDelta: 20000 }
      ],
      primaryImage: '/src/assets/images/product_accessory_necklace_1793243312624.jpg',
      gallery: [
        '/src/assets/images/product_accessory_necklace_1793243312624.jpg'
      ],
      altText: 'Kalung liontin medali emas 18 karat di atas kain linen alami',
      label: 'Curated Pick' as const,
      isActive: true,
      isFeatured: true,
      createdAt: '2026-10-24T09:15:00Z',
      updatedAt: '2026-10-28T10:00:00Z'
    },
    {
      id: 'prod-4',
      name: 'Atelier Raw Linen Structured Oversized Blazer',
      slug: 'atelier-raw-linen-structured-oversized-blazer',
      category: 'fashion',
      shortDescription: 'Blazer linen murni bernuansa ivory dengan potongan relaxed tailored untuk gaya harian maupun formal.',
      fullDescription: 'Atelier Raw Linen Blazer adalah busana esensial lemari pakaian Anda. Menghadirkan keseimbangan antara kenyamanan bahan alami dan siluet berstruktur yang elegan.\n\nDetail Pakaian:\n• 100% linen alami breathable dan sejuk di kulit\n• Lapisan dalam parsial berbahan katun ringan\n• Kancing tanduk sintetis bernuansa tortoiseshell alami\n• Dua saku tempel fungsional di bagian depan\n• Potongan oversized kontemporer yang pas dan tidak kaku\n\nPanduan Ukuran:\n• Size S: Lingkar Dada 102 cm, Panjang 72 cm\n• Size M: Lingkar Dada 108 cm, Panjang 74 cm\n• Size L: Lingkar Dada 114 cm, Panjang 76 cm',
      price: 495000,
      originalPrice: 580000,
      sku: 'FASH-BLZ-04',
      stock: 20,
      variants: [
        { id: 'v7', name: 'Ukuran S (Oatmeal Cream)', sku: 'FASH-BLZ-04-S', stock: 6, priceDelta: 0 },
        { id: 'v8', name: 'Ukuran M (Oatmeal Cream)', sku: 'FASH-BLZ-04-M', stock: 9, priceDelta: 0 },
        { id: 'v9', name: 'Ukuran L (Oatmeal Cream)', sku: 'FASH-BLZ-04-L', stock: 5, priceDelta: 0 }
      ],
      primaryImage: '/src/assets/images/product_fashion_blazer_1793243312432.jpg',
      gallery: [
        '/src/assets/images/product_fashion_blazer_1793243312432.jpg'
      ],
      altText: 'Blazer linen oversized warna ivory cream digantung pada hanger kayu minimalis',
      label: 'Limited Edition' as const,
      isActive: true,
      isFeatured: true,
      createdAt: '2026-10-25T14:20:00Z',
      updatedAt: '2026-10-28T10:00:00Z'
    }
  ],
  orders: [] as any[],
  sessions: {} as Record<string, { userId: string; email: string; expires: number }>
};

interface StoreDatabase {
  adminUser: typeof initialData.adminUser;
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
  orders: any[];
  sessions: Record<string, { userId: string; email: string; expires: number }>;
}

// Database helper functions
function loadDatabase(): StoreDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      saveDatabase(initialData);
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      adminUser: parsed.adminUser || initialData.adminUser,
      settings: parsed.settings || initialData.settings,
      categories: parsed.categories || initialData.categories,
      products: parsed.products || initialData.products,
      orders: parsed.orders || [],
      sessions: parsed.sessions || {}
    };
  } catch (err) {
    console.error('Error loading database, using memory fallback:', err);
    return initialData;
  }
}

function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// In-memory + file-persisted active tokens
function generateToken(userId: string, email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 7 days expiration
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const db = loadDatabase();
  db.sessions = db.sessions || {};
  db.sessions[token] = { userId, email, expires };
  saveDatabase(db);
  return token;
}

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Sesi tidak terautentikasi. Silakan login kembali.' });
  }
  const token = authHeader.split(' ')[1];
  const db = loadDatabase();
  const session = db.sessions?.[token];
  if (!session || session.expires < Date.now()) {
    if (db.sessions && db.sessions[token]) {
      delete db.sessions[token];
      saveDatabase(db);
    }
    return res.status(401).json({ error: 'Sesi login telah kedaluwarsa. Silakan login kembali.' });
  }
  (req as any).user = session;
  next();
}

// --- API ENDPOINTS ---

// Health & Info
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', store: 'AiiStore99', timestamp: new Date().toISOString() });
});

// Settings
app.get('/api/settings', (req, res) => {
  const db = loadDatabase();
  res.json(db.settings);
});

app.put('/api/settings', authMiddleware, (req, res) => {
  const db = loadDatabase();
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// Categories
app.get('/api/categories', (req, res) => {
  const db = loadDatabase();
  const sorted = [...db.categories].sort((a, b) => a.order - b.order);
  res.json(sorted);
});

app.post('/api/categories', authMiddleware, (req, res) => {
  const db = loadDatabase();
  const { name, slug, description, image, order } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Nama kategori wajib diisi' });
  }
  const newCat = {
    id: 'cat-' + Date.now(),
    name: name.trim(),
    slug: (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: description || '',
    image: image || '',
    order: Number(order) || db.categories.length + 1,
    isActive: true
  };
  db.categories.push(newCat);
  saveDatabase(db);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', authMiddleware, (req, res) => {
  const db = loadDatabase();
  const index = db.categories.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Kategori tidak ditemukan' });
  }
  db.categories[index] = { ...db.categories[index], ...req.body, id: req.params.id };
  saveDatabase(db);
  res.json(db.categories[index]);
});

app.delete('/api/categories/:id', authMiddleware, (req, res) => {
  const db = loadDatabase();
  const cat = db.categories.find((c: any) => c.id === req.params.id);
  if (!cat) {
    return res.status(404).json({ error: 'Kategori tidak ditemukan' });
  }
  // Check if products use this category slug
  const usedCount = db.products.filter((p: any) => p.category === cat.slug).length;
  if (usedCount > 0) {
    return res.status(400).json({
      error: `Kategori '${cat.name}' tidak dapat dihapus karena masih digunakan oleh ${usedCount} produk. Pindahkan produk terlebih dahulu.`
    });
  }
  db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: `Kategori '${cat.name}' berhasil dihapus.` });
});

app.post('/api/categories/reorder', authMiddleware, (req, res) => {
  const db = loadDatabase();
  const { orderList } = req.body; // array of { id, order }
  if (Array.isArray(orderList)) {
    const orderMap = new Map(orderList.map((item: any) => [item.id, Number(item.order)]));
    db.categories.forEach((cat: any) => {
      if (orderMap.has(cat.id)) {
        cat.order = orderMap.get(cat.id);
      }
    });
    db.categories.sort((a: any, b: any) => a.order - b.order);
    saveDatabase(db);
  }
  res.json({ success: true, categories: db.categories });
});

// Products
app.get('/api/products', (req, res) => {
  const db = loadDatabase();
  const { category, search, includeInactive, sort } = req.query;

  let filtered = [...db.products];

  if (includeInactive !== 'true') {
    filtered = filtered.filter((p: any) => p.isActive !== false);
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((p: any) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (p: any) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'price-low') {
    filtered.sort((a: any, b: any) => a.price - b.price);
  } else if (sort === 'price-high') {
    filtered.sort((a: any, b: any) => b.price - a.price);
  } else if (sort === 'name-asc') {
    filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
  } else {
    // Newest first default
    filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const db = loadDatabase();
  const prod = db.products.find((p: any) => p.id === req.params.id || p.slug === req.params.id);
  if (!prod) return res.status(404).json({ error: 'Produk tidak ditemukan' });
  res.json(prod);
});

app.post('/api/products', authMiddleware, (req, res) => {
  const db = loadDatabase();
  const data = req.body;
  if (!data.name || data.price === undefined) {
    return res.status(400).json({ error: 'Nama produk dan harga wajib diisi' });
  }

  const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newProduct = {
    id: 'prod-' + Date.now(),
    name: data.name.trim(),
    slug: slug + '-' + Math.floor(Math.random() * 1000),
    category: data.category || 'skincare',
    shortDescription: data.shortDescription || '',
    fullDescription: data.fullDescription || '',
    price: Number(data.price) || 0,
    originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
    sku: data.sku || '',
    stock: Number(data.stock) >= 0 ? Number(data.stock) : 10,
    variants: Array.isArray(data.variants) ? data.variants : [],
    primaryImage: data.primaryImage || '/src/assets/images/product_skincare_serum_1793243311550.jpg',
    gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [data.primaryImage || '/src/assets/images/product_skincare_serum_1793243311550.jpg'],
    altText: data.altText || data.name,
    label: data.label || '',
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    isFeatured: Boolean(data.isFeatured),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authMiddleware, (req, res) => {
  const db = loadDatabase();
  const index = db.products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }

  const existing = db.products[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    price: Number(req.body.price !== undefined ? req.body.price : existing.price),
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
    stock: Number(req.body.stock !== undefined ? req.body.stock : existing.stock),
    updatedAt: new Date().toISOString()
  };

  db.products[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.post('/api/products/:id/duplicate', authMiddleware, (req, res) => {
  const db = loadDatabase();
  const original = db.products.find((p: any) => p.id === req.params.id);
  if (!original) {
    return res.status(404).json({ error: 'Produk asli tidak ditemukan' });
  }

  const cloned = {
    ...original,
    id: 'prod-' + Date.now(),
    name: `${original.name} (Salinan)`,
    slug: `${original.slug}-copy-${Date.now().toString().slice(-4)}`,
    sku: original.sku ? `${original.sku}-COPY` : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.unshift(cloned);
  saveDatabase(db);
  res.status(201).json(cloned);
});

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const db = loadDatabase();
  const index = db.products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }

  const deleted = db.products[index];
  db.products.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, message: `Produk '${deleted.name}' berhasil dihapus.` });
});

// Image Upload Endpoint (handles data URL or base64)
app.post('/api/upload', authMiddleware, (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Data gambar base64 tidak ditemukan' });
    }

    // Match data URI header
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let extension = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) extension = 'png';
      else if (mime.includes('webp')) extension = 'webp';
      else if (mime.includes('svg')) extension = 'svg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(imageBase64, 'base64');
    }

    const cleanFilename = (filename || 'product-img')
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .toLowerCase();
    const finalFilename = `${cleanFilename}_${Date.now()}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, finalFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${finalFilename}`;
    res.json({ url: publicUrl, filename: finalFilename });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Gagal memproses upload gambar: ' + err.message });
  }
});

// Orders
app.get('/api/orders', authMiddleware, (req, res) => {
  const db = loadDatabase();
  res.json(db.orders || []);
});

app.post('/api/orders', (req, res) => {
  const db = loadDatabase();
  const { customerName, customerWhatsapp, shippingAddress, city, notes, paymentMethod, items, subtotal, shippingFee, total } = req.body;

  if (!customerName || !customerWhatsapp || !shippingAddress || !items || items.length === 0) {
    return res.status(400).json({ error: 'Informasi pemesan dan produk dalam keranjang wajib lengkap' });
  }

  const orderNumber = 'AII-' + Date.now().toString().slice(-6);
  const newOrder = {
    id: 'ord-' + Date.now(),
    orderNumber,
    customerName: customerName.trim(),
    customerWhatsapp: customerWhatsapp.trim(),
    shippingAddress: shippingAddress.trim(),
    city: city ? city.trim() : 'Indonesia',
    notes: notes || '',
    paymentMethod: paymentMethod || 'BCA',
    items,
    subtotal: Number(subtotal) || 0,
    shippingFee: Number(shippingFee) || 0,
    total: Number(total) || 0,
    status: 'pending',
    whatsappSent: true,
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Reduce stock
  items.forEach((item: any) => {
    const prod = db.products.find((p: any) => p.id === item.productId);
    if (prod && prod.stock >= item.quantity) {
      prod.stock -= item.quantity;
      if (item.variantId && Array.isArray(prod.variants)) {
        const variant = prod.variants.find((v: any) => v.id === item.variantId);
        if (variant && variant.stock && variant.stock >= item.quantity) {
          variant.stock -= item.quantity;
        }
      }
    }
  });

  saveDatabase(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', authMiddleware, (req, res) => {
  const db = loadDatabase();
  const order = db.orders.find((o: any) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });

  order.status = req.body.status || order.status;
  saveDatabase(db);
  res.json(order);
});

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = loadDatabase();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }

  const hash = crypto.createHash('sha256').update(password).digest('hex');
  if (
    db.adminUser.email.toLowerCase() === email.toLowerCase().trim() &&
    db.adminUser.passwordHash === hash
  ) {
    const token = generateToken(db.adminUser.id, db.adminUser.email);
    return res.json({
      token,
      user: {
        id: db.adminUser.id,
        email: db.adminUser.email,
        name: db.adminUser.name,
        role: db.adminUser.role
      }
    });
  }

  return res.status(401).json({ error: 'Email atau password admin salah. Silakan coba kembali.' });
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  const db = loadDatabase();
  res.json({
    user: {
      id: db.adminUser.id,
      email: db.adminUser.email,
      name: db.adminUser.name,
      role: db.adminUser.role
    }
  });
});

app.post('/api/auth/change-password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password baru minimal 6 karakter' });
  }

  const db = loadDatabase();
  const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');
  if (db.adminUser.passwordHash !== currentHash) {
    return res.status(400).json({ error: 'Password saat ini salah' });
  }

  db.adminUser.passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
  saveDatabase(db);
  res.json({ success: true, message: 'Password admin berhasil diperbarui' });
});

// Reset Demo Data
app.post('/api/database/reset', authMiddleware, (req, res) => {
  saveDatabase(initialData);
  res.json({ success: true, message: 'Data demo toko berhasil di-reset ke kondisi awal.', data: initialData });
});

// Setup Vite or static serving
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[AiiStore99] Server running on port ${PORT} (isProduction: ${isProduction})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
