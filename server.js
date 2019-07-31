const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');

const app = feathers();
app.configure(socketio());

app.use('bus', {
    async find() {},
    async create(data) { return data }
})

app.on('connection', (connection) => {
    app.channel('bus').join(connection);
});

app.service('bus').publish('created', (data, context) => {
    return [app.channel('bus')];
});

let Resolve = () => {}
const ready = new Promise((resolve) => {
    Resolve = () => resolve()
})

app.listen(8998, (err) => {
    console.log('DEV: development bus is started on ::8998')
    console.log('DEV: waiting for building events')
    Resolve()
});

app.on('error', (err) => {
    console.log(11111, err)
})


const bus = app.service('bus');

function buildStarted() {
    bus.create({
        status: 'building'
    })
    console.log('DEV: status -> building')
}

function buildStatus(status) {
    bus.create({
        status,
    })
    console.log('DEV: status -> ' + status)
}

function buildFinshed(){
    bus.create({
        status: 'finished',
    })
    console.log('DEV: status -> finished')
}

module.exports = {
    bus,
    buildFinshed,
    buildStatus,
    buildStarted,
    ready,
}
