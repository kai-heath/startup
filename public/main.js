accountInfo = JSON.parse(localStorage.getItem('user'));
console.log("yeet");
const username = JSON.parse(localStorage.getItem('username'));
requests = ['your_dad'];
if(accountInfo.requests) {
    requests = accountInfo.requests;
}
buddies = [{username: 'Kai', objects: [{type: 'text', data: 'this is your first note!'}, {type: 'text', data: 'and another one!'}]},{username: 'Your_Mom', objects: [{type: 'text', data: 'You are a dissapointment'}, {type: 'text', data: 'a waste of 9 months'}]}];
if (accountInfo.buddies) {
    buddies = accountInfo.buddies;
}
currBuddy = buddies[0];
if (localStorage.getItem('currBuddy')) {
    currBuddy = JSON.parse(localStorage.getItem('currBuddy'));
}
objects = currBuddy.objects;


