import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategorySelector } from '../CategorySelector';
import { NEWS_CATEGORIES } from '@/constants';

const mockProps = {
  selectedCategories: [],
  onCategoriesChange: vi.fn(),
  localQuery: '',
  onLocalQueryChange: vi.fn(),
};

describe('CategorySelector', () => {
  it('renders all news categories', () => {
    render(<CategorySelector {...mockProps} />);
    
    NEWS_CATEGORIES.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('shows local news input when Local News is selected', () => {
    const props = {
      ...mockProps,
      selectedCategories: ['Local News'],
    };
    
    render(<CategorySelector {...props} />);
    
    expect(screen.getByPlaceholderText('Enter city or ZIP code')).toBeInTheDocument();
  });

  it('calls onCategoriesChange when category is clicked', () => {
    render(<CategorySelector {...mockProps} />);
    
    fireEvent.click(screen.getByText('Technology'));
    
    expect(mockProps.onCategoriesChange).toHaveBeenCalledWith(['Technology']);
  });

  it('displays selected categories as badges', () => {
    const props = {
      ...mockProps,
      selectedCategories: ['Technology', 'Sports'],
    };
    
    render(<CategorySelector {...props} />);
    
    expect(screen.getByText('Selected:')).toBeInTheDocument();
  });
});
