'use client';  // This marks the component as client-side interactive

import { useState } from 'react';
import { Box, Heading, Input, Button, Text } from '@chakra-ui/react';
import axios from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', { email, password });
      if (response.status === 200) {
        router.push('/admin');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h2" size="xl" mb={6}>
        Login to AuthXero
      </Heading>
      <Input
        placeholder="Email"
        mb={4}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        mb={4}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button colorScheme="teal" size="lg" onClick={handleLogin}>
        Login
      </Button>
      {error && <Text color="red.500" mt={4}>{error}</Text>}
    </Box>
  );
}
