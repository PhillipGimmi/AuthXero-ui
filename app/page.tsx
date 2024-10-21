import { Box, Heading, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h2" size="xl" mb={6}>
        Welcome to AuthXero
      </Heading>
      <Text fontSize="lg" mb={6}>
        Simplify user authentication with our powerful service.
      </Text>
      <Link href="/login">
        <Button colorScheme="teal" size="lg">
          Get Started
        </Button>
      </Link>
    </Box>
  );
}
