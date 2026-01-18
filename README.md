# Todo App

A comprehensive todo application built with Next.js, featuring Google OAuth authentication and MongoDB for data persistence.

## Features

- ✅ **Create Tasks**: Add tasks with title, description, date & time, and priority
- ✅ **Update Tasks**: Edit existing tasks
- ✅ **Display Tasks**: View all tasks sorted by priority and deadline
- ✅ **Task Management**: Mark tasks as done, not needed, or delete them
- ✅ **Google OAuth**: Secure authentication using Google OAuth
- ✅ **MongoDB Integration**: Persistent storage for users and tasks

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **NextAuth.js v5** - Authentication
- **MongoDB** - Database
- **Tailwind CSS** - Styling
- **date-fns** - Date formatting

## Project Structure

```
contravault/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/     # NextAuth API routes
│   │   └── tasks/
│   │       ├── route.ts            # GET (list) and POST (create) tasks
│   │       └── [id]/
│   │           └── route.ts        # GET, PUT, PATCH, DELETE individual tasks
│   ├── auth/
│   │   └── signin/                 # Sign-in page
│   ├── layout.tsx                  # Root layout with providers
│   └── page.tsx                    # Main dashboard
├── components/
│   ├── AuthButton.tsx              # Sign in/out button
│   ├── Providers.tsx               # NextAuth SessionProvider
│   ├── TaskCard.tsx                # Individual task display
│   ├── TaskForm.tsx                # Create/edit task form
│   └── TaskList.tsx                # List of all tasks
├── lib/
│   ├── auth/
│   │   ├── config.ts               # NextAuth configuration
│   │   └── session.ts              # Session helper functions
│   ├── db/
│   │   ├── connection.ts           # MongoDB connection
│   │   └── collections.ts          # Collection helpers
│   └── models/
│       └── task.ts                  # Task CRUD operations
└── types/
    ├── index.ts                    # TypeScript type definitions
    └── next-auth.d.ts              # NextAuth type extensions
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Google OAuth credentials

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory with the following:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# MongoDB Connection String
MONGODB_URI=your_mongodb_connection_string_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

3. **Get Google OAuth Credentials:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret to your `.env.local`

4. **Get MongoDB Connection String:**

   - For MongoDB Atlas: Create a cluster and get the connection string
   - For local MongoDB: Use `mongodb://localhost:27017/contravault`

5. **Generate NextAuth Secret:**

   You can generate a secret using:
   ```bash
   openssl rand -base64 32
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Create Task**: Click "+ New Task" and fill in the form
3. **View Tasks**: All tasks are displayed sorted by priority and deadline
4. **Manage Tasks**: 
   - Mark as "Done" for completed tasks
   - Mark as "Not Needed" for tasks you no longer need
   - Delete tasks you want to remove
5. **Sign Out**: Click "Sign Out" when done

## API Endpoints

- `GET /api/tasks` - Get all tasks for the current user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task
- `PATCH /api/tasks/[id]` - Update task status
- `DELETE /api/tasks/[id]` - Delete a task

## Database Collections

- **users**: Stores user information (email, name, image)
- **tasks**: Stores task data (title, description, deadline, priority, status, userId)

## License

This project is open source and available under the MIT License.
