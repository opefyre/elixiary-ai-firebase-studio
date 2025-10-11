import jsPDF from 'jspdf';

export interface RecipeData {
  name: string;
  description: string;
  ingredients: string;
  instructions: string;
  garnish: string;
  glassware: string;
  difficultyLevel: string;
  servingSize: string;
  tips: string;
}

export function exportRecipeToPDF(recipe: RecipeData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Color palette
  const colors = {
    primary: '#8b5cf6', // Purple
    secondary: '#06b6d4', // Cyan
    dark: '#1a1a1a',
    medium: '#4a4a4a',
    light: '#6a6a6a',
    accent: '#f59e0b', // Amber
    success: '#10b981', // Green
  };

  // Helper function to remove emojis and special characters
  const cleanText = (text: string): string => {
    return text
      .replace(/[\u{1F000}-\u{1FFFF}]/gu, '') // Remove emojis
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
      .trim();
  };

  // Helper to add wrapped text
  const addText = (text: string, fontSize: number, isBold: boolean = false, color: string = colors.dark) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color);
    
    const sanitizedText = cleanText(text);
    const lines = doc.splitTextToSize(sanitizedText, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin - 20) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += fontSize * 0.2;
  };

  // Helper to add colored badge
  const addBadge = (text: string, x: number, color: string) => {
    doc.setFillColor(color);
    const textWidth = doc.getTextWidth(text);
    const badgeWidth = textWidth + 8;
    const badgeHeight = 6;
    
    // Rounded rectangle for badge
    doc.roundedRect(x, yPosition - 4, badgeWidth, badgeHeight, 2, 2, 'F');
    
    // Badge text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(text, x + 4, yPosition);
    
    return badgeWidth;
  };

  // Helper to add section with colored header
  const addSection = (title: string, iconText: string, headerColor: string) => {
    yPosition += 5;
    
    // Colored background bar
    doc.setFillColor(headerColor);
    doc.rect(margin - 5, yPosition - 6, contentWidth + 10, 10, 'F');
    
    // White text on colored background
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${iconText} ${title.toUpperCase()}`, margin, yPosition);
    
    yPosition += 8;
  };

  // ========== HEADER SECTION ==========
  
  // Top decorative bar
  doc.setFillColor(colors.primary);
  doc.rect(0, 0, pageWidth, 8, 'F');

  yPosition = 18;

  // Recipe name with centered styling
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  const cleanTitle = cleanText(recipe.name);
  doc.text(cleanTitle, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Description
  if (recipe.description) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.medium);
    const descLines = doc.splitTextToSize(cleanText(recipe.description), contentWidth - 20);
    descLines.forEach((line: string) => {
      doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 5;
    });
  }

  yPosition += 5;

  // Metadata badges
  let badgeX = margin + 10;
  
  // Difficulty badge with color coding
  let difficultyColor = colors.success;
  if (recipe.difficultyLevel === 'Medium') difficultyColor = colors.accent;
  if (recipe.difficultyLevel === 'Hard') difficultyColor = '#ef4444'; // Red
  
  badgeX += addBadge(recipe.difficultyLevel, badgeX, difficultyColor) + 5;
  badgeX += addBadge(recipe.glassware, badgeX, colors.secondary) + 5;
  addBadge(recipe.servingSize, badgeX, colors.light);
  
  yPosition += 8;

  // Main content divider
  doc.setDrawColor(colors.primary);
  doc.setLineWidth(1.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 2;

  // ========== INGREDIENTS SECTION ==========
  addSection('Ingredients', '>', colors.primary);
  
  // Ingredients in a light box
  const ingredientsList = recipe.ingredients.split('\n').filter(Boolean);
  const ingredientsStartY = yPosition;
  
  ingredientsList.forEach(ingredient => {
    const cleaned = cleanText(ingredient.trim());
    if (cleaned) {
      // Bullet point
      doc.setFillColor(colors.primary);
      doc.circle(margin + 2, yPosition - 1.5, 1, 'F');
      
      // Ingredient text
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.dark);
      const lines = doc.splitTextToSize(cleaned.replace(/^[-•]\s*/, ''), contentWidth - 10);
      lines.forEach((line: string, idx: number) => {
        doc.text(line, margin + 8, yPosition);
        if (idx < lines.length - 1) yPosition += 4;
      });
      yPosition += 5;
    }
  });

  // ========== INSTRUCTIONS SECTION ==========
  addSection('Instructions', '#', colors.secondary);
  
  const instructionsList = recipe.instructions.split('\n').filter(Boolean);
  instructionsList.forEach((instruction, index) => {
    const cleaned = cleanText(instruction.trim());
    if (cleaned) {
      // Check for page break
      if (yPosition > pageHeight - margin - 25) {
        doc.addPage();
        yPosition = margin + 10;
      }
      
      // Step number in colored circle
      doc.setFillColor(colors.secondary);
      doc.circle(margin + 3, yPosition - 1.5, 3, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(String(index + 1), margin + 3, yPosition, { align: 'center' });
      
      // Step text
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.dark);
      const withoutNumber = cleaned.replace(/^\d+\.\s*/, '');
      const lines = doc.splitTextToSize(withoutNumber, contentWidth - 15);
      lines.forEach((line: string, idx: number) => {
        doc.text(line, margin + 10, yPosition);
        if (idx < lines.length - 1) yPosition += 4;
      });
      yPosition += 6;
    }
  });

  // ========== GARNISH SECTION ==========
  if (recipe.garnish && recipe.garnish.trim()) {
    addSection('Garnish', '*', colors.success);
    
    const garnishList = recipe.garnish.split('\n').filter(Boolean);
    garnishList.forEach(garnish => {
      const cleaned = cleanText(garnish.trim());
      if (cleaned) {
        doc.setFillColor(colors.success);
        doc.circle(margin + 2, yPosition - 1.5, 1, 'F');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.dark);
        doc.text(cleaned.replace(/^[-•]\s*/, ''), margin + 8, yPosition);
        yPosition += 5;
      }
    });
  }

  // ========== PRO TIPS SECTION ==========
  if (recipe.tips && recipe.tips.trim()) {
    addSection('Pro Tips', '!', colors.accent);
    
    // Light amber background box for tips
    const tipsStartY = yPosition;
    const tipsList = recipe.tips.split('\n').filter(Boolean);
    
    tipsList.forEach(tip => {
      const cleaned = cleanText(tip.trim());
      if (cleaned) {
        // Check for page break
        if (yPosition > pageHeight - margin - 25) {
          doc.addPage();
          yPosition = margin + 10;
        }
        
        doc.setFillColor(colors.accent);
        doc.circle(margin + 2, yPosition - 1.5, 1, 'F');
        
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.dark);
        const lines = doc.splitTextToSize(cleaned.replace(/^[-•]\s*/, ''), contentWidth - 10);
        lines.forEach((line: string, idx: number) => {
          doc.text(line, margin + 8, yPosition);
          if (idx < lines.length - 1) yPosition += 4;
        });
        yPosition += 5.5;
      }
    });
  }

  // ========== FOOTER ==========
  
  // Move to bottom of page
  yPosition = pageHeight - 20;
  
  // Decorative gradient effect (simulated with multiple lines)
  for (let i = 0; i < 3; i++) {
    const alpha = 100 - (i * 30);
    doc.setDrawColor(139, 92, 246, alpha);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + i * 0.5, pageWidth - margin, yPosition + i * 0.5);
  }
  
  yPosition += 5;
  
  // Footer text
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('ELIXIARY AI', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 4;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(colors.light);
  doc.text('Your AI-Powered Mixology Assistant', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 3;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.light);
  doc.text('ai.elixiary.com', pageWidth / 2, yPosition, { align: 'center' });

  // Save the PDF
  const fileName = `${cleanText(recipe.name).replace(/\s+/g, '_').toLowerCase()}.pdf`;
  doc.save(fileName);
}
