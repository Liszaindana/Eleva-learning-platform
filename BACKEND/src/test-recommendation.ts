// logging

const API_BASE = 'http://localhost:3000';

async function request(method: string, path: string, body?: any, token?: string) {
    const opts: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        opts.headers = { ...opts.headers, Authorization: `Bearer ${token}` };
    }

    if (body) {
        opts.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${path}`, opts);
    const data = await res.json();

    if (!res.ok) {
        throw { status: res.status, data };
    }

    return data;
}

async function test() {
    try {
        console.log('1. Testing login...');
        const loginRes = await request('POST', '/auth/login', {
            email: 'siswa1@eleva.com',
            password: 'mentor123'
        });

        console.log('Login response:', JSON.stringify(loginRes, null, 2));

        const token = loginRes.data?.token || loginRes.token;
        if (!token) {
            throw new Error('No token in response');
        }

        console.log('✓ Login successful, token:', token.substring(0, 20) + '...');

        // Get first category
        console.log('\n2. Getting categories...');
        const catRes = await request('GET', '/category', undefined, token);
        console.log('Category response:', JSON.stringify(catRes, null, 2).substring(0, 500));
        const categoryId = catRes.data?.[0]?.category_id || catRes[0]?.category_id;
        if (!categoryId) {
            throw new Error('No category found');
        }
        console.log('✓ Got category:', categoryId);

        // Get first periode
        console.log('\n3. Getting periods...');
        const periRes = await request('GET', '/periode', undefined, token);
        console.log('Period response:', JSON.stringify(periRes, null, 2).substring(0, 500));
        const periodeId = periRes.data?.[0]?.periode_id || periRes[0]?.periode_id;
        if (!periodeId) {
            throw new Error('No periode found');
        }
        console.log('✓ Got periode:', periodeId);

        // Test recommendation with SAW method
        console.log('\n4. Creating recommendation (SAW)...');
        const recRes = await request(
            'POST',
            '/recommendation',
            {
                category_id: categoryId,
                periode_id: periodeId,
                method: 'SAW'
            },
            token
        );

        console.log('✓ Recommendation created successfully!');
        console.log('  Message:', recRes.message);
        console.log('  Method:', recRes.data.method);
        console.log('  Results count:', recRes.data.results.length);

        if (recRes.data.results.length > 0) {
            console.log('  Top mentor:', recRes.data.results[0].user.name, 'Score:', recRes.data.results[0].score);
        }

        console.log('\n✅ All tests passed!');
    } catch (error: any) {
        console.error('❌ Error:', error.data || error.message);
        process.exit(1);
    }
}

test();
