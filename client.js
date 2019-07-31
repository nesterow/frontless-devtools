const feathers = require('@feathersjs/client')
const io = require('socket.io-client')
const socketio = require('@feathersjs/socketio-client')
const client = require('client')


let IS_BUILDING = false;

class Actions {
    
    static building() {
        console.log('DEV: building')
        IS_BUILDING = true;
        const bar = new Turbolinks.ProgressBar();
        bar.show()
        bar.value = 0;
        const blocker = document.createElement('div')
        blocker.style.position = 'fixed'
        blocker.style.width = '100%'
        blocker.style.height = '123123123px'
        blocker.style.top = '0px'
        blocker.style.left = '0px'
        blocker.style.zIndex = '10000000'
        blocker.style.background = 'rgba(255,255,255,.7)'
        blocker.style.fontSize = '100px'
        blocker.style.textAlign = 'center'
        blocker.style.paddingTop = '200px' 
        blocker.textContent = "Rebuilding..."
        document.body.appendChild(blocker)
        setTimeout(() => {
            IS_BUILDING = false;
            location.reload();
        }, 15000)
    }

    static frontend() {
        console.log("DEV: rebuilding ....")
    }

    static started() {
        console.log('DEV: rebuilding .....')
    }

    static finished() {
        console.log('DEV: rebuilding ........')
    }

}


const endpoint = 'http://localhost:8998'
const devtool = feathers()
const ws = io(endpoint)
devtool.configure(socketio(ws, {
    timeout: 2000,
}))

ws.on('connect', () => {
    console.log('DEV: connected')
})

ws.on('bus created', (data) => {
    (Actions [data.status] || (()=> {}))();
})

client.ws.on('connect', () => {
    if (IS_BUILDING) {
        console.log('DEV: server restarted')
        location.reload();
    }
})