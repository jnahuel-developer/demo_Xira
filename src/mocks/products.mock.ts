export type ProductItem = {
  id: string;
  name: string;
  stockOnHand: number;
  expiresOn: string;
  lowStockThreshold: number;
  photoUrl: string | null;
};

export const activeProductCenterName = "Consultorio Melendez";

function buildProductThumb(label: string, startColor: string, endColor: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="url(#g)" />
      <circle cx="60" cy="42" r="20" fill="rgba(255,255,255,0.26)" />
      <rect x="28" y="68" width="64" height="18" rx="9" fill="rgba(255,255,255,0.34)" />
      <text x="60" y="104" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const productsMock: ProductItem[] = [
  {
    id: "prd-serum-vitamina-c",
    name: "Serum vitamina C",
    stockOnHand: 12,
    expiresOn: "2026-10-18",
    lowStockThreshold: 4,
    photoUrl: buildProductThumb("VC", "#e8a83a", "#f2d06d"),
  },
  {
    id: "prd-protector-solar-50",
    name: "Protector solar FPS 50",
    stockOnHand: 3,
    expiresOn: "2026-11-28",
    lowStockThreshold: 5,
    photoUrl: buildProductThumb("FPS", "#ef8f57", "#f7c56c"),
  },
  {
    id: "prd-crema-reparadora",
    name: "Crema reparadora post procedimiento",
    stockOnHand: 9,
    expiresOn: "2026-05-04",
    lowStockThreshold: 3,
    photoUrl: buildProductThumb("CR", "#6eaad9", "#89d4f1"),
  },
  {
    id: "prd-espuma-limpieza",
    name: "Espuma de limpieza facial",
    stockOnHand: 0,
    expiresOn: "2026-12-12",
    lowStockThreshold: 4,
    photoUrl: null,
  },
  {
    id: "prd-gel-postlaser",
    name: "Gel calmante post láser",
    stockOnHand: 2,
    expiresOn: "2026-04-29",
    lowStockThreshold: 4,
    photoUrl: buildProductThumb("GL", "#76b596", "#9fd7b0"),
  },
  {
    id: "prd-mascara-led-home",
    name: "Máscara LED home care",
    stockOnHand: 7,
    expiresOn: "2027-02-16",
    lowStockThreshold: 2,
    photoUrl: buildProductThumb("LED", "#9b82d7", "#c7b2f3"),
  },
  {
    id: "prd-bruma-hidratante",
    name: "Bruma hidratante",
    stockOnHand: 1,
    expiresOn: "2026-05-10",
    lowStockThreshold: 3,
    photoUrl: null,
  },
  {
    id: "prd-kit-postpeeling",
    name: "Kit post peeling",
    stockOnHand: 5,
    expiresOn: "2026-08-21",
    lowStockThreshold: 2,
    photoUrl: buildProductThumb("KIT", "#de7b8b", "#f1b0b7"),
  },
];
