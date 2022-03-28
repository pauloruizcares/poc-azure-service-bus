const { delay, ServiceBusClient } = require("@azure/service-bus");
require('dotenv').config();

const connectionString = process.env.CONNECTIONSTRING
const queueName = process.env.QUEUENAME

 async function main() {
	const sbClient = new ServiceBusClient(connectionString);
	const receiver = sbClient.createReceiver(queueName);

	const myMessageHandler = async (messageReceived) => {
		console.log(`Received message: ${messageReceived.body}`);
	};

	const myErrorHandler = async (error) => {
		console.log(error);
	};

	receiver.subscribe({
		processMessage: myMessageHandler,
		processError: myErrorHandler
	});

	await delay(20000);

	await receiver.close();
	await sbClient.close();
}

main()
    .catch((err) => {
        console.log("Error occurred: ", err);
        process.exit(1);
    });