# Audit PoC

## Project structure

.
├── rc-audit/
│ ├── apps
│ │ ├── client/ # React application
│ │ │ ├── assets/ # Static assets folder
│ │ │ ├── components/ # Shared components
│ │ │ │ ├── ComponentA
│ │ │ │ │ ├── ComponentA.module.(scss|css|less)
│ │ │ │ │ ├── ComponentA.spec.tsx
│ │ │ │ │ ├── ComponentA.tsx # We can choose to create the component in a single file and the exposed on index.tsx
│ │ │ │ │ ├── ComponentA.stories.tsx (?) # Storybook files
│ │ │ │ │ ├── .. other things related to ComponentA
│ │ │ │ │ └── index.tsx
│ │ │ │ ├── ComponentB
│ │ │ │ │ ├── ComponentB.module.(scss|css|less)
│ │ │ │ │ ├── ComponentB.spec.tsx
│ │ │ │ │ ├── ComponentA.stories.tsx (?) # Storybook files
│ │ │ │ │ ├── .. other things related to ComponentB
│ │ │ │ │ └── index.tsx # or we can just create the component on index.tsx. I prefer this way!!
│ │ │ │ ├── ... other shared components
│ │ │ │ └── index.tsx
│ │ │ ├── hooks/
│ │ │ │ ├── useExample.tsx
│ │ │ │ ├── useMyHook.tsx
│ │ │ │ ├── ... other hooks
│ │ │ │ └── index.tsx
│ │ │ ├── pages/
│ │ │ │ ├── ExamplePage
│ │ │ │ │ ├── ExamplePage.module.(scss|css|less)
│ │ │ │ │ ├── ExamplePage.spec.tsx
│ │ │ │ │ ├── ExamplePage.stories.tsx (?) # Storybook files
│ │ │ │ │ ├── ... other things related to ExamplePage Page
│ │ │ │ │ └── index.tsx
│ │ │ │ └── index.tsx
│ │ │ ├── services/
│ │ │ │ ├── http.service.ts
│ │ │ │ ├── user.service.ts
│ │ │ │ ├── ...
│ │ │ │ └── index.tsx
│ │ │ ├── stores/
│ │ │ │ ├── GlobalContext(?).tsx
│ │ │ │ ├── ThemeContext(?).tsx
│ │ │ │ ├── ... other stores
│ │ │ │ └── index.tsx
│ │ │ ├── reducers/
│ │ │ │ ├── ...
│ │ │ │ └── index.tsx
│ │ │ └── ... other application files and folders
│ │ │
│ │ ├── client-e2e/ # React application's e2e with playwright
│ │ │
│ │ ├── server/ # Fastify application
│ │ │ ├── repository/
│ │ │ │ ├── dynamodb-client.ts
│ │ │ │ ├── entity.repository.ts
│ │ │ │ └── ...
│ │ │ ├── lib/
│ │ │ │ ├── logger.ts
│ │ │ │ └── ...
│ │ │ ├── entity # comes from auditable entity/
│ │ │ │ ├── entity.model.ts
│ │ │ │ ├── entity.service.ts
│ │ │ │ ├── entity.controller.ts
│ │ │ │ ├── entity.router.ts
│ │ │ │ ├── entity.service.spec.ts
│ │ │ │ └── ...
│ │ │ └── handler.ts
│ │ │
│ │ ├── server-e2e/ # Fastify application's e2e with jest and axios (?)
│ │ │
│ │ ├── swagger/
│ │ │ └── rc-audit.yml # OpenAPI specification file
│ │ │
│ │ ├── infrastructure # cdk TS files, need to fix new path/
│ │ │ ├── bin
│ │ │ └── lib/
│ │ │ │ └── stacks/
│ │ │ │ │ ├── common/
│ │ │ │ │ │ ├── api-stack.ts
│ │ │ │ │ │ └── db-stack.ts
│ │ │ │ │ ├── gov/
│ │ │ │ │ │ └── spa-gov-stack.ts
│ │ │ │ │ └── commercial/
│ │ │ │ │ │ └── spa-comm-stack.ts
│ │
│ ├── libs
│ │ ├── i18n/ # shared internationalization
│ │ ├── utils/ # shared common (typescript|javascript) utility (functions|classes|constants|etc)
│ │ ├── (ui|theme)/ #
│ │ └── (interfaces|models)/ # shared (typescript|javascript) (types|interfaces)
│ │
│ ├── dist # compiled files
│ │ ├── .playwright # react e2e tmp folder
│ │ ├── apps # compiled files for apps
│ │ └── libs # compiled files for libs
│ │
│ └── ... other configuration files
