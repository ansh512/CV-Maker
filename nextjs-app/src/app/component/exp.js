//app/component/exp.js

'use client';
import { Input, Text, Textarea, Box, VStack, HStack, IconButton } from '@chakra-ui/react';
import { useEffect } from 'react';
import { LuPlus, LuTrash2, LuWand } from 'react-icons/lu';
import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

function Experience({ data = [], setData }) {
    const handleChange = (index, field, value) => {
        const updated = [...data];
        updated[index][field] = value;
        setData(updated);
    };

    const handleAdd = () => {
        setData([...data, { company: '', position: '', startDate: '', endDate: '', summary: '' }]);
    };

    const handleRemove = (index) => {
        const updated = [...data];
        updated.splice(index, 1);
        setData(updated);
    };

    useEffect(() => {
        if (data.length === 0) {
            setData([{ company: '', position: '', startDate: '', endDate: '', summary: '' }]);
        }
    }, [data, setData]);

    const handleRefineSummary = async (index) => {
    const summary = data[index].summary;
    if (!summary.trim()) return;

    try {
        const response = await client.chatCompletion({
        provider: "together",
        model: "deepseek-ai/DeepSeek-R1-0528",
        messages: [
            {
                role: "user",
                content: `Refine the following work experience summary to be professional, concise, and tailored for a job application. Return only the refined content in 3–4 bullet points. Do not include any explanation or extra text:\n\n${summary}`,
            },
        ],
        });

        const raw = response.choices?.[0]?.message?.content || '';
        const refined = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        if (!refined) return;

        const updated = [...data];
        updated[index].summary = refined;
        setData(updated);
    } catch (err) {
        console.error("Error refining summary:", err);
    }
    };

    return (
        <Box className="w-full max-w-3xl mx-auto px-4 mt-4">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Experience</Text>

            {data.map((exp, index) => (
                <Box key={index} className="border p-4 rounded mb-4 bg-white shadow">
                    <VStack spacing={4} align="stretch">
                        <Input
                            placeholder="Company Name"
                            size="lg"
                            value={exp.company}
                            onChange={e => handleChange(index, 'company', e.target.value)}
                        />

                        <Input
                            placeholder="Position"
                            size="lg"
                            value={exp.position}
                            onChange={e => handleChange(index, 'position', e.target.value)}
                        />

                        <HStack spacing={4}>
                            <Input
                                placeholder="Start Date"
                                size="lg"
                                value={exp.startDate}
                                onChange={e => handleChange(index, 'startDate', e.target.value)}
                            />
                            <Input
                                placeholder="End Date"
                                size="lg"
                                value={exp.endDate}
                                onChange={e => handleChange(index, 'endDate', e.target.value)}
                            />
                        </HStack>

                        <Box position="relative" w="100%">
                            <Textarea
                                placeholder={`1. Customize the summary to align with job requirements.\n2. Focus on key accomplishments with quantifiable results.\n3. Keep it concise and relevant.`}
                                size="lg"
                                height="100px"
                                resize="none"
                                value={exp.summary}
                                onChange={e => handleChange(index, 'summary', e.target.value)}
                                pr="40px"
                            />
                            <IconButton
                                icon={<LuWand />}
                                aria-label="Refine Summary"
                                onClick={() => handleRefineSummary(index)}
                                colorScheme="blue"
                                size="sm"
                                position="absolute"
                                bottom="8px"
                                right="8px"
                                zIndex="1"
                            />
                        </Box>

                        {data.length > 1 && (
                            <IconButton
                                aria-label="Remove Experience"
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
                aria-label="Add Experience"
                icon={<LuPlus />}
                onClick={handleAdd}
                colorScheme="green"
                mt={4}
            />
        </Box>
    );
}

export default Experience;
