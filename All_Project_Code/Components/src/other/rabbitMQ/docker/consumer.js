const amqp = require("amqplib");

const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password:'guest',
    vhost: './',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']
}

connect();

async function connect()
    const queue = 'messagingQueue';
    try{
        const conn = await ampq.connect(rabbitSettings);
        console.log("Connection Created...");

        const channel = await conn.createChannel();
        console.log("Channel Created...");

        const res = await channel.assertQueue(queue);
        console.log("Queue Created");

        channel.consume(queue, message => {
            console.log('Recieved..')
        }), {
            noAck:true;
        }
    }
    catch(err){
        console.error(err);
    }
}


