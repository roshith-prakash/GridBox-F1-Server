<h1>GridBox F1 Backend</h1>
<hr/>
<p>
<ul>

<li>This is the node + express server for the backend aspect of the GridBox F1 project. </li>
<li>The project makes use of the Jolpica API.</li>

<li>The packages used:
    <ul>
    <li>Express - for creating a web server</li>
    <li>Prisma - ORM to abstract the DB layer</li>
    <li>Redis - to cache data</li>
    <li>CORS - for Cross origin requests</li>
    <li>Helmet - for security</li>
    </ul>
</li>

<li>To run the project : 
    <ol>
    <li>npm install</li>
    <li>Create an .env file and add the database link + port + redis info</li>
    <li>npx prisma generate</li>
    <li>npm run dev</li>
    </ol>
</li>
</ul>

API Routes: (API only has data till 2024. All routes are POST routes.)

<ul>
<table>
    <tr>
    <td>/api/v1/getDrivers</td>
    <td>To get drivers for a certain year. Pass year in request body.</td>
    </tr>
    <tr>
    <td>/api/v1/getConstructors</td>
    <td>To get constructors for a certain year. Pass year in request body.</td>
    </tr>
    <tr>
    <td>/api/v1/getDriverStandings</td>
    <td>To get driver standings for a certain year. Pass year in request body.</td>
    </tr>
    <tr>
    <td>/api/v1/getConstructorStandings</td>
    <td>To get constructor standings for a certain year. Pass year in request body.</td>
    </tr>
    <tr>
    <td>/api/v1/getCircuits</td>
    <td>To get circuits for a certain year. Pass year in request body.</td>
    </tr>
    <tr>
    <td>/api/v1/getSchedule</td>
    <td> To get race schedule for a certain year. Pass year in request body.</td>
    </tr>
    <tr>
    <td>/api/v1/getRaceResult</td>
    <td> To get the race result for a certain round. Pass year and round in request body.</td>
    </tr>
    <tr>
    <td>/api/v1/getQualifyingResult</td>
    <td>  To get the qualifying result for a certain round. Pass year and round in request body.</td>
    </tr>
    <tr>
    <td>/api/v1/getSprintResult</td>
    <td>To get the sprint race result for a certain round. Pass year and round in request body.</td>
    <tr>
    <td>/api/v1/create-post</td>
    <td>To create a new article.</td>
    </tr>
    <tr>
    <td>/api/v1/get-recent-posts</td>
    <td>To get recent posts in a paginated format (4 at a time).</td>
    </tr>
    <tr>
    <td>/api/v1/get-post</td>
    <td>To get a specific post.</td>
    </tr>
    </table>
</p>