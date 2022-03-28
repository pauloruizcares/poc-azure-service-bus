const { ServiceBusClient } = require("@azure/service-bus");
require('dotenv').config();

const connectionString = process.env.CONNECTIONSTRING
const queueName = process.env.QUEUENAME

const messages = [
	{ body: "Albert Einstein" },
	{ body: "Werner Heisenberg" },
	{ body: "Marie Curie" },
	{ body: "Steven Hawking" },
	{ body: "Isaac Newton" },
	{ body: "Niels Bohr" },
	{ body: "Michael Faraday" },
	{ body: "Galileo Galilei" },
	{ body: "Johannes Kepler" },
	{ body: "Nikolaus Kopernikus" }
];

async function main() {
	const sbClient = new ServiceBusClient(connectionString);
	const sender = sbClient.createSender(queueName);

	try {
		let batch = await sender.createMessageBatch(); 
		for (let i = 0; i < messages.length; i++) {
			if (!batch.tryAddMessage(messages[i])) {
				await sender.sendMessages(batch);
				batch = await sender.createMessageBatch();
				if (!batch.tryAddMessage(messages[i])) {
					throw new Error("Message too big to fit in a batch");
				}
			}
		}

		await sender.sendMessages(batch);

		console.log(`Sent a batch of messages to the queue: ${queueName}`);
		await sender.close();
	} finally {
		await sbClient.close();
	}
}

main()
    .then(() => {
        process.exit(1);
    })
    .catch((err) => {
        console.log("Error occurred: ", err);
        process.exit(1);
    });