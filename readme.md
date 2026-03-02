# Neighborhood Project Setup

To get this project working properly on a new computer (especially one using Laravel Herd on Windows), follow these steps:

## 1. Prerequisites
- **PHP 8.3+** (Installed via Laravel Herd)
- **Node.js & NPM**
- **Composer**

## 2. Installation
Clone the repository and install dependencies:
```powershell
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

## 3. Environment Configuration
Create your local environment file and generate the application key:
```powershell
copy .env.example .env
php artisan key:generate
```
*Note: Ensure your `.env` file is configured with the correct database credentials for your local Herd/MySQL setup.*

## 4. Database Setup
Run migrations and seed the database:
```powershell
php artisan migrate --seed
```

## 5. Frontend Assets
Build frontend assets (Vue 3 + Tailwind CSS 4):
```powershell
# For development with Hot Module Replacement
npm run dev

# Or to build for production
npm run build
```

## 6. AI Support (Laravel Boost)
By default, this project includes portable MCP configurations in `.junie/mcp/mcp.json` and `.cursor/mcp.json` that use the `php artisan boost:mcp` command. These should work out-of-the-box if `php` is in your PATH and your AI client starts in the project root.

If the default configuration does not work for your environment, run the following command to generate local, absolute-path based `mcp.json` files:
```powershell
php artisan boost:install --mcp
```
This command detects your local Herd PHP path and project path, updating the configuration folders accordingly. Note that these local overrides are ignored by Git.

## 7. Accessing the Site
The site is automatically available via Laravel Herd at:
`http://neighborhood.test` (or your specific kebab-case folder name).

---

### Quick Setup Checklist
- [ ] `composer install`
- [ ] `npm install`
- [ ] `copy .env.example .env`
- [ ] `php artisan key:generate`
- [ ] `php artisan migrate --seed`
- [ ] `php artisan boost:install --mcp`
- [ ] `npm run dev` / `npm run build`
