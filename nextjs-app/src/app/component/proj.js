// app/component/proj.js
'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Textarea,
  IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { LuPlus, LuTrash2, LuWand } from 'react-icons/lu';
import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

export default function ProjectForm({ data = [], setData }) {
  const [projects, setProjects] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const withErrors = data.map(p => ({ ...p, errors: {} }));
    if (withErrors.length === 0) {
      setProjects([{ title: '', description: '', errors: {} }]);
    } else {
      setProjects(withErrors);
    }
  }, [data]);

  const handleChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    updated[index].errors = { ...updated[index].errors, [field]: '' };
    setProjects(updated);
    setData(updated.map(({ errors, ...p }) => p));
  };

  const validate = (project) => {
    const errors = {};
    if (!project.title.trim()) errors.title = 'Project title is required';
    if (!project.description.trim()) errors.description = 'Description is required';
    return errors;
  };

  const handleAddProject = () => {
    const last = projects[projects.length - 1];
    const errors = validate(last);

    if (Object.keys(errors).length > 0) {
      const updated = [...projects];
      updated[projects.length - 1].errors = errors;
      setProjects(updated);
      return;
    }

    const newProjects = [...projects, { title: '', description: '', errors: {} }];
    setProjects(newProjects);
    setData(newProjects.map(({ errors, ...p }) => p));
  };

  const handleRemove = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    setData(updated.map(({ errors, ...p }) => p));
  };

  const handleRefine = async (index) => {
    const summary = projects[index].description;

    if (!summary.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a project description to refine.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoadingIndex(index);
    try {
      const response = await client.chatCompletion({
        provider: 'together',
        model: 'deepseek-ai/DeepSeek-R1-0528',
        messages: [
          {
            role: 'user',
            content: `Refine the following project description to be concise, professional, and suitable for a resume. Keep it short and do not include any extra explanation:\n\n${summary}`,
          },
        ],
      });

      const raw = response.choices?.[0]?.message?.content || '';
      const refined = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

      if (!refined) throw new Error('Empty response from model');

      const updated = [...projects];
      updated[index].description = refined;
      setProjects(updated);
      setData(updated.map(({ errors, ...p }) => p));

      toast({
        title: 'Success',
        description: 'Description refined!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to refine description.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <Box bg="gray.100" p={6} borderRadius="md" maxW="3xl" mx="auto">
      <VStack spacing={8} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          Projects
        </Text>

        {projects.map((proj, index) => (
          <Box key={index} bg="white" p={4} borderRadius="md" boxShadow="sm">
            <FormControl isInvalid={!!proj.errors.title} mb={4}>
              <FormLabel>Project Title</FormLabel>
              <Input
                value={proj.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                placeholder="e.g. AI Chatbot"
              />
              <FormErrorMessage>{proj.errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!proj.errors.description}>
              <FormLabel>Description</FormLabel>
              <HStack align="start">
                <Textarea
                  value={proj.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder="Brief summary of the project..."
                  resize="vertical"
                />
                <IconButton
                  size="sm"
                  mt={12}
                  icon={<LuWand />}
                  aria-label="Refine Description"
                  colorScheme="blue"
                  isLoading={loadingIndex === index}
                  onClick={() => handleRefine(index)}
                />
              </HStack>
              <FormErrorMessage>{proj.errors.description}</FormErrorMessage>
            </FormControl>

            {projects.length > 1 && (
              <IconButton
                mt={3}
                icon={<LuTrash2 />}
                aria-label="Remove Project"
                colorScheme="red"
                onClick={() => handleRemove(index)}
              />
            )}
          </Box>
        ))}

        <IconButton
          icon={<LuPlus />}
          aria-label="Add Project"
          colorScheme="green"
          onClick={handleAddProject}
          alignSelf="flex-end"
        />
      </VStack>
    </Box>
  );
}
