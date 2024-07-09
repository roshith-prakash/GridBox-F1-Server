<h1>Gridbox Backend</h1>
<hr/>
<p>
<ul>
<li>This is the node + express server for the backend aspect of the Gridbox project. </li>
<li>The packages used:
    <ul>
    <li>Express - for creating a web server</li>
    <li>Prisma - ORM to abstract the DB layer</li>
    <li>CORS - for Cross origin requests</li>
    <li>Helmet - for security</li>
    </ul>
</li>
<li>To run the project : 
    <ol>
    <li>npm install</li>
    <li>Create an .env file and add the database link + port</li>
    <li>npx prisma generate</li>
    <li>npm run dev</li>
    </ol>
</li>
<li>API Routes: (API only has data till 2024.)
    <ol>
    <li>/api/v1/getDrivers : To get drivers for a certain year. Pass year in request body.</li>
    <li>/api/v1/getConstructors : To get constructors for a certain year. Pass year in request body.</li>
    <li>/api/v1/getDriverStandings : To get driver standings for a certain year. Pass year in request body.</li>
    <li>/api/v1/getConstructorStandings : To get constructor standings for a certain year. Pass year in request body.</li>
    <li>/api/v1/getCircuits : To get circuits for a certain year. Pass year in request body.</li>
    <li>/api/v1/getSchedule : To get race schedule for a certain year. Pass year in request body.</li>
    <li>/api/v1/getRaceResult : To get the race result for a certain round. Pass year and round in request body.</li>
    <li>/api/v1/getQualifyingResult : To get the qualifying result for a certain round. Pass year and round in request body.</li>
    </ol>
</li>
</ul>
</p>