/**
 * Server-side gradient image generation for cocktails
 * This creates a beautiful gradient image for a cocktail based on its characteristics
 */

import { createCanvas } from 'canvas';

export interface CocktailVisualData {
  name: string;
  ingredients: string;
  glassware: string;
  difficultyLevel: string;
}

// Color mapping based on common cocktail ingredients
const ingredientColors: Record<string, string[]> = {
  // Spirits
  gin: ['#E8F4F8', '#B8D4E0'],
  vodka: ['#F0F4F8', '#D0DCE8'],
  rum: ['#F5E6D3', '#D4B896'],
  tequila: ['#FFF9E6', '#F4E4C1'],
  whiskey: ['#D4A574', '#8B6F47'],
  bourbon: ['#C17817', '#8B5A00'],
  scotch: ['#D4A574', '#A67C52'],
  
  // Citrus
  lemon: ['#FFF9C4', '#F9E79F'],
  lime: ['#D4EDDA', '#A8D5BA'],
  orange: ['#FFE5B4', '#FFD580'],
  grapefruit: ['#FFB6C1', '#FF9AA2'],
  
  // Berries & Fruits
  strawberry: ['#FFB3BA', '#FF8A95'],
  raspberry: ['#E85D75', '#C44569'],
  blueberry: ['#9FA8DA', '#7986CB'],
  blackberry: ['#4A148C', '#6A1B9A'],
  cherry: ['#D32F2F', '#C62828'],
  peach: ['#FFCC80', '#FFB74D'],
  pineapple: ['#FFF176', '#FFE57F'],
  mango: ['#FFB300', '#FF8F00'],
  
  // Herbs & Botanicals
  mint: ['#A8E6CF', '#7FB3A1'],
  basil: ['#9CCC65', '#7CB342'],
  rosemary: ['#AED581', '#9CCC65'],
  
  // Other
  coffee: ['#5D4037', '#3E2723'],
  chocolate: ['#6D4C41', '#4E342E'],
  vanilla: ['#FFF8DC', '#F5DEB3'],
  coconut: ['#FFFFFF', '#F0F0F0'],
  cranberry: ['#C62828', '#B71C1C'],
};

export function generateCocktailGradientServer(cocktail: CocktailVisualData): string {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  // Determine color scheme based on ingredients
  const ingredientsLower = cocktail.ingredients.toLowerCase();
  let colors = ['#8b5cf6', '#6366f1']; // Default purple gradient
  
  // Find matching ingredient colors
  for (const [ingredient, colorPair] of Object.entries(ingredientColors)) {
    if (ingredientsLower.includes(ingredient)) {
      colors = colorPair;
      break;
    }
  }

  // Create gradient based on difficulty
  const gradient = ctx.createLinearGradient(0, 0, 800, 600);
  
  if (cocktail.difficultyLevel === 'Easy') {
    // Simple, clean gradient
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
  } else if (cocktail.difficultyLevel === 'Hard') {
    // Complex, multi-color gradient
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, darkenColor(colors[1], 20));
  } else {
    // Medium complexity
    gradient.addColorStop(0, lightenColor(colors[0], 10));
    gradient.addColorStop(1, colors[1]);
  }

  // Fill background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);

  // Add subtle pattern overlay
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * 800,
      Math.random() * 600,
      Math.random() * 100 + 50,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Add glass silhouette in center
  ctx.globalAlpha = 0.3;
  drawGlassSilhouette(ctx, cocktail.glassware);
  ctx.globalAlpha = 1;

  // Add recipe name with elegant typography and better contrast
  const nameLines = wrapText(ctx, cocktail.name, 700);
  
  // Add subtle background behind text for better contrast
  if (nameLines.length > 0) {
    const textHeight = nameLines.length * 60;
    const padding = 20;
    const bgY = 280 - 40 - padding;
    const bgHeight = textHeight + (padding * 2);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(50, bgY, 700, bgHeight);
  }
  
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.font = 'bold 48px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 3;
  
  nameLines.forEach((line, idx) => {
    ctx.fillText(line, 400, 280 + (idx * 60));
  });

  ctx.shadowColor = 'transparent';

  // Convert to data URL
  return canvas.toDataURL('image/png');
}

// Helper functions
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function drawGlassSilhouette(ctx: CanvasRenderingContext2D, glassType: string) {
  ctx.fillStyle = 'white';
  const centerX = 400;
  const centerY = 300;
  
  // Simple glass shape based on type
  if (glassType.toLowerCase().includes('martini') || glassType.toLowerCase().includes('coupe')) {
    // V-shaped glass
    ctx.beginPath();
    ctx.moveTo(centerX - 80, centerY + 100);
    ctx.lineTo(centerX, centerY - 60);
    ctx.lineTo(centerX + 80, centerY + 100);
    ctx.closePath();
    ctx.fill();
  } else if (glassType.toLowerCase().includes('highball') || glassType.toLowerCase().includes('collins')) {
    // Tall glass
    ctx.fillRect(centerX - 50, centerY - 80, 100, 180);
  } else if (glassType.toLowerCase().includes('rock') || glassType.toLowerCase().includes('old fashioned')) {
    // Short, wide glass
    ctx.fillRect(centerX - 60, centerY - 40, 120, 100);
  } else {
    // Default wine glass shape
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 20, 60, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(centerX - 5, centerY + 50, 10, 60);
    ctx.fillRect(centerX - 30, centerY + 110, 60, 5);
  }
}
