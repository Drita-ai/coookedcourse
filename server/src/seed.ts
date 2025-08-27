import prisma from './utils/prisma-client/getPrismaClient';

const syllabusTexts = [
    "Introduction: Basic Terminologies: Elementary Data Organizations, Data Structure Operations: insertion, deletion, traversal etc.; Analysis of an Algorithm, Asymptotic Notations, Time-Space trade-off. Searching: Linear Search and Binary Search Techniques and their complexity analysis.",
    "Sorting and Hashing: Objective and properties of different sorting algorithms: Selection Sort,Bubble Sort, Insertion Sort, Quick Sort, Merge Sort, Heap Sort; Performance and Comparison among all the methods, Hashing: Symbol table, Hashing Functions, Collision-Resolution Techniques"
];

const llmExtractedSyllabusData = [
    [
        {
            name: 'Introduction',
            topics: [
                'Basic Terminologies: Elementary Data Organizations',
                'Data Structure Operations: insertion, deletion, traversal etc.',
                'Analysis of an Algorithm',
                'Asymptotic Notations',
                'Time-Space trade-off',
                'Searching: Linear Search and Binary Search Techniques and their complexity analysis',
            ],
        },
    ],
    [
        {
            name: 'Sorting and Hashing',
            topics: [
                'Selection Sort',
                'Bubble Sort',
                'Insertion Sort',
                'Quick Sort',
                'Merge Sort',
                'Heap Sort',
                'Performance and Comparison among all the methods',
            ],
        },
        {
            name: 'Hashing',
            topics: ['Symbol table', 'Hashing Functions', 'Collision-Resolution Techniques'],
        },
    ],
];

const importData = async () => {
    try {
        for (let i = 0; i < llmExtractedSyllabusData.length; i++) {
            const unit = await prisma.unit.create({
                data: {},
            });

            await prisma.syllabus.create({
                data: {
                    syllabus: syllabusTexts[i],
                    unitId: unit.id,
                },
            });

            const chapters = llmExtractedSyllabusData[i];
            for (const chapter of chapters) {
                await prisma.chapter.create({
                    data: {
                        name: chapter.name,
                        topics: chapter.topics,
                        unitId: unit.id,
                    },
                });
            }
        }

        console.log('Data loaded successfully...');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await prisma.$disconnect();
        process.exit();
    }
};

const deleteData = async () => {
    try {
        await prisma.chapter.deleteMany({});
        await prisma.syllabus.deleteMany({});
        await prisma.unit.deleteMany({});
        console.log('Data removed successfully...');
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
        process.exit();
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
