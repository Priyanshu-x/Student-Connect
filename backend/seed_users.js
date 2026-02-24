require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');

const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
const years = ['1st', '2nd', '3rd', 'Final'];
const hobbiesList = ['Coding', 'Music', 'Cricket', 'Travel', 'Photography', 'Gaming', 'Reading', 'AI/ML'];
const names = [
    'Aarav Patel', 'Vivaan Singh', 'Aditya Sharma', 'Vihaan Gupta', 'Arjun Verma',
    'Sai Kumar', 'Reyansh Malhotra', 'Ayaan Khan', 'Krishna Das', 'Ishaan Joshi',
    'Saanvi Reddy', 'Anya Mehta', 'Diya Nair', 'Ananya Kapoor', 'Pari Agarwal',
    'Riya Jain', 'Anvi Choudhury', 'Aditi Mishra', 'Kavya Singh', 'Myra Saxena'
];

async function seedUsers() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined. Check .env file path.');
        }
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to:', mongoose.connection.name);

        console.log('Clearing existing users...');
        await User.deleteMany({});

        const users = [];

        // Generate 50 dummy users
        for (let i = 0; i < 50; i++) {
            const name = names[i % names.length] + (i > 19 ? ` ${i}` : '');
            const dept = departments[Math.floor(Math.random() * departments.length)];
            const year = years[Math.floor(Math.random() * years.length)];
            const collegeId = `CS2025${String(i + 1).padStart(3, '0')}`;
            const isClaimed = Math.random() < 0.2;

            users.push({
                name: name,
                email: `${name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
                collegeId: collegeId,
                password: isClaimed ? 'password123' : undefined,
                department: dept,
                year: year,
                isClaimed: isClaimed,
                verified: isClaimed,
                score: Math.floor(Math.random() * 1000),
                hobbies: [
                    hobbiesList[Math.floor(Math.random() * hobbiesList.length)],
                    hobbiesList[Math.floor(Math.random() * hobbiesList.length)]
                ],
                profileImage: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&color=fff`,
            });
        }

        console.log('Inserting users...');
        await User.insertMany(users);
        console.log('✅ 50 Dummy Users Inserted!');

        console.log('--- Sample unclaimed user for testing ---');
        const sample = users.find(u => !u.isClaimed);
        console.log(`College ID: ${sample.collegeId}\nName: ${sample.name}\nEmail: ${sample.email}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedUsers();
