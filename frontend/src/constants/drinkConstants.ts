export interface IngredientOption {
  item: string;
  defaultAmount: string;
}

export const BASE_LIQUORS = ['Gin', 'Vodka', 'Rum', 'Tequila', 'Whiskey', 'Other'];
export const GLASS_TYPES = ['Coupe', 'Highball', 'Martini', 'Old-Fashioned', 'Collins'];
export const ICE_TYPES = ['None', 'Cubed', 'Crushed', 'Large Cube', 'Large Sphere'];
export const MIXING_METHODS = ['Shake', 'Stir', 'Build'];

export const COMMON_INGREDIENTS: Record<string, IngredientOption[]> = {
  Spirits: [
    { item: 'Gin', defaultAmount: '2 oz' },
    { item: 'Vodka', defaultAmount: '2 oz' },
    { item: 'Rum', defaultAmount: '2 oz' },
    { item: 'Tequila', defaultAmount: '2 oz' },
    { item: 'Whiskey', defaultAmount: '2 oz' },
    { item: 'Bourbon', defaultAmount: '2 oz' },
  ],
  Liqueurs: [
    { item: 'Campari', defaultAmount: '1 oz' },
    { item: 'Sweet Vermouth', defaultAmount: '1 oz' },
    { item: 'Dry Vermouth', defaultAmount: '0.5 oz' },
    { item: 'Triple Sec', defaultAmount: '0.75 oz' },
    { item: 'Coffee Liqueur', defaultAmount: '1 oz' },
  ],
  Mixers: [
    { item: 'Lime Juice', defaultAmount: '0.75 oz' },
    { item: 'Lemon Juice', defaultAmount: '0.75 oz' },
    { item: 'Simple Syrup', defaultAmount: '0.5 oz' },
    { item: 'Tonic Water', defaultAmount: '4 oz' },
    { item: 'Sparkling Water', defaultAmount: '2 oz' },
    { item: 'Club Soda', defaultAmount: '2 oz' },
    { item: 'Cola', defaultAmount: '2 oz' },
    { item: 'Ginger Ale', defaultAmount: '2 oz' },
  ],
  Garnish: [
    { item: 'Orange Peel', defaultAmount: '1 piece' },
    { item: 'Lime Wheel', defaultAmount: '1 piece' },
    { item: 'Lemon Twist', defaultAmount: '1 piece' },
    { item: 'Mint Sprig', defaultAmount: '1 piece' },
    { item: 'Cherry', defaultAmount: '1 piece' },
  ],
}; 