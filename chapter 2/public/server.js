import express from 'express';

const app = express();

// Set static folder
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded ({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Handle GET request to fetch users
app.get('/users', async (req, res) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const users = await response.json()
    res.send(`
    <h2>Users</h2>
 <ul class="list-group">
 ${users.map((user)=>`<li class="list-group-item">${user.name}</li>`).join('')}
 </ul>
 `)
});


// Start the server
app.listen (3000, ()=>{
console. log('Server listening on port 3000');
});