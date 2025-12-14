# CharacterGen

A web application used to create, manage, and update character attributes for TRPG Campaigns.

## Installation

### Dependencies

Before proceeding with the setup, ensure the following is installed in your environment:

- Python v3.10 or greater
- Node v24 or greater
- npm
- MongoDB

### Setup
The following section contains instructions on setting up this project in a development environment

#### Initial
- Clone the repository 
- If not already done, activate your MongoDB instance

#### Backend Setup
- In the terminal navigate to the `backend` folder. Create a new Python virtual environment in the current directory. 
- Run `pip install` on the requirement.txt file to download all dependencies
- In the `backend` folder create a `.env.local` file, which is a clone of the `.env.example` file. You will need to update the corresponding variables and generate a secret key to handle JWT tokens (Use HS256 algorithm)
    - For development, you can use `http:\\localhost:8000` as the API URL

- Run the following command to activate the backend api:
```
fastapi api/main.py
```

#### Frontend Setup
- In a new terminal, navigate to the `frontend` folder
- Run `npm install` to install all dependencies.
- In the `frontend` folder create an `.env.local` file, which is a clone of the `.env.example` file in the same directory. Update the corresponding configs
    - For development, you can use `http:\\localhost:3000` for `NEXT_PUBLIC_FRONT_END_BASE_URL`
- Run the following command to activate the frontend:
```
npm run dev
```

