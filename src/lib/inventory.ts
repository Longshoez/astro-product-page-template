export type SheetRange = string;
export type SheetValues = any[][];
export type StockData = Record<string, StockItem>;
export interface StockItem {
  sku: string;
  title: string;
  price: number;
  regularPrice: number;
  disponible: number;
  total: number;
  notas: string;
  featured: boolean;
  tipo: "subscription" | "package";
  tier: number;
  benefitGeneral: string;
  quienes_pueden_usarlo: string;
  uso_diario: string;
}
export interface ProductUI extends StockItem {
  productDetail: string;
  productPrice: string;
  productDeal: string;
  stock: boolean;
}

const INVENTORY_SHEET = "Inventario";
const PUBLISHED_SHEET_ID =
  "2PACX-1vRyo_8ixf17YTHOg0IlXZKxhSL0Hhiulq_ujFjg5b60010Cjry4ZiwMrYnOwFnh2YbWWU1xhLGejF8S";
const GID = "1721761715";

const CACHE_TIME = 3600 * 1000;
let cachedData: {
  inventory: StockData | null;
  timestamp: number;
} = {
  inventory: null,
  timestamp: 0,
};

function parseCSVLine(line: string): any[] {
  const result = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(currentValue.trim());
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  result.push(currentValue.trim());

  return result.map((item) => {
    if (item.startsWith('"') && item.endsWith('"')) {
      return item.slice(1, -1).trim();
    }
    return item.trim();
  });
}

export async function getSheetData(
  sheetName: string,
  range: SheetRange = "A1:Z1000",
): Promise<SheetValues> {
  try {
    const encodedRange = encodeURIComponent(range);
    const url = `https://docs.google.com/spreadsheets/d/e/${PUBLISHED_SHEET_ID}/pub?output=csv&gid=${GID}&range=${encodedRange}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/csv",
      },
    });

    if (!response.ok) {
      const errorContent = await response.text();
      throw new Error(
        `HTTP Error ${response.status}: ${errorContent.slice(0, 100)}...`,
      );
    }

    const csvData = await response.text();
    return csvData
      .split("\n")
      .filter((line) => line.trim())
      .map(parseCSVLine);
  } catch (error: any) {
    console.error(`Error crítico: ${error.message}`);
    throw new Error("Error al obtener datos de Google Sheets");
  }
}

export async function getInventory(): Promise<StockData> {
  try {
    const now = Date.now();
    if (cachedData.inventory && now - cachedData.timestamp < CACHE_TIME) {
      return cachedData.inventory;
    }

    const data = await getSheetData(INVENTORY_SHEET, "A2:M");
    const stockData: StockData = {};
    const seenSkus = new Set();

    if (data && data.length > 0) {
      data.forEach((row, index) => {
        if (row.length < 13) {
          console.warn(`Fila ${index + 2} inválida (incompleta). Omitiendo.`);
          return;
        }

        const [
          sku,
          title,
          price,
          regularPrice,
          disponible,
          total,
          notas,
          featured,
          tipo,
          tier,
          benefitGeneral,
          quienes_pueden_usarlo,
          uso_diario,
        ] = row;

        const cleanSku = String(sku).trim();
        if (!cleanSku) {
          console.warn(`Fila ${index + 2} sin SKU válido. Omitiendo.`);
          return;
        }

        if (seenSkus.has(cleanSku)) {
          console.warn(`SKU duplicado: ${cleanSku} en fila ${index + 2}`);
          return;
        }

        seenSkus.add(cleanSku);
        stockData[cleanSku] = {
          sku: cleanSku,
          title: String(title),
          price: Math.max(0, Number(price) || 0),
          regularPrice: Math.max(0, Number(regularPrice) || 0),
          disponible: Math.max(0, Number(disponible) || 0),
          total: Math.max(0, Number(total) || 0),
          notas: String(notas),
          featured: String(featured).toUpperCase() === "TRUE",
          tipo:
            String(tipo).toLowerCase() === "subscription"
              ? "subscription"
              : "package",
          tier: Math.max(0, Number(tier) || 0),
          benefitGeneral: String(benefitGeneral),
          quienes_pueden_usarlo: String(quienes_pueden_usarlo),
          uso_diario: String(uso_diario),
        };
      });
    }

    cachedData = {
      inventory: stockData,
      timestamp: now,
    };

    return stockData;
  } catch (error) {
    console.error("Error obteniendo stock:", error);
    return {};
  }
}

export async function getProducts(limit?: number): Promise<ProductUI[]> {
  try {
    const stockData = await getInventory();
    const products = Object.values(stockData).map((item) => {
      const discountPercentage =
        item.price && item.regularPrice
          ? Math.round((1 - item.price / item.regularPrice) * 100)
          : 0;

      return {
        ...item,
        productDetail: `Antes: S/. ${item.regularPrice.toFixed(2)}`,
        productPrice: `S/. ${item.price.toFixed(2)}`,
        productDeal:
          discountPercentage > 0 ? `(Ahorra ${discountPercentage}%)` : "",
        stock: item.disponible > 0,
      };
    });

    return limit ? products.slice(0, limit) : products;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }
}
