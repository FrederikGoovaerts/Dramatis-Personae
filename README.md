# Dramatis Personae

<p>
    <a href="https://github.com/FrederikGoovaerts/Dramatis-Personae/releases/latest"><img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/FrederikGoovaerts/Dramatis-Personae"></a>
    <a href="https://github.com/FrederikGoovaerts/Dramatis-Personae/blob/master/LICENSE"><img alt="Project License" src="https://img.shields.io/github/license/FrederikGoovaerts/Dramatis-Personae"></a>
</p>

A tabletop RPG campaign managing tool. The goal of this project is to provide DMs and players with a set of tools to track story progression in a centralized and collaborative way.

To reach this goal, the project currently offers the following:

- Campaigns with a list of characters can be created and shared
- Notes can be attached to characters to track story progression and shared with other players
- Characters can be labeled and filtered

Planned functionality:

- Events in the story can be recorded
- Links between events and characters can be established

## Project structure

The repository contains the following folders:

- `backend`: This folder contains the source code for the API backend, written in Kotlin using the Spring Boot framework and backed by PostgreSQL as persistent storage.
- `frontend`: This folder contains the source code for the web frontend, written in TypeScript using the React framework.

The `backend` and `frontend` folders each contain and additional README file with instructions specific to the subproject. Each also contains a `Dockerfile` to build and deploy the subprojects. The main focus when developing or generating deliverables will currently be in building and distributing Docker images, though the building and deploying the subprojects in more traditional ways is still an option.
