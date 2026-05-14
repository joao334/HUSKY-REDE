export type LoyaltyLevel = {
  name: string;
  min: number;
  max: number | null;
  benefit: string;
  tone: string;
};

export const loyaltyLevels: LoyaltyLevel[] = [
  {
    name: 'Filhote Husky',
    min: 0,
    max: 49,
    benefit: 'Boas-vindas, cupons de primeira compra e carinho da cozinha.',
    tone: 'bg-husky-beige text-husky-brown',
  },
  {
    name: 'Husky Curioso',
    min: 50,
    max: 149,
    benefit: 'Achadinhos antecipados e bônus em avaliações.',
    tone: 'bg-husky-sky text-white',
  },
  {
    name: 'Husky Fiel',
    min: 150,
    max: 299,
    benefit: 'Combos secretos e cupons especiais da semana.',
    tone: 'bg-husky-blue text-white',
  },
  {
    name: 'Lobo da Matilha',
    min: 300,
    max: 599,
    benefit: 'Brindes selecionados e acesso antecipado a sabores.',
    tone: 'bg-husky-brown text-white',
  },
  {
    name: 'Husky Supremo',
    min: 600,
    max: null,
    benefit: 'Benefícios VIP, lançamentos e surpresas da Husky.',
    tone: 'bg-husky-cocoa text-white',
  },
];

export function getLoyaltyLevel(points: number) {
  return (
    loyaltyLevels.find((level) => points >= level.min && (level.max === null || points <= level.max)) ??
    loyaltyLevels[0]
  );
}

export function getNextLoyaltyLevel(points: number) {
  return loyaltyLevels.find((level) => level.min > points) ?? null;
}

export function getLoyaltyProgress(points: number) {
  const current = getLoyaltyLevel(points);
  const next = getNextLoyaltyLevel(points);

  if (!next) return 100;
  const range = next.min - current.min;
  const progress = ((points - current.min) / range) * 100;
  return Math.max(0, Math.min(100, progress));
}
