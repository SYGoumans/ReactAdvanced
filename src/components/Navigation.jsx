import { Link } from "react-router-dom";
import { Button, Flex, Box, HStack, Text } from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";

export const Navigation = () => {
  return (
    <Box bg="gray.800" color="white" px={4} py={3}>
      <Flex justify="space-between" align="center">
        <Box>
          <Link to="/">
            <Text fontSize="xl" as="b">
              PARTY AGENDA
            </Text>
          </Link>
        </Box>

        <HStack spacing={4}>
          <Link to="/">
            <Button
              leftIcon={<ArrowBackIcon />}
              size="sm"
              color="white"
              bg="gray.600"
              _hover={{ bg: "gray.500" }}
            >
              Terug naar overzicht
            </Button>
          </Link>
          <Link to="/new">
            <Button
              leftIcon={<AddIcon />}
              size="sm"
              color="white"
              bg="gray.600"
              _hover={{ bg: "gray.500" }}
            >
              Nieuw Event
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};
