// app/component/skill.js

'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  IconButton,
  Button,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

export default function SkillForm({ data, setData }) {
  // Local skill state mirrors parent data
  const [skillData, setSkillData] = useState(data?.skills || [{ name: '', level: '' }]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Sync changes to parent whenever skillData changes
    setData((prev) => ({ ...prev, skills: skillData }));
  }, [skillData, setData]);

  const handleSkillChange = (index, field, value) => {
    const updated = [...skillData];
    updated[index][field] = value;
    setSkillData(updated);
    setErrors({});
  };

  const addSkill = () => {
    setSkillData([...skillData, { name: '', level: '' }]);
  };

  const removeSkill = (index) => {
    if (skillData.length === 1) return;
    const updated = skillData.filter((_, i) => i !== index);
    setSkillData(updated);
  };

  return (
    <Box bg="gray.100" p={6} borderRadius="md" maxW="3xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Add Skills</Text>

        {skillData.map((skill, index) => (
          <HStack key={index} spacing={4} align="flex-end">
            <FormControl isInvalid={!!errors.skills && !skill.name}>
              <Input
                placeholder="Skill (e.g. Python)"
                value={skill.name}
                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.skills && !skill.level}>
              <Select
                placeholder="Level"
                value={skill.level}
                onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </Select>
              <FormErrorMessage>{errors.skills}</FormErrorMessage>
            </FormControl>

            <IconButton
              icon={<LuTrash2 />}
              colorScheme="red"
              variant="ghost"
              onClick={() => removeSkill(index)}
              aria-label="Remove Skill"
              isDisabled={skillData.length === 1}
            />
          </HStack>
        ))}

        <Button
          leftIcon={<LuPlus />}
          colorScheme="blue"
          variant="outline"
          onClick={addSkill}
          size="sm"
          alignSelf="flex-start"
        >
          Add Skill
        </Button>
      </VStack>
    </Box>
  );
}
