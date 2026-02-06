-- Normalize common skill names to their canonical forms
-- This updates the stack column for all vibecoders

-- Next.js variations
UPDATE vibecoders SET stack = REPLACE(stack, 'NextJS', 'Next.js') WHERE stack ILIKE '%NextJS%';
UPDATE vibecoders SET stack = REPLACE(stack, 'nextJS', 'Next.js') WHERE stack ILIKE '%nextJS%';
UPDATE vibecoders SET stack = REPLACE(stack, 'Nextjs', 'Next.js') WHERE stack ILIKE '%Nextjs%';
UPDATE vibecoders SET stack = REPLACE(stack, 'nextjs', 'Next.js') WHERE stack ILIKE '%nextjs%';
UPDATE vibecoders SET stack = REPLACE(stack, 'next.js', 'Next.js') WHERE stack ILIKE '%next.js%' AND stack NOT LIKE '%Next.js%';
UPDATE vibecoders SET stack = REPLACE(stack, 'next js', 'Next.js') WHERE stack ILIKE '%next js%';
UPDATE vibecoders SET stack = REPLACE(stack, 'Next.JS', 'Next.js') WHERE stack LIKE '%Next.JS%';
UPDATE vibecoders SET stack = REPLACE(stack, 'NEXT.JS', 'Next.js') WHERE stack LIKE '%NEXT.JS%';
UPDATE vibecoders SET stack = REPLACE(stack, 'Next JS', 'Next.js') WHERE stack LIKE '%Next JS%';

-- React variations
UPDATE vibecoders SET stack = REPLACE(stack, 'react', 'React') WHERE stack LIKE '%, react,%' OR stack LIKE 'react,%' OR stack LIKE '%, react' OR stack = 'react';
UPDATE vibecoders SET stack = REPLACE(stack, 'ReactJS', 'React') WHERE stack ILIKE '%ReactJS%';
UPDATE vibecoders SET stack = REPLACE(stack, 'reactjs', 'React') WHERE stack ILIKE '%reactjs%';
UPDATE vibecoders SET stack = REPLACE(stack, 'React.js', 'React') WHERE stack LIKE '%React.js%';

-- TypeScript variations
UPDATE vibecoders SET stack = REPLACE(stack, 'typescript', 'TypeScript') WHERE stack LIKE '%typescript%' AND stack NOT LIKE '%TypeScript%';
UPDATE vibecoders SET stack = REPLACE(stack, 'Typescript', 'TypeScript') WHERE stack LIKE '%Typescript%' AND stack NOT LIKE '%TypeScript%';
UPDATE vibecoders SET stack = REPLACE(stack, 'TS', 'TypeScript') WHERE stack LIKE '%, TS,%' OR stack LIKE 'TS,%' OR stack LIKE '%, TS' OR stack = 'TS';

-- JavaScript variations
UPDATE vibecoders SET stack = REPLACE(stack, 'javascript', 'JavaScript') WHERE stack LIKE '%javascript%' AND stack NOT LIKE '%JavaScript%';
UPDATE vibecoders SET stack = REPLACE(stack, 'Javascript', 'JavaScript') WHERE stack LIKE '%Javascript%' AND stack NOT LIKE '%JavaScript%';
UPDATE vibecoders SET stack = REPLACE(stack, 'JS', 'JavaScript') WHERE stack LIKE '%, JS,%' OR stack LIKE 'JS,%' OR stack LIKE '%, JS' OR stack = 'JS';

-- Tailwind CSS variations
UPDATE vibecoders SET stack = REPLACE(stack, 'tailwind', 'Tailwind CSS') WHERE stack ILIKE '%tailwind%' AND stack NOT ILIKE '%Tailwind CSS%';
UPDATE vibecoders SET stack = REPLACE(stack, 'TailwindCSS', 'Tailwind CSS') WHERE stack LIKE '%TailwindCSS%';
UPDATE vibecoders SET stack = REPLACE(stack, 'tailwindcss', 'Tailwind CSS') WHERE stack ILIKE '%tailwindcss%';

-- Supabase variations
UPDATE vibecoders SET stack = REPLACE(stack, 'supabase', 'Supabase') WHERE stack LIKE '%supabase%' AND stack NOT LIKE '%Supabase%';

-- Node.js variations
UPDATE vibecoders SET stack = REPLACE(stack, 'nodejs', 'Node.js') WHERE stack ILIKE '%nodejs%';
UPDATE vibecoders SET stack = REPLACE(stack, 'NodeJS', 'Node.js') WHERE stack LIKE '%NodeJS%';
UPDATE vibecoders SET stack = REPLACE(stack, 'node.js', 'Node.js') WHERE stack LIKE '%node.js%' AND stack NOT LIKE '%Node.js%';
UPDATE vibecoders SET stack = REPLACE(stack, 'node js', 'Node.js') WHERE stack ILIKE '%node js%';

-- Python variations
UPDATE vibecoders SET stack = REPLACE(stack, 'python', 'Python') WHERE stack LIKE '%python%' AND stack NOT LIKE '%Python%';

-- Vercel variations
UPDATE vibecoders SET stack = REPLACE(stack, 'vercel', 'Vercel') WHERE stack LIKE '%vercel%' AND stack NOT LIKE '%Vercel%';

-- AI SDK variations
UPDATE vibecoders SET stack = REPLACE(stack, 'ai sdk', 'AI SDK') WHERE stack ILIKE '%ai sdk%' AND stack NOT LIKE '%AI SDK%';
UPDATE vibecoders SET stack = REPLACE(stack, 'AI sdk', 'AI SDK') WHERE stack LIKE '%AI sdk%' AND stack NOT LIKE '%AI SDK%';

-- v0 variations
UPDATE vibecoders SET stack = REPLACE(stack, 'V0', 'v0') WHERE stack LIKE '%, V0,%' OR stack LIKE 'V0,%' OR stack LIKE '%, V0' OR stack = 'V0';

-- Cursor variations
UPDATE vibecoders SET stack = REPLACE(stack, 'cursor', 'Cursor') WHERE stack LIKE '%cursor%' AND stack NOT LIKE '%Cursor%';

-- Claude variations
UPDATE vibecoders SET stack = REPLACE(stack, 'claude', 'Claude') WHERE stack LIKE '%claude%' AND stack NOT LIKE '%Claude%';

-- ChatGPT / GPT variations
UPDATE vibecoders SET stack = REPLACE(stack, 'chatgpt', 'ChatGPT') WHERE stack ILIKE '%chatgpt%' AND stack NOT LIKE '%ChatGPT%';

-- PostgreSQL variations
UPDATE vibecoders SET stack = REPLACE(stack, 'postgresql', 'PostgreSQL') WHERE stack ILIKE '%postgresql%' AND stack NOT LIKE '%PostgreSQL%';
UPDATE vibecoders SET stack = REPLACE(stack, 'postgres', 'PostgreSQL') WHERE stack ILIKE '%postgres%' AND stack NOT LIKE '%PostgreSQL%';

-- Firebase variations
UPDATE vibecoders SET stack = REPLACE(stack, 'firebase', 'Firebase') WHERE stack LIKE '%firebase%' AND stack NOT LIKE '%Firebase%';

-- Prisma variations
UPDATE vibecoders SET stack = REPLACE(stack, 'prisma', 'Prisma') WHERE stack LIKE '%prisma%' AND stack NOT LIKE '%Prisma%';

-- Clean up any double spaces or leading/trailing whitespace in skills
UPDATE vibecoders SET stack = TRIM(BOTH FROM REGEXP_REPLACE(stack, '\s*,\s*', ', ', 'g')) WHERE stack IS NOT NULL;
