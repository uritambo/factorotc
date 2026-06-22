export interface Position {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
  sector: string;
  marketCap: string;
  description: string;
  peRatio: number;
  dividendYield: number;
  week52High: number;
  week52Low: number;
}

export interface PortfolioHistoryPoint {
  date: string;
  value: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  relatedTickers: string[];
  publishedAt: string;
  author: string;
}

const positions: Position[] = [
  {
    id: "1",
    ticker: "ITX",
    name: "Inditex",
    quantity: 150,
    avgCost: 32.40,
    currentPrice: 38.72,
    currency: "EUR",
    sector: "Consum Discrecional",
    marketCap: "120B€",
    description: "Inditex és el grup de moda més gran del món, propietari de marques com Zara, Pull&Bear, Massimo Dutti i Bershka.",
    peRatio: 22.5,
    dividendYield: 3.2,
    week52High: 42.10,
    week52Low: 28.90,
  },
  {
    id: "2",
    ticker: "IBE",
    name: "Iberdrola",
    quantity: 400,
    avgCost: 11.20,
    currentPrice: 12.85,
    currency: "EUR",
    sector: "Utilitats",
    marketCap: "83B€",
    description: "Iberdrola és una de les majors utilities del món especialitzada en energia renovable.",
    peRatio: 18.3,
    dividendYield: 4.1,
    week52High: 14.20,
    week52Low: 10.35,
  },
  {
    id: "3",
    ticker: "AAPL",
    name: "Apple Inc.",
    quantity: 20,
    avgCost: 142.50,
    currentPrice: 178.30,
    currency: "USD",
    sector: "Tecnologia",
    marketCap: "2.8T$",
    description: "Apple Inc. és una empresa tecnològica multinacional que dissenya, desenvolupa i ven electrònica de consum.",
    peRatio: 29.8,
    dividendYield: 0.5,
    week52High: 198.23,
    week52Low: 164.08,
  },
  {
    id: "4",
    ticker: "MC",
    name: "LVMH Moët Hennessy",
    quantity: 10,
    avgCost: 680.00,
    currentPrice: 742.50,
    currency: "EUR",
    sector: "Consum Discrecional",
    marketCap: "370B€",
    description: "LVMH és el major conglomerat de luxe del món, propietari de Louis Vuitton, Dior i Moët.",
    peRatio: 24.1,
    dividendYield: 1.8,
    week52High: 820.00,
    week52Low: 620.00,
  },
  {
    id: "5",
    ticker: "SAN",
    name: "Banco Santander",
    quantity: 800,
    avgCost: 3.85,
    currentPrice: 4.42,
    currency: "EUR",
    sector: "Finances",
    marketCap: "74B€",
    description: "Banco Santander és un dels principals bancs del món per capitalització borsatil.",
    peRatio: 7.2,
    dividendYield: 5.8,
    week52High: 4.95,
    week52Low: 3.41,
  },
  {
    id: "6",
    ticker: "MSFT",
    name: "Microsoft Corp.",
    quantity: 15,
    avgCost: 295.00,
    currentPrice: 374.80,
    currency: "USD",
    sector: "Tecnologia",
    marketCap: "2.8T$",
    description: "Microsoft és una empresa tecnològica que desenvolupa i ven productes de programari, dispositius i serveis.",
    peRatio: 35.2,
    dividendYield: 0.7,
    week52High: 420.82,
    week52Low: 309.45,
  },
];

function generatePortfolioHistory(): PortfolioHistoryPoint[] {
  const history: PortfolioHistoryPoint[] = [];
  const startValue = 35000;
  const endValue = 42000;
  const days = 30;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const progress = i / (days - 1);
    const trend = startValue + (endValue - startValue) * progress;
    const noise = (Math.random() - 0.4) * 800;
    history.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(trend + noise),
    });
  }
  return history;
}

const portfolioHistory = generatePortfolioHistory();

const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Inditex supera expectatives amb un creixement del 15% en vendes",
    summary: "El gegant tèxtil supera les previsions dels analistes gràcies a la forta demanda a Àsia i Amèrica del Nord. El benefici net ha augmentat un 18%.",
    source: "Expansió",
    url: "#",
    relatedTickers: ["ITX"],
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
  {
    id: "2",
    title: "Iberdrola accelera la seva transformació renovable amb nous projectes eòlics",
    summary: "La utility espanyola anuncia una inversió de 3.000 milions d'euros en nous parcs eòlics marins per als propers tres anys.",
    source: "Cinco Días",
    url: "#",
    relatedTickers: ["IBE"],
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
  {
    id: "3",
    title: "Apple presenta el seu nou xip M4: rendiment sense precedents",
    summary: "El nou processador supera en un 40% el seu predecessor i obre noves possibilitats per a aplicacions d'intel·ligència artificial.",
    source: "El Economista",
    url: "#",
    relatedTickers: ["AAPL"],
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
  {
    id: "4",
    title: "Microsoft creix un 18% gràcies a la IA i el cloud",
    summary: "L'empresa de Redmond publica resultats trimestrals amb creixement superior al 18% en ingressos de cloud, impulsat per la integració de Copilot.",
    source: "Bloomberg",
    url: "#",
    relatedTickers: ["MSFT"],
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
  {
    id: "5",
    title: "LVMH recupera terreny als mercats asiàtics",
    summary: "El conglomerat del luxe francès presenta dades positives de vendes a la Xina i el Japó, revertint la tendència negativa dels darrers trimestres.",
    source: "Les Échos",
    url: "#",
    relatedTickers: ["MC"],
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
  {
    id: "6",
    title: "Santander eleva el dividend un 20% gràcies a beneficis rècord",
    summary: "El banc espanyol reporta el major benefici de la seva història amb 11.076 milions d'euros i anuncia una recompra d'accions.",
    source: "El País Economía",
    url: "#",
    relatedTickers: ["SAN"],
    publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
  {
    id: "7",
    title: "El Banc Central Europeu manté els tipus d'interès",
    summary: "El BCE ha decidit mantenir els tipus de referència al 3,5% a l'espera de confirmar la tendència desinflacionista als països de la zona euro.",
    source: "La Vanguardia",
    url: "#",
    relatedTickers: [],
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
  {
    id: "8",
    title: "L'IBEX 35 tanca la seva millor setmana en dos mesos",
    summary: "L'índex de referència espanyol puja un 2,8% setmanal impulsat pel sector bancari i les utilities renovables.",
    source: "Expansió",
    url: "#",
    relatedTickers: ["SAN", "IBE", "ITX"],
    publishedAt: new Date(Date.now() - 60 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
  {
    id: "9",
    title: "La IA transforma el sector financer: oportunitats per als inversors",
    summary: "Un informe de McKinsey estima que la IA podria generar fins a 340.000 milions de dòlars en productivitat per al sector bancari mundial.",
    source: "Bloomberg",
    url: "#",
    relatedTickers: ["MSFT", "AAPL"],
    publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
  {
    id: "10",
    title: "Perspectiva 2024: oportunitats i riscos per als inversors europeus",
    summary: "El nostre equip d'anàlisi revisa les principals tendències i oportunitats d'inversió per al mercat europeu.",
    source: "Factor OTC",
    url: "#",
    relatedTickers: ["IBE", "SAN", "ITX", "MC"],
    publishedAt: new Date(Date.now() - 96 * 3600000).toISOString(),
    author: "Equip Factor OTC",
  },
];

// Data access functions — swap for real API calls here
export function getPortfolioData(): Position[] {
  return positions;
}

export function getPortfolioHistory(): PortfolioHistoryPoint[] {
  return portfolioHistory;
}

export function getNewsArticles(): NewsArticle[] {
  return newsArticles;
}

export function getPositionByTicker(ticker: string): Position | undefined {
  return positions.find((p) => p.ticker === ticker);
}

export function getTotalPortfolioValue(): number {
  return positions.reduce((total, pos) => total + pos.quantity * pos.currentPrice, 0);
}

export function getTotalCost(): number {
  return positions.reduce((total, pos) => total + pos.quantity * pos.avgCost, 0);
}

export function getTotalReturn(): number {
  return getTotalPortfolioValue() - getTotalCost();
}

export function getTotalReturnPct(): number {
  const cost = getTotalCost();
  return cost > 0 ? ((getTotalPortfolioValue() - cost) / cost) * 100 : 0;
}

export function calculatePnL(position: Position) {
  const cost = position.quantity * position.avgCost;
  const current = position.quantity * position.currentPrice;
  const absolute = current - cost;
  const percent = cost > 0 ? (absolute / cost) * 100 : 0;
  return { absolute, percent, cost, current };
}

export function calculateTotalPortfolio(positions: Position[]) {
  const totalCost = positions.reduce((acc, p) => acc + p.quantity * p.avgCost, 0);
  const totalCurrent = positions.reduce((acc, p) => acc + p.quantity * p.currentPrice, 0);
  const pnlAbsolute = totalCurrent - totalCost;
  const pnlPercent = totalCost > 0 ? (pnlAbsolute / totalCost) * 100 : 0;
  return { totalCurrent, totalCost, pnlAbsolute, pnlPercent };
}
