import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  CheckboxGroup,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const NewEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });

  const categories = [
    { id: 1, name: "sports" },
    { id: 2, name: "games" },
    { id: 3, name: "relaxation" },
  ];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selected) => {
    setFormData((prev) => ({ ...prev, categoryIds: selected.map(Number) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Mislukt om event toe te voegen");
      }

      const data = await response.json();
      console.log("Event succesvol toegevoegd:", data);

      navigate("/");
    } catch (error) {
      console.error("Fout bij toevoegen event:", error);
    }
  };

  const inputStyles = {
    border: "1px",
    borderColor: "customGray",
    focusBorderColor: "Gray.700",
    bg: "white",
    color: "Gray.700",
  };

  return (
    <Box
      position="relative"
      maxW="750px"
      mx="auto"
      p={6}
      mt={12}
      bg="whiteAlpha.400"
    >
      <Heading mb={6} color="customGray.700">
        Nieuw Event Aanmaken
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Titel</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              {...inputStyles}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Beschrijving</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              {...inputStyles}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Afbeelding URL</FormLabel>
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              {...inputStyles}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Locatie</FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              {...inputStyles}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Starttijd</FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              {...inputStyles}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Eindtijd</FormLabel>
            <Input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              {...inputStyles}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Categorieën</FormLabel>
            <CheckboxGroup
              value={formData.categoryIds.map(String)}
              onChange={handleCategoryChange}
            >
              <Stack
                spacing={[1, 3]}
                direction="row"
                {...inputStyles}
                p={2}
                borderRadius="md"
              >
                {categories.map((cat) => (
                  <Checkbox
                    key={cat.id}
                    value={String(cat.id)}
                    colorScheme="customGreen"
                  >
                    {cat.name}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>

          <Button colorScheme="customGreen" type="submit">
            Maak event aan
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
