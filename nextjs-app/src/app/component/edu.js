//app/component/edu.js

'use client';
import { useEffect } from 'react';
import { Input, Text, Box, VStack, IconButton } from '@chakra-ui/react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function Education({ data = [], setData }) {
    const handleChange = (index, field, value) => {
        const updated = [...data];
        updated[index][field] = value;
        setData(updated);
    };

    const handleAdd = () => {
        setData([...data, { degree: '', institution: '', year: '', cgpa: ''}]);
    };

    const handleRemove = (index) => {
        const updated = [...data];
        updated.splice(index, 1);
        setData(updated);
    };

    // Ensure at least one form is shown on first render
    useEffect(() => {
        if (data.length === 0) {
            setData([{ degree: '', institution: '', year: '', cgpa: ''}]);
        }
    }, [data, setData]);

    return (
        <Box className="w-full max-w-3xl mx-auto px-4 mt-4">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Education Details</Text>

            {data.map((edu, index) => (
                <Box key={index} className="border p-4 rounded mb-4 bg-white shadow">
                    <VStack spacing={4} align="stretch">
                        <Input
                            placeholder="Degree / Course"
                            size="lg"
                            value={edu.degree}
                            onChange={e => handleChange(index, 'degree', e.target.value)}
                        />
                        <Input
                            placeholder="Institution"
                            size="lg"
                            value={edu.institution}
                            onChange={e => handleChange(index, 'institution', e.target.value)}
                        />
                        <Input
                            placeholder="Year of Graduation"
                            size="lg"
                            value={edu.year}
                            onChange={e => handleChange(index, 'year', e.target.value)}
                        />
                        <Input
                            placeholder="CGPA/Percentage"
                            size="lg"
                            value={edu.cgpa}
                            onChange={e => handleChange(index, 'cgpa', e.target.value)}
                        />
                        {data.length > 1 && (
                            <IconButton
                                aria-label="Remove"
                                icon={<LuTrash2 />}
                                colorScheme="red"
                                size="sm"
                                alignSelf="flex-end"
                                onClick={() => handleRemove(index)}
                            />
                        )}
                    </VStack>
                </Box>
            ))}

            <IconButton
                aria-label="Add education"
                icon={<LuPlus />}
                onClick={handleAdd}
                colorScheme="green"
                mt={6}
            />
        </Box>
    );
}

export default Education;
