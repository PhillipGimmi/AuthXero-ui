'use client';

import { useState } from 'react';
import { Box, Heading, Input, Button, Text } from '@chakra-ui/react';
import axios from '@/utils/api';

export default function Admin() {
  const [serviceName, setServiceName] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateService = async () => {
    try {
      const response = await axios.post('/admin/create-service', { serviceName, redirectUri });
      if (response.status === 200) {
        setMessage('Service created successfully!');
      }
    } catch (err) {
      setMessage('Failed to create service.');
    }
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h2" size="xl" mb={6}>
        Admin Dashboard
      </Heading>
      <Input
        placeholder="Service Name"
        mb={4}
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
      />
      <Input
        placeholder="Redirect URI"
        mb={4}
        value={redirectUri}
        onChange={(e) => setRedirectUri(e.target.value)}
      />
      <Button colorScheme="teal" size="lg" onClick={handleCreateService}>
        Create Authentication Service
      </Button>
      {message && <Text mt={4}>{message}</Text>}
    </Box>
  );
}
