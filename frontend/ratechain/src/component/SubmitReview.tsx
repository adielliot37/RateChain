import {
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai"; // Import the heart icon

export const SubmitReview = (props: {
  open: () => void;
  selectedRating: number;
  setSelectedRating: (arg1: number) => void;
}) => {
  const { open, setSelectedRating, selectedRating } = props;
  const { onClose } = useDisclosure();

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
  };
  return (
    <Popover isLazy onClose={onClose} returnFocusOnClose={false}>
      <PopoverTrigger>
        <Button>
          Review <Icon marginLeft={2} as={FiEdit2} />
        </Button>
      </PopoverTrigger>
      <PopoverContent width={500}>
        <PopoverHeader fontWeight="semibold">Rate it!</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Stack direction="row" spacing={2} align="center">
            <Text fontSize="xl" fontWeight="semibold" minWidth={50}>
              {selectedRating === null ? "0/10" : `${selectedRating}/10`}
            </Text>
            {Array.from({ length: 10 }, (_, index) => (
              <Icon
                key={index}
                as={AiFillHeart} // Use the heart icon
                color={index < (selectedRating ?? 0) ? "red.500" : "gray.300"} // Set appropriate colors
                boxSize={6}
                cursor="pointer"
                onClick={() => handleRating(index + 1)}
              />
            ))}
            <Button
              marginLeft={2}
              onClick={async () => {
                open();
              }}
            >
              Submit
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
