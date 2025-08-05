"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/sbClient";
import { Search, Filter, X, ChevronDown, Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { debounce } from "lodash";

interface FilterOptions {
  price_range: {
    min: number;
    max: number;
    min_text: string;
    max_text: string;
  };
  categories: Array<{
    name: string;
    count: number;
    display: string;
  }>;
  sort_options: Array<{
    value: string;
    label: string;
  }>;
}

interface SearchSuggestion {
  title: string;
  type: string;
  image?: string;
  price?: string;
}

interface ProductSearchFilterProps {
  onSearch: (filters: any) => void;
  loading?: boolean;
}

export const ProductSearchFilter = ({ onSearch, loading = false }: ProductSearchFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("stock") !== "false"
  );

  const supabase = createClient();

  // Debounced search suggestions
  const debouncedGetSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const { data } = await supabase.rpc("get_search_suggestions", {
          query_text: query,
          limit_count: 6
        });
        
        if (data?.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 300),
    [supabase]
  );

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const { data } = await supabase.rpc("get_filter_options");
        if (data) {
          setFilterOptions(data);
          // Set initial price range from data
          if (data.price_range) {
            setPriceRange([data.price_range.min || 0, data.price_range.max || 1000]);
          }
        }
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    };

    loadFilterOptions();
  }, [supabase]);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedGetSuggestions(value);
    setShowSuggestions(true);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    performSearch(suggestion.title);
  };

  // Update URL with current filters
  const updateURL = useCallback((filters: any) => {
    const params = new URLSearchParams();
    
    if (filters.q) params.set("q", filters.q);
    if (filters.categories?.length) params.set("categories", filters.categories.join(","));
    if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
    if (filters.min_price > 0) params.set("min_price", filters.min_price.toString());
    if (filters.max_price < 1000) params.set("max_price", filters.max_price.toString());
    if (filters.min_rating > 0) params.set("min_rating", filters.min_rating.toString());
    if (!filters.in_stock_only) params.set("stock", "false");

    const newUrl = params.toString() ? `/magaza?${params.toString()}` : "/magaza";
    router.push(newUrl, { scroll: false });
  }, [router]);

  // Perform search with current filters
  const performSearch = useCallback((query?: string) => {
    const filters = {
      search_query: query || searchQuery || undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < (filterOptions?.price_range?.max || 1000) ? priceRange[1] : undefined,
      min_rating: minRating > 0 ? minRating : undefined,
      sort_by: sortBy,
      in_stock_only: inStockOnly,
      page_limit: 20,
      page_offset: 0
    };

    onSearch(filters);
    updateURL({
      q: query || searchQuery,
      categories: selectedCategories,
      sort: sortBy,
      min_price: priceRange[0],
      max_price: priceRange[1],
      min_rating: minRating,
      in_stock_only: inStockOnly
    });
  }, [searchQuery, selectedCategories, priceRange, minRating, sortBy, inStockOnly, onSearch, updateURL, filterOptions]);

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, filterOptions?.price_range?.max || 1000]);
    setMinRating(0);
    setSortBy("newest");
    setInStockOnly(true);
    onSearch({});
    router.push("/magaza");
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategories.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < (filterOptions?.price_range?.max || 1000)) count++;
    if (minRating > 0) count++;
    if (!inStockOnly) count++;
    return count;
  }, [searchQuery, selectedCategories, priceRange, minRating, inStockOnly, filterOptions]);

  return (
    <div className="w-full space-y-4 bg-white border rounded-lg p-4 shadow-sm">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setShowSuggestions(false);
                performSearch();
              }
            }}
            className="pl-10 pr-4"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 border-b last:border-b-0"
              >
                {suggestion.image && (
                  <img 
                    src={suggestion.image} 
                    alt="" 
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium">{suggestion.title}</div>
                  {suggestion.price && (
                    <div className="text-xs text-muted-foreground">{suggestion.price}</div>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {suggestion.type === 'product' ? 'Ürün' : 'Kategori'}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sıralama" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions?.sort_options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filters Toggle */}
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtreler
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtreler</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Temizle
                </Button>
              </div>

              {/* Categories */}
              {filterOptions?.categories && filterOptions.categories.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
                    Kategoriler
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {filterOptions.categories.slice(0, 8).map((category) => (
                        <div key={category.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.name}
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={() => toggleCategory(category.name)}
                          />
                          <label
                            htmlFor={category.name}
                            className="text-xs cursor-pointer flex-1"
                          >
                            {category.display}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Price Range */}
              {filterOptions?.price_range && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Fiyat Aralığı: {priceRange[0]} ₺ - {priceRange[1]} ₺
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={filterOptions.price_range.max}
                    min={filterOptions.price_range.min}
                    step={10}
                    className="w-full"
                  />
                </div>
              )}

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Minimum Puan: {minRating > 0 ? `${minRating} yıldız` : 'Tümü'}
                </label>
                <Slider
                  value={[minRating]}
                  onValueChange={(value) => setMinRating(value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Stock Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stock"
                  checked={inStockOnly}
                  onCheckedChange={setInStockOnly}
                />
                <label htmlFor="stock" className="text-sm cursor-pointer">
                  Sadece stokta olanlar
                </label>
              </div>

              <Button onClick={performSearch} className="w-full">
                Filtreleri Uygula
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button onClick={() => performSearch()}>
          <Search className="h-4 w-4 mr-2" />
          Ara
        </Button>
      </div>

      {/* Active Filters Display */}
      {(selectedCategories.length > 0 || searchQuery || minRating > 0 || !inStockOnly) && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Arama: "{searchQuery}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSearchQuery("");
                  performSearch("");
                }}
              />
            </Badge>
          )}
          
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleCategory(category)}
              />
            </Badge>
          ))}

          {minRating > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {minRating}+ yıldız
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setMinRating(0)}
              />
            </Badge>
          )}

          {!inStockOnly && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tüm ürünler
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setInStockOnly(true)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};