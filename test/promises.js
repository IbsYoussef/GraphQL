const posts = [
    { title: 'Post One', body: 'This is post one' },
    { title: 'Post Two', body: 'This is post two' },
];

function getPosts() {
    setTimeout(() => {
        let output = '';
        posts.forEach((post, index) => {
            output += `<li>${post.title}</li>`;
        });
        document.body.innerHTML = output;
    }, 1000);
}

function createPost(post) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            posts.push(post);
            const error = false;

            if (!error) {
                resolve();
            } else {
                reject('Error: Something went wrong');
            }
        });
    });
}

// createPost({ title: 'Post Five', body: 'This is post five' })
//     .then(getPosts)
//     .catch(err => console.log(err));

// Async / Await
// async function init() {
//     await createPost({ title: 'Post Five', body: 'This is post five' });
//     getPosts();
// }

// init();

// Async / Await with Fetch
async function fetchUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');

    const data = await res.json();

    console.log(data);
}

fetchUsers();

// const Promise1 = Promise.resolve('Hello World');
// const Promise2 = 10;
// const Promise3 = new Promise((resolve, reject) => {
//     setTimeout(resolve, 2000, 'Goodbye');
// });
// const Promise4 = fetch('https://jsonplaceholder.typicode.com/users')
//     .then(res => res.json());

// Promise.all([Promise1, Promise2, Promise3, Promise4]).then(values => console.log(values));