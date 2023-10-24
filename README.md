## Setup

Dependencies
- Node 18.7.0
- docker-compose
- Postgres 14.6

Please run the following commands to start the app
```bash
  $ npm install
  $ npm run build
  $ docker compose run rewards node ./bin/migrate
```

Then the API endpoints will be accessible via localhost:3000

For tests, please run:
```bash
  $ npm run test
```

## API Routes
### GET /members
accepts query parameters:
view, deleted, member attributes
- Allows user to retrieve a Member by their exact email address
eg: GET /members?email=user1@email.com
- Allows user to optionally specify which member properties to return
eg: GET /members?view=firstName&view=lastName
- Allows user to optionally include associated rewards in the response
eg: GET /members?view=rewards
- Allows user to view deleted Members
eg: GET /members?deleted=true

### GET /members/all
will just return all active (not deleted) Members

### GET /members/:id
will return a single Member's details

### POST /members/:id
will update or undelete a single Member

### GET /members/:id/rewards
will return a single Member's associated and active Rewards

### POST /members/:id/rewards/:rewardId
will link a single Reward to a Member, providing there isn't an active one

### DELETE /members/:id
will soft delete a single Member

### POST /members/:id/rewards/:rewardId/delete
will dissassociate a single Reward from a Member

### GET /rewards
accepts query parameters:
view, deleted

### GET /rewards/all
will fetch all active Rewards

### GET /rewards/:id
will fetch a single Reward by ID

### PUT /rewards
will create a single Reward provided name is unique

### POST /rewards/:id
will update or undelete a single Reward

### DELETE /rewards/:id
will soft delete a single Reward and by consequence won't be shown on Member's details

## Task list

- create Member
- get Member by ID
- get Member by email
- update Member
- delete Member
- give list of associated Rewards
- dissociate a Member's Reward
- Option to specify which member properties to return

- create Reward
- get Reward by ID
- get Reward by name
- get Reward by name or description
- update Reward
- delete Reward
- dependent destroy all associated MemberRewards (not required; filtered out)

- case insensitive search
- seed file
- package Postman API's

## Assumptions
- Each Member's email is unique
- Member can only have one of each Reward that is active/not-deleted
- Reward's name is unique
- Delete functions would be soft in nature; could be reversed and searched upon
- If no view query parameters are given to the GET /members route, it will default to returning all viewable attributes

## Next steps
- unit test suit on the express API endpoints (was unsuccessful in getting the db mocked)
- landing page and apiDoc
- partial search
- default scope of { deletedAt: null } to each table