import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  localQuery: string;
  onLocalQueryChange: (value: string) => void;
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

export const CategorySelector = ({ selectedCategories, onCategoriesChange, localQuery, onLocalQueryChange }: CategorySelectorProps) => {
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
      {selectedCategories.includes("Local News") && (
        <div className="space-y-2">
          <Label htmlFor="local-query">City or ZIP Code</Label>
          <Input
            id="local-query"
            value={localQuery}
            onChange={(e) => onLocalQueryChange(e.target.value)}
            placeholder="Enter city or ZIP code"
          />
        </div>
      )}

      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected categories:</p>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary">
                {category === "Local News" && localQuery ? `${category} - ${localQuery}` : category}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};