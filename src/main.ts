import type { IConfig, IEmojis, IColors, IWebhookSend } from './typescript/interfaces';
import configPrivate from './config.private';
import config from './config';
import Util from './utils/functions';
import DbFunctions from './utils/databaseFunctions';

import * as mongoose from 'mongoose';
import { Client, Intents, WebhookClient, MessageEmbed } from 'discord.js';

import { readdirSync } from 'fs';

class Spiritus {
	public client: Client;
	private errorHook: WebhookClient;
	public owner: string;
	protected commands: Map<string, any>;
	protected config: IConfig;
	private privateConfig: IConfig;
	public models: any;
	public db: any;
	public util: any;
	public emojis: IEmojis;
	public colors: IColors;
	constructor() {
		this.client = new Client({
			intents: Intents.ALL
		})
		this.config = config;
		this.privateConfig = configPrivate;
		this.errorHook = new WebhookClient(this.privateConfig.logs.error.id, this.privateConfig.logs.error.token);
		this.owner = config.owner.username;
		this.commands = new Map();
		this.util = new Util(this.client);
		this.models = { Guild: import('./models/index') }
		this.db = new DbFunctions(this);
		this.emojis = config.emojis;
		this.colors = config.colors;
		this.loadCommands();
		this.loadEvents();
		this.handleErrors();
		this.connectDB();
		this.client.login(this.privateConfig.tokens.discord)
	}
	private async loadCommands(dir = './commands') {
		readdirSync(dir).filter(f => !f.endsWith('.js')).forEach(async dirs => {
			const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
			for (const file of commands) {
				const importFile = await import(`./${dir}/${dirs}/${file}`);
				const CommandClass = importFile.default;
				const command = new CommandClass(this);
				this.commands.set(command.name, command);
				// const getFileName = await import(`../${dir}/${dirs}/${file}`);
				// this.commands.set(getFileName.help.name, getFileName);
				console.log(`Command loaded: ${command.name}`);
			};
		});
	}
	private async loadEvents(dir = "./events") {
		readdirSync(dir).forEach(async file => {
			const getFile = await import(`${dir}/${file}`)
			const evt = getFile.default;
			const evtName = file.split(".")[0];
			this.client.on(evtName, evt.bind(null, this));
			console.log(`Event loaded: ${evtName}`);
		});
	};

	private handleErrors() {
		process.on('uncaughtException', (error) => {
			console.warn(error);
			if (!this.client) return;
			this.errorHook.send({ content: error.toString(), code: 'js' });
		});
		process.on('unhandledRejection', (listener) => {
			console.warn(listener);
			if (!this.client) return;
			this.errorHook.send({ content: listener!.toString(), code: 'js' });
		});
		process.on('rejectionHandled', (listener) => {
			console.warn(listener);
			if (!this.client) return;
			this.errorHook.send({ content: listener.toString(), code: 'js' });
		});
		process.on('warning', (warning) => {
			console.warn(warning);
			if (!this.client) return;
			this.errorHook.send({ content: warning.toString(), code: 'js' });
		});
	}
	public log(type: string, options: IWebhookSend) {
		let id;
		let token;
		if (type === 'error') {
			id = this.privateConfig.logs.error.id
			token = this.privateConfig.logs.error.token
		} else {
			id = this.privateConfig.logs.info.id
			token = this.privateConfig.logs.info.token
		}
		const webhook = new WebhookClient(id, token);
		webhook.send(options)
	}
	private connectDB() {
		mongoose.connect(this.privateConfig.mongoose.connection, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
			autoIndex: false, // Don't build indexes
			poolSize: 10, // Maintain up to 10 socket connections
			serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity  //45000
			family: 4 // Use IPv4, skip trying IPv6
		});
		mongoose.connection.on("connected", () => {
			console.log("Mongoose is connected")
			const embed = new MessageEmbed()
				.setTitle('Mongoose is successfully connected.')
				.setColor('#0099ff')
				.setTimestamp()
				.setFooter(`Mongoose connection`);
			this.log('info', {
				username: 'Mongoose',
				avatar: this.privateConfig.mongoose.avatar || '',
				embeds: [embed]
			})
		});
	}
}
const spiritus = new Spiritus();
export default spiritus;