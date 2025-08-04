'use client';
import React from 'react';
import {
  Input,
  Text,
  VStack,
  HStack,
  Box,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

function Form({ data = {}, setData }) {
  const handleChange = (field) => (e) => {
    setData({ ...data, [field]: e.target.value });
  };

  return (
    <Box bg="gray.100" minH="50vh" py={10} px={4}>
      <VStack spacing={6} maxW="2xl" mx="auto">
        <Text fontSize="2xl" fontWeight="bold">Personal Details</Text>

        <HStack spacing={4} w="full">
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              placeholder="First Name"
              size="lg"
              value={data.firstName || ''}
              onChange={handleChange('firstName')}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              placeholder="Last Name"
              size="lg"
              value={data.lastName || ''}
              onChange={handleChange('lastName')}
            />
          </FormControl>
        </HStack>

        <HStack spacing={4} w="full">
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              size="lg"
              value={data.email || ''}
              onChange={handleChange('email')}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="tel"
              placeholder="Phone number"
              size="lg"
              value={data.phone || ''}
              onChange={handleChange('phone')}
            />
          </FormControl>
        </HStack>

        <HStack spacing={4} w="full">
          <FormControl isRequired>
            <FormLabel>City</FormLabel>
            <Input
              placeholder="City"
              size="lg"
              value={data.city || ''}
              onChange={handleChange('city')}
            />
          </FormControl>
        </HStack>

        <HStack spacing={4} w="full">
          <FormControl isRequired>
            <FormLabel>LinkedIn</FormLabel>
            <Input
              placeholder="LinkedIn"
              size="lg"
              value={data.linkedin || ''}
              onChange={handleChange('linkedin')}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Website</FormLabel>
            <Input
              placeholder="Website"
              size="lg"
              value={data.website || ''}
              onChange={handleChange('website')}
            />
          </FormControl>
        </HStack>
      </VStack>
    </Box>
  );
}

export default Form;
