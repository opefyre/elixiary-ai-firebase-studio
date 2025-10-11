// Google Analytics event tracking
export const GA_MEASUREMENT_ID = 'G-LFT5H05FC7';

// Custom event types
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for common events
export const analytics = {
  // Recipe generation
  recipeGenerated: (prompt: string, recipeName: string) => {
    trackEvent('recipe_generated', 'Recipe', recipeName);
  },

  // Recipe actions
  recipeSaved: (recipeName: string) => {
    trackEvent('recipe_saved', 'Recipe', recipeName);
  },

  recipeDeleted: (recipeName: string) => {
    trackEvent('recipe_deleted', 'Recipe', recipeName);
  },

  recipeShared: (recipeName: string) => {
    trackEvent('recipe_shared', 'Recipe', recipeName);
  },

  recipeCopied: (recipeName: string) => {
    trackEvent('recipe_copied', 'Recipe', recipeName);
  },

  // User actions
  userSignedIn: (method: string) => {
    trackEvent('sign_in', 'Auth', method);
  },

  userSignedUp: (method: string) => {
    trackEvent('sign_up', 'Auth', method);
  },

  userSignedOut: () => {
    trackEvent('sign_out', 'Auth');
  },

  // Random prompt
  randomPromptUsed: (prompt: string) => {
    trackEvent('random_prompt_used', 'Engagement', prompt);
  },

  // Page views (tracked automatically by GA)
  pageView: (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  },
};

