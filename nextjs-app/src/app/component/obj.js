'use client';

import { useState } from 'react';
import {
  Textarea,
  Text,
  VStack,
  useToast,
  IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { LuWand } from 'react-icons/lu';
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY); // ✅ Token outside component

export default function Objective({ data, setData }) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const isInvalid = !data.trim();

  const handleRefine = async () => {
    if (!data.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a career objective to refine.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await client.chatCompletion({
        provider: "together",
        model: "deepseek-ai/DeepSeek-R1-0528",
        messages: [
          {
            role: "user",
            content: `Refine the following career objective to be concise, professional, and tailored for a job application. Keep the result to only 2–3 lines. Do not include any explanation or additional text — only return the refined objective:\n\n${data}`,
          },
        ],
      });

      const raw = response.choices?.[0]?.message?.content || '';
      const refined = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

      if (!refined) throw new Error("Empty response from DeepSeek");

      setData(refined);

      toast({
        title: 'Success',
        description: 'Career objective refined!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to refine objective. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack
      spacing={4}
      align="center"
      p={6}
      bg="gray.50"
      borderRadius="md"
      boxShadow="md"
      maxW="4xl"
      mx="auto"
      w="100%"
    >
      <Text fontSize="xl" fontWeight="bold">
        Career Objective / Summary
      </Text>

      <FormControl isInvalid={isInvalid} isRequired>
        <FormLabel>Objective</FormLabel>
        <Textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={`1. Customize the summary to align with the specific skills and experiences required by the job description.
2. Focus on significant accomplishments and results, using quantifiable metrics when possible.
3. Keep each point brief and relevant to the job you are applying for, avoiding unnecessary details.`}
          size="lg"
          borderColor="gray.300"
          focusBorderColor="blue.500"
          resize="vertical"
          height="200px"
          borderRadius="md"
          p={3}
          _hover={{ borderColor: 'blue.400' }}
        />
        {isInvalid && <FormErrorMessage>This field is required.</FormErrorMessage>}
      </FormControl>

      <IconButton
        icon={<LuWand />}
        aria-label="Refine Objective"
        onClick={handleRefine}
        isLoading={isLoading}
        colorScheme="blue"
        size="md"
        borderRadius="md"
      />
    </VStack>
  );
}
