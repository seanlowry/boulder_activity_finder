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

async function connect(){

    const queue = 'messagingQueue';
    const msg = 'Hello...';

    try{
        const conn = await amqp.connect(rabbitSettings);
        console.log("Connection Created...");

        const channel = await conn.createChannel();
        console.log("Channel Created...");

        const res = await channel.assertQueue(queue);
        console.log("Queue Created");

        await channel.sendToQueue(queue, Buffer.from(msg));
        console.log('Message sent to queue...');

    }
    catch(err){
        console.error(err);
    }
}
