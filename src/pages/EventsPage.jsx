import { useEffect, useState } from "react";
import {
  Heading,
  Box,
  List,
  Flex,
  Spinner,
  Card,
  Image,
  CardBody,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { EventFilters } from "../components/EventFilters";
import { formatDate, formatTime } from "../utils/utils";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedCategories: [],
    futureOnly: true,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/data/events.json");
        const json = await response.json();
        setEvents(json.events);
        setCategories(json.categories);
      } catch (error) {
        console.error("Fout bij ophalen van events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const searchTermMatch =
      event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

    const categoryMatch =
      filters.selectedCategories.length === 0 ||
      filters.selectedCategories.some(
        (cat) =>
          event.categories?.includes(cat) ||
          event.categoryIds?.some((id) => {
            return categories.find((c) => c.id === id)?.name === cat;
          })
      );

    const now = new Date();
    const eventStartDate = new Date(event.startTime);
    const futureMatch = filters.futureOnly ? eventStartDate > now : true;

    return searchTermMatch && categoryMatch && futureMatch;
  });

  const getCategoryNames = (categoryIds) => {
    return categoryIds
      .map((id) => categories.find((cat) => cat.id === id))
      .filter(Boolean)
      .map((cat) => cat.name);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Box p={4} w="90%" mx="auto">
      <Flex
        gap={6}
        align="flex-start"
        direction={{ base: "column", md: "row" }}
      >
        <Box
          minW="200px"
          maxW={{ base: "100%", md: "200px" }}
          w={{ base: "100%", md: "25%" }}
          position={{ base: "static", md: "sticky" }}
          top="20px"
          bg="gray.50"
          maxHeight={{ base: "none", md: "80vh" }}
          overflowY="auto"
          borderRadius="md"
          border="2px solid"
          borderColor="gray.700"
          p={4}
        >
          <EventFilters
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
          />
        </Box>
        <Box>
          {loading ? (
            <Flex mt={10} ml={250}>
              <Spinner
                size="xl"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="gray.800"
              />
            </Flex>
          ) : filteredEvents.length === 0 ? (
            <Box p={4} w="90%" mx="auto">
              <Flex gap={6} align="flex-start" justify="center">
                <Box
                  flex="0 0 100%"
                  position="sticky"
                  top="20px"
                  bg="gray.100"
                  maxHeight="80vh"
                  overflowY="auto"
                  borderRadius="md"
                  border="2px solid"
                  borderColor="gray.700"
                  textAlign="center"
                  p={4}
                >
                  <Text fontSize="lg" color="gray.700">
                    Er zijn op dit moment geen evenementen die aan je wensen
                    voldoen.
                  </Text>
                </Box>
              </Flex>
            </Box>
          ) : (
            <List spacing={4}>
              {filteredEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.id}`}>
                  <Card
                    direction="row"
                    overflow="hidden"
                    variant="elevated"
                    m={3}
                    border="2px solid"
                    borderColor="gray.700"
                  >
                    <Flex w="100%">
                      <Box
                        w={{ base: "100%", sm: "200px" }}
                        flexShrink={0}
                        position="relative"
                      >
                        <Image
                          objectFit="cover"
                          w="100%"
                          h="100%"
                          maxH="100%"
                          src={event.image || "/images/No_Image_Available.png"}
                          fallbackSrc={"/images/No_Image_Available.png"}
                          alt={event.title}
                        />
                      </Box>

                      <Flex flex="1" direction="column">
                        <CardBody
                          display="flex"
                          flexDirection="column"
                          justifyContent="space-between"
                        >
                          <Flex align="center" wrap="wrap" gap={2}>
                            <Heading size="xl" mb={0} mr={2}>
                              {event.title}
                            </Heading>
                            <Flex gap={2} wrap="wrap">
                              {getCategoryNames(event.categoryIds).map(
                                (name, index) => (
                                  <Box
                                    key={index}
                                    bg="gray.700"
                                    color="white"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                    fontSize="sm"
                                  >
                                    {name}
                                  </Box>
                                )
                              )}
                            </Flex>
                          </Flex>

                          <Text py="2">
                            {event.description.length > 120
                              ? `${event.description.slice(0, 120)}...`
                              : event.description}
                          </Text>

                          <Text fontSize="sm" color="gray.700">
                            {formatDate(event.startTime)};{" "}
                            {formatTime(event.startTime)} –{" "}
                            {formatDate(event.endTime)};{" "}
                            {formatTime(event.endTime)}
                          </Text>
                        </CardBody>
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              ))}
            </List>
          )}
          ;
        </Box>
      </Flex>
    </Box>
  );
};
