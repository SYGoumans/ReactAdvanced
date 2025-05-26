import {
  Input,
  Checkbox,
  CheckboxGroup,
  Stack,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";

export const EventFilters = ({ categories, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [futureOnly, setFutureOnly] = useState(true);

  const updateFilters = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateFilters({ searchTerm: value, selectedCategories, futureOnly });
  };

  const handleCategoryChange = (values) => {
    setSelectedCategories(values);
    updateFilters({ searchTerm, selectedCategories: values, futureOnly });
  };

  const handleFutureOnlyChange = (e) => {
    const checked = e.target.checked;
    setFutureOnly(checked);
    updateFilters({ searchTerm, selectedCategories, futureOnly: checked });
  };

  return (
    <Stack spacing={4} color="gray.700" borderRadius="md" mb={2} p={2} w="100%">
      <FormControl>
        <Input
          placeholder="Zoek event"
          border="1px"
          borderColor="customGray.700"
          focusBorderColor="customGreen.700"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="medium">Categorieën</FormLabel>
        <CheckboxGroup
          colorScheme="customGreen"
          value={selectedCategories}
          onChange={handleCategoryChange}
        >
          <Stack spacing={2}>
            {categories.map((cat) => (
              <Checkbox key={cat.id} value={cat.name}>
                {cat.name}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <Switch
          id="future-only-switch"
          isChecked={futureOnly}
          onChange={handleFutureOnlyChange}
          colorScheme="customGreen"
        />
        <FormLabel
          htmlFor="future-only-switch"
          mb="0"
          ml={3}
          fontWeight="normal"
        >
          Alleen events in de toekomst
        </FormLabel>
      </FormControl>
    </Stack>
  );
};
