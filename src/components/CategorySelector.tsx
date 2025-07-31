import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const categories = [
  "Technology",
  "Business",
  "Politics",
  "Sports",
  "Entertainment",
  "Health",
  "Science",
  "World News",
  "Local News",
  "Weather"
];

export const CategorySelector = ({ selectedCategories, onCategoriesChange }: CategorySelectorProps) => {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select the news categories you're interested in:
      </p>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleCategory(category)}
            className="transition-all duration-200"
          >
            {category}
          </Button>
        ))}
      </div>
      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected categories:</p>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};