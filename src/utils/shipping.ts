export interface Location {
  code: string;
  name: string;
}

// Distritos de Lima (completo - mantenido igual)
export const DISTRICTS: Location[] = [
  // Lima Metropolitana
  { code: "LIM01", name: "Lima Cercado" },
  { code: "MIRA", name: "Miraflores" },
  { code: "BARR", name: "Barranco" },
  { code: "SURC", name: "Santiago de Surco" },
  { code: "SANI", name: "San Isidro" },
  { code: "SJMI", name: "San Juan de Miraflores" },
  { code: "SJLU", name: "San Juan de Lurigancho" },
  { code: "SABO", name: "San Borja" },
  { code: "SLUI", name: "San Luis" },
  { code: "SAMI", name: "San Miguel" },
  { code: "LAMO", name: "La Molina" },
  { code: "LAVI", name: "La Victoria" },
  { code: "JESU", name: "Jesús María" },
  { code: "PLIB", name: "Pueblo Libre" },
  { code: "MAGD", name: "Magdalena del Mar" },
  { code: "BRNA", name: "Breña" },
  { code: "RIMA", name: "Rímac" },
  { code: "ANCON", name: "Ancón" },
  { code: "SMAR", name: "Santa María del Mar" },
  { code: "PUCH", name: "Pucusana" },
  { code: "CHOR", name: "Chorrillos" },
  { code: "INDE", name: "Independencia" },
  { code: "COMAS", name: "Comas" },
  { code: "VMTE", name: "Villa María del Triunfo" },
  { code: "VES", name: "Villa El Salvador" },
  { code: "LURI", name: "Lurigancho" },
  { code: "ANAV", name: "Ate" },
  { code: "CHAR", name: "Chaclacayo" },
  { code: "CINC", name: "Cieneguilla" },
  { code: "PACH", name: "Pachacamac" },
  { code: "LURIN", name: "Lurín" },
  { code: "CALE", name: "Carabayllo" },
  { code: "PNVO", name: "Puente Piedra" },
  { code: "SMP", name: "San Martín de Porres" },
  { code: "LPER", name: "Los Olivos" },
  { code: "SANB", name: "Santa Anita" },
  { code: "SBAR", name: "Santa Rosa" },
  { code: "ELAGU", name: "El Agustino" },
  { code: "SURQ", name: "Surquillo" },
  { code: "LPUN", name: "Punta Hermosa" },
  { code: "PUNT", name: "Punta Negra" },
  { code: "SBART", name: "San Bartolo" },
];

// Departamentos/Regiones (reemplazando provincias)
export const DEPARTMENTS: Location[] = [
  { code: "AMAZ", name: "Amazonas" },
  { code: "ANCA", name: "Áncash" },
  { code: "APURI", name: "Apurímac" },
  { code: "AREQ", name: "Arequipa" },
  { code: "AYAC", name: "Ayacucho" },
  { code: "CAJAM", name: "Cajamarca" },
  { code: "CALL", name: "Callao" },
  { code: "CUSCO", name: "Cusco" },
  { code: "HVANC", name: "Huancavelica" },
  { code: "HUANU", name: "Huánuco" },
  { code: "ICA", name: "Ica" },
  { code: "JUNIN", name: "Junín" },
  { code: "LALIB", name: "La Libertad" },
  { code: "LAMBA", name: "Lambayeque" },
  { code: "LIMA", name: "Lima" },
  { code: "LORET", name: "Loreto" },
  { code: "MADRE", name: "Madre de Dios" },
  { code: "MOQUE", name: "Moquegua" },
  { code: "PASCO", name: "Pasco" },
  { code: "PIURA", name: "Piura" },
  { code: "PUNO", name: "Puno" },
  { code: "SMART", name: "San Martín" },
  { code: "TACNA", name: "Tacna" },
  { code: "TUMBS", name: "Tumbes" },
  { code: "UCAYA", name: "Ucayali" },
];

export const COUNTRIES: Location[] = [
  { code: "COL", name: "Colombia" },
  { code: "MX", name: "México" },
  { code: "SPN", name: "España" },
];

export const DISTRICT_SHIPPING_RATES: { [code: string]: number } = {
  LIM01: 15.0,
  MIRA: 10.0,
  BARR: 10.0,
  SURC: 10.0,
  SANI: 10.0,
  SJMI: 15.0,
  SJLU: 25.0,
  SABO: 10.0,
  SLUI: 10.0,
  SAMI: 15.0,
  LAMO: 15.0,
  LAVI: 15.0,
  JESU: 15.0,
  PLIB: 15.0,
  MAGD: 15.0,
  BRNA: 15.0,
  RIMA: 20.0,
  SMAR: 15.0,
  PUCH: 15.0,
  ANCON: 15.0,
  CHOR: 15.0,
  INDE: 20.0,
  COMAS: 30.0,
  VMTE: 20.0,
  VES: 20.0,
  LURI: 15.0,
  ANAV: 20.0,
  CHAR: 15.0,
  CINC: 15.0,
  PACH: 15.0,
  LURIN: 15.0,
  CALE: 40.0,
  PNVO: 15.0,
  SMP: 25.0,
  LPER: 20.0,
  SANB: 15.0,
  SBAR: 15.0,
  ELAGU: 15.0,
  SURQ: 10.0,
  LPUN: 15.0,
  PUNT: 15.0,
  SBART: 15.0,
};

export const DEPARTMENT_SHIPPING_RATES: { [code: string]: number } = {
  AMAZ: 40.0,
  LORET: 45.0,
  MADRE: 45.0,
  SMART: 40.0,
  UCAYA: 45.0,

  ANCA: 20.0,
  APURI: 20.0,
  AREQ: 20.0,
  AYAC: 20.0,
  CAJAM: 20.0,
  CALL: 20.0,
  CUSCO: 20.0,
  HVANC: 20.0,
  HUANU: 20.0,
  ICA: 20.0,
  JUNIN: 20.0,
  LALIB: 20.0,
  LAMBA: 20.0,
  LIMA: 20.0,
  MOQUE: 20.0,
  PASCO: 20.0,
  PIURA: 20.0,
  PUNO: 20.0,
  TACNA: 20.0,
  TUMBS: 20.0,
};

export const COUNTRY_SHIPPING_RATES: { [code: string]: number } = {
  COL: 140.0,
  MX: 150.0,
  SPN: 160.0,
};

export const DEFAULT_COUNTRY_SHIPPING_COST = 40.0;
export const DEFAULT_DISTRICT_SHIPPING_COST = 15.0;
export const DEFAULT_DEPARTMENT_SHIPPING_COST = 20.0;

export function calculateShippingCost(
  district: string | null,
  packageId: string | null,
): number {
  if (!district) return DEFAULT_DISTRICT_SHIPPING_COST;
  if (DISTRICT_SHIPPING_RATES[district]) {
    return DISTRICT_SHIPPING_RATES[district];
  }
  if (district.startsWith("LIM")) {
    return 15.0;
  }
  return DEFAULT_DISTRICT_SHIPPING_COST;
}

export function calculateDepartmentShippingCost(
  department: string | null,
  packageId: string | null,
): number {
  if (!department) return DEFAULT_DEPARTMENT_SHIPPING_COST;
  if (DEPARTMENT_SHIPPING_RATES[department]) {
    return DEPARTMENT_SHIPPING_RATES[department];
  }
  return DEFAULT_DEPARTMENT_SHIPPING_COST;
}

export function calculateCountryShippingCost(
  country: string | null,
  packageId: string | null,
): number {
  if (!country) return DEFAULT_COUNTRY_SHIPPING_COST;
  if (COUNTRY_SHIPPING_RATES[country]) {
    return COUNTRY_SHIPPING_RATES[country];
  }
  return DEFAULT_COUNTRY_SHIPPING_COST;
}

export function getCulqiLink(locationCode: string): string {
  if (CULQI_PLANS[locationCode]) {
    return CULQI_PLANS[locationCode];
  }
  return CULQI_PLANS["DEFAULT"] || "";
}

export const CULQI_PLANS: { [key: string]: string } = {
  DEFAULT:
    "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",

  LIM01:
    "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  MIRA: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  BARR: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  SURC: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  SANI: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  SJMI: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  SJLU: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  SABO: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  SLUI: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  SAMI: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",

  AREQ: "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  CUSCO:
    "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  LALIB:
    "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  PIURA:
    "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
  LAMBA:
    "https://subscriptions.culqi.com/onboarding?id=24440d27-e3af-429f-b78e-c522d2012a23",
};
