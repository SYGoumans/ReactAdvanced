import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Heading,
  Text,
  Image,
  Spinner,
  Button,
  Flex,
  Avatar,
  Stack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { ArrowBackIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import { formatDate, formatTime } from "../utils/utils";

export const EventPage = () => {
  const { id } = useParams();
  const toast = useToast();
  const cancelRef = useRef();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:3000/events/${id}`);
        if (!res.ok) throw new Error("Event niet gevonden");
        const eventData = await res.json();

        let userData = { name: "Onbekend", image: "" };
        if (eventData.createdBy) {
          try {
            const userRes = await fetch(
              `http://localhost:3000/users/${eventData.createdBy}`
            );
            if (userRes.ok) {
              userData = await userRes.json();
            }
          } catch (e) {
            console.warn("Fout bij ophalen gebruiker:", e);
          }
        }

        const categories = await Promise.all(
          eventData.categoryIds.map((catId) =>
            fetch(`http://localhost:3000/categories/${catId}`).then((res) =>
              res.json()
            )
          )
        );

        setEvent({
          ...eventData,
          createdByUser: userData,
          categories,
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Fout bij laden",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = () => {
    if (!event) return;
    setFormData({
      title: event.title || "",
      description: event.description || "",
      startTime: event.startTime?.slice(0, 16) || "",
      endTime: event.endTime?.slice(0, 16) || "",
    });
    setEditMode(true);
  };

  const cancelEditing = () => {
    setEditMode(false);
  };

  const saveChanges = async () => {
    try {
      const updatedEvent = {
        ...event,
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      const res = await fetch(`http://localhost:3000/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });

      if (!res.ok) throw new Error("Opslaan mislukt");
      const data = await res.json();

      setEvent((prev) => ({ ...prev, ...data }));
      setEditMode(false);
      toast({
        title: "Event bijgewerkt",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteEvent = async () => {
    try {
      const res = await fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Verwijderen mislukt");

      toast({
        title: "Event verwijderd",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      window.location.href = "/";
    } catch (err) {
      toast({
        title: "Fout bij verwijderen",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading)
    return (
      <Flex mt={10} justify="center">
        <Spinner size="xl" />
      </Flex>
    );

  if (!event) return <Text>Event niet gevonden.</Text>;

  const formattedStart =
    formatDate(event.startTime) + " - " + formatTime(event.startTime);
  const formattedEnd =
    formatDate(event.endTime) + " - " + formatTime(event.endTime);

  return (
    <Box
      maxW="6xl"
      mx="auto"
      mt={10}
      p={6}
      bg="gray.50"
      border="3px solid"
      borderColor="gray.700"
      borderRadius="md"
    >
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Image
          maxW="300px"
          objectFit="cover"
          border="3px solid"
          borderColor="gray.700"
          borderRadius="md"
          src={event.image || "/images/No_Image_Available.png"}
          fallbackSrc="/images/No_Image_Available.png"
          alt={event.title}
        />

        <Flex direction="column" justify="space-between" flex="1">
          <Box>
            {editMode ? (
              <>
                <FormControl mb={4}>
                  <FormLabel>Titel</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Beschrijving</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Starttijd</FormLabel>
                  <Input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Eindtijd</FormLabel>
                  <Input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </FormControl>
              </>
            ) : (
              <>
                <Heading mb={2}>{event.title}</Heading>
                <Text mb={4}>{event.description}</Text>
                <Stack direction="row" spacing={6} mb={4}>
                  <Text>
                    <strong>Start:</strong> {formattedStart}
                  </Text>
                  <Text>
                    <strong>Einde:</strong> {formattedEnd}
                  </Text>
                </Stack>
                <Text mb={2}>
                  <strong>Categorieën:</strong>{" "}
                  {event.categories.map((c) => c.name).join(", ")}
                </Text>
                <Flex align="center" gap={4} mt={4}>
                  <Avatar
                    size="sm"
                    src={event.createdByUser?.image}
                    name={event.createdByUser?.name}
                  />
                  <Text>
                    Gemaakt door{" "}
                    <strong>{event.createdByUser?.name || "Onbekend"}</strong>
                  </Text>
                </Flex>
              </>
            )}
          </Box>

          <Flex mt={6} gap={4} flexWrap="wrap">
            {editMode ? (
              <>
                <Button
                  size="sm"
                  color="white"
                  bg="green.500"
                  _hover={{ bg: "green.800" }}
                  colorScheme="green"
                  onClick={saveChanges}
                >
                  Opslaan
                </Button>
                <Button
                  size="sm"
                  color="white"
                  bg="red.500"
                  _hover={{ bg: "red.800" }}
                  colorScheme="red"
                  onClick={cancelEditing}
                >
                  Annuleren
                </Button>
              </>
            ) : (
              <>
                <Button
                  as="a"
                  href="/"
                  leftIcon={<ArrowBackIcon />}
                  size="sm"
                  color="white"
                  bg="gray.500"
                  _hover={{ bg: "gray.800" }}
                >
                  Terug
                </Button>
                <Button
                  leftIcon={<EditIcon />}
                  size="sm"
                  color="white"
                  bg="gray.500"
                  _hover={{ bg: "gray.800" }}
                  onClick={startEditing}
                >
                  Bewerken
                </Button>
                <Button
                  leftIcon={<DeleteIcon />}
                  size="sm"
                  color="white"
                  bg="red.500"
                  _hover={{ bg: "red.800" }}
                  onClick={() => setIsDeleteOpen(true)}
                >
                  Verwijderen
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Event verwijderen</AlertDialogHeader>
            <AlertDialogBody>
              Weet je zeker dat je dit event wilt verwijderen? Dit kan niet
              ongedaan worden.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                size="sm"
                color="white"
                bg="gray.500"
                _hover={{ bg: "gray.800" }}
                ref={cancelRef}
                onClick={() => setIsDeleteOpen(false)}
              >
                Annuleren
              </Button>
              <Button
                size="sm"
                color="white"
                bg="red.500"
                _hover={{ bg: "red.800" }}
                colorScheme="red"
                ml={3}
                onClick={deleteEvent}
              >
                Verwijderen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
