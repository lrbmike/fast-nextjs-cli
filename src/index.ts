import { Command } from 'commander';
import prompts from 'prompts';
import path from 'path';
import fs from 'fs-extra';
import pc from 'picocolors';
import ora from 'ora';

const program = new Command();

program
  .name('fast-nextjs-cli')
  .description('Fast Next.js Scaffold CLI')
  .version('1.0.0');

program
  .command('create [project-name]')
  .description('Create a new Next.js project')
  .option('--with-i18n', 'Include i18n support (next-intl)')
  .option('--with-login', 'Include login page and auth logic')
  .action(async (projectName, options) => {
    let targetDir = projectName;

    if (!targetDir) {
      const response = await prompts({
        type: 'text',
        name: 'projectName',
        message: 'What is your project name?',
        initial: 'my-next-app'
      });
      targetDir = response.projectName;
    }

    if (!targetDir) {
      console.log(pc.red('[ERROR] Project name is required'));
      process.exit(1);
    }

    let useI18n = options.withI18n;
    let useLogin = options.withLogin;

    // If neither flag provided, ask interactively
    if (useI18n === undefined && useLogin === undefined) {
        const features = await prompts({
            type: 'multiselect',
            name: 'value',
            message: 'Select features',
            choices: [
                { title: 'i18n (next-intl)', value: 'i18n', selected: true },
                { title: 'Authentication (Login Page + JWT)', value: 'login', selected: false }
            ]
        });
        // Check if features.value exists (user might cancel)
        if (!features.value) {
            console.log(pc.red('[ERROR] Operation cancelled'));
            process.exit(1);
        }
        useI18n = features.value.includes('i18n');
        useLogin = features.value.includes('login');
    }
    
    // Force i18n if login is selected (since our login template uses [locale])
    if (useLogin && !useI18n) {
        console.log(pc.yellow('[WARN] Login feature requires i18n. Enabling i18n automatically.'));
        useI18n = true;
    }

    const root = path.resolve(process.cwd(), targetDir);
    // Assumption: compiled .js files are in dist/, so templates are in ../templates relative to dist/index.js
    const templatesDir = path.resolve(__dirname, '../templates');

    if (fs.existsSync(root)) {
      console.log(pc.red(`[ERROR] Directory ${targetDir} already exists.`));
      process.exit(1);
    }

    const spinner = ora(`Creating project in ${pc.green(root)}...`).start();

    try {
        // 1. Copy Base Template
        await fs.copy(path.join(templatesDir, 'base'), root);

        // Rename gitignore to .gitignore
        await fs.move(path.join(root, 'gitignore'), path.join(root, '.gitignore'));

        // 2. Copy App Structure (Simple vs i18n)
        if (useI18n) {
            await fs.copy(path.join(templatesDir, 'app-structures/i18n'), root, { overwrite: true });
        } else {
            await fs.copy(path.join(templatesDir, 'app-structures/simple'), root, { overwrite: true });
        }

        // 3. Copy Feature Modules
        if (useLogin) {
            await fs.copy(path.join(templatesDir, 'features/auth'), root, { overwrite: true });
        }

        // 4. Configure Middleware
        let middlewareSource = '';
        if (useI18n && useLogin) {
            middlewareSource = 'configs/middleware/intl-auth.ts';
        } else if (useI18n) {
            middlewareSource = 'configs/middleware/intl.ts';
        } else {
             middlewareSource = 'configs/middleware/basic.ts';
        }

        await fs.copy(
            path.join(templatesDir, middlewareSource),
            path.join(root, 'src/middleware.ts')
        );
        
        // 5. Update package.json name
        const pkgPath = path.join(root, 'package.json');
        const pkg = await fs.readJson(pkgPath);
        pkg.name = targetDir;
        await fs.writeJson(pkgPath, pkg, { spaces: 2 });

        // 6. Handle non-i18n next.config.ts override
        // Base template has i18n plugin enabled by default. If we are simple mode, we need to remove it.
        if (!useI18n) {
            const nextConfigContent = `import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
`;
            await fs.writeFile(path.join(root, 'next.config.ts'), nextConfigContent);
        }

        // 7. Generate Dynamic README.md
        const readmePath = path.join(root, 'README.md');
        let readmeContent = await fs.readFile(readmePath, 'utf-8');

        // Replace Project Name
        readmeContent = readmeContent.replace('{{PROJECT_NAME}}', targetDir);

        const features: string[] = [];
        const structure: string[] = [];
        const docs: string[] = [];

        if (useI18n) {
            features.push('- **i18n**: Internationalization support via next-intl');
            structure.push('- `src/messages`: Translation files');
            structure.push('- `src/i18n`: i18n configuration');
            docs.push('## i18n\n\nThis project uses `next-intl` for internationalization. Add your translations in `src/messages/`.');
        }

        if (useLogin) {
            features.push('- **Auth**: Authentication with Login/Register pages and Server Actions');
            structure.push('- `src/app/[locale]/(auth)`: Authentication routes');
            structure.push('- `src/actions/auth.ts`: Authentication logic');
            docs.push(`## Authentication

This project includes a complete authentication flow with Mock API.

**Test Credentials:**
- Email: \`admin@example.com\`
- Password: \`password\`

**Architecture:**
- \`src/app/api/auth/*\`: Mock API routes for login/register.
- \`src/actions/auth.ts\`: Server Actions calling the API routes.
- \`src/lib/http.ts\`: Server-side HTTP client with auto-auth header injection.

Environment:
- Copy \`.env.example\` to \`.env.local\` and update \`API_URL\` if you have a real backend.

You can replace the Mock API in \`src/actions/auth.ts\` with your real backend endpoint.`);
        }

        readmeContent = readmeContent.replace('<!-- FEATURES_PLACEHOLDER -->', features.join('\n'));
        readmeContent = readmeContent.replace('<!-- STRUCTURE_PLACEHOLDER -->', structure.join('\n'));
        readmeContent = readmeContent.replace('<!-- DOCUMENTATION_PLACEHOLDER -->', docs.join('\n\n'));

        await fs.writeFile(readmePath, readmeContent);

        spinner.succeed(pc.green(`Project ${targetDir} created successfully!`));
        
        console.log('\nNext steps:');
        console.log(`  cd ${targetDir}`);
        console.log(`  npm install`);
        console.log(`  npm run dev`);

    } catch (error) {
        spinner.fail(pc.red('Failed to create project'));
        console.error(error);
    }
  });

program.parse(process.argv);
