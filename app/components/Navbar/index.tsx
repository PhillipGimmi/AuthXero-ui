'use client';

import { Box, Flex, Link, Button } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Navbar() {
  return (
    <Box bg="teal.500" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <NextLink href="/" passHref>
          <Link color="white" fontWeight="bold">AuthXero</Link>
        </NextLink>
        <NextLink href="/login" passHref>
          <Button colorScheme="teal" variant="outline">
            Login
          </Button>
        </NextLink>
      </Flex>
    </Box>
  );
}
