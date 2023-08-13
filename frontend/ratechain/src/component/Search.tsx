import dynamic from "next/dynamic";

// --- Chakra-UI ---
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

// --- Motion Components ---
const MotionBox = dynamic(() => import("./MotionBox"));

// --- Form and Validations ---
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// --- Icons ---
import {AiOutlineFileSearch } from "react-icons/ai";
import { GiStabbedNote} from "react-icons/gi";

// --- Validation Schema and Type ---
const validationSchema = Yup.object().shape({
  address: Yup.string()
    .min(42, "Invalid address")
    .max(42, "Invalid address")
    .required("address is required!"),
});

type FormType = Yup.InferType<typeof validationSchema>;

// --- Component Props Interface ---
interface ISearchProps {
  handleSearchAddress: (address?: string) => void;
}

export default function Search({
  handleSearchAddress,
}: ISearchProps): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema), mode: "onTouched" });

  const onSubmit = ({ address }: FormType) =>
    new Promise(() => setTimeout(() => handleSearchAddress(address), 500));

  return (
    <MotionBox w="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack spacing="4" w="full" alignItems="flex-start" py="2">
          <FormControl isInvalid={!!errors.address}>
            <InputGroup size="lg" variant="outline" borderColor="gray.600">
              <InputLeftElement
                pointerEvents="none"
                children={<GiStabbedNote size="1.5rem" color="white" />}
              />
              <Input
                {...register("address")}
                type="text"
                placeholder="Enter any Contract Address"
                color="blue"
                bg="black"
                borderColor="gray.600"
                borderRadius="xl"
                focusBorderColor="blue.500"
                _placeholder={{ color: "gray.400" }}
                _hover={{ borderColor: "blue.300" }}
              />
            </InputGroup>
            {!errors.address ? (
              <FormHelperText>
               
              </FormHelperText>
            ) : (
              <FormErrorMessage>
                {errors.address?.message as string}
              </FormErrorMessage>
            )}
          </FormControl>

          <IconButton
            icon={<AiOutlineFileSearch />}
            type="submit"
            aria-label="Search"
            isLoading={isSubmitting}
            size="lg"
            borderRadius="xl"
            colorScheme="blue"
          />
        </HStack>
      </form>
    </MotionBox>
  );
}
