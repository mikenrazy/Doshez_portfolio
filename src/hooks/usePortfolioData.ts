import { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';
import type { PortfolioContent } from '../types/admin';

export const usePortfolioData = () => {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const portfolioContent = await portfolioService.getContent();
      
      // Transform array to object for easier access
      const contentMap = portfolioContent.reduce((acc, item) => {
        if (!acc[item.section]) {
          acc[item.section] = {};
        }
        acc[item.section][item.content_key] = item.content_value;
        return acc;
      }, {} as Record<string, any>);

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading portfolio content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContent = (section: string, key: string, defaultValue: any = null) => {
    return content[section]?.[key] || defaultValue;
  };

  return {
    content,
    loading,
    getContent,
    refreshContent: loadContent
  };
};