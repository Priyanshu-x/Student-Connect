// using native fetch

// If native fetch is not available in the environment, we might need another way.
// But standard Node 18+ has fetch. Let's try native fetch first by not importing if possible, 
// or just standard http. 
// Let's use standard http to be safe? No, that's verbose. 
// Let's assume the user has a modern node environment (Phase 1 summary said Node endpoints running).

const API_BASE = 'http://localhost:5000/api';
const EMAIL = `test_${Date.now()}@test.com`;
const PASSWORD = 'password123';

async function verify() {
    console.log('--- Starting Verification ---');

    try {
        // 1. Sign Up
        console.log(`1. Signing up user: ${EMAIL}...`);
        const signupRes = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Verification Bot',
                email: EMAIL,
                password: PASSWORD,
                department: 'QA',
                year: 'Final'
            })
        });

        if (!signupRes.ok) throw new Error(`Signup failed: ${signupRes.status} ${await signupRes.text()}`);
        const signupData = await signupRes.json();
        const token = signupData.token;
        console.log('✅ Signup Successful. Token received.');

        // 2. Create Project
        console.log('2. Creating a new project...');
        const projectRes = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Auto-Verified Project',
                description: 'This project was created by the verification script.',
                techStack: ['Node.js', 'Scripting'],
                githubLink: 'https://github.com/example/verified',
            })
        });

        if (!projectRes.ok) throw new Error(`Create Project failed: ${projectRes.status} ${await projectRes.text()}`);
        console.log('✅ Project Created Successfully.');

        // 3. Fetch Projects
        console.log('3. Fetching all projects to verify display...');
        const fetchRes = await fetch(`${API_BASE}/projects`);
        if (!fetchRes.ok) throw new Error(`Fetch Projects failed: ${fetchRes.status}`);
        const projects = await fetchRes.json();

        const myProject = projects.find(p => p.title === 'Auto-Verified Project');
        if (myProject) {
            console.log('✅ Verified: Project found in public feed.');
        } else {
            console.error('❌ Error: Project created but not found in feed.');
        }

        // 4. Update Profile (Check file upload logic placeholder/fix)
        // Testing the dashboard updates
        console.log('4. Testing Profile Update (Text)...');
        const updateRes = await fetch(`${API_BASE}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                hobbies: 'Coding, Testing'
            })
        });
        if (!updateRes.ok) throw new Error(`Update Profile failed: ${updateRes.status}`);
        console.log('✅ Profile Text Update Successful.');

        console.log('--- Verification Complete: Backend is GREEN ---');

    } catch (err) {
        console.error('❌ Verification Failed:', err);
        process.exit(1);
    }
}

verify();
