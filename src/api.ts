import {EventEmitter} from 'events';
import { ArrayJson, ObjectJson } from './arrayjson';

type Message = {
  user: string;
  content: string;
};

// const messages: Message[] = [];
const messages = new ArrayJson<Message>('/app/data/messages.json');

export const events = new EventEmitter();

export function sendMessage(content: string, user: string): void {
  console.log("Sending message:", content);
  messages.push({ user, content });
  events.emit('message', { user, content });
}

export async function getMessages(): Promise<Message[]> {
	await messages.ready
	return messages;
}

interface RocketLeagueConfig {
	teams: Array<{
		id: string;
		name: string;
		p1: string;
		p2: string;
	}>;
	ergebnisse: Record<string, any>;
	manuelleZeiten: Record<string, any>;
	config: {
		startFreitag: string;
		startSamstag: string;
		dauer: number;
	}
}

let rocketLeagueData = new ObjectJson<RocketLeagueConfig>('/app/data/rocketleague.json') as RocketLeagueConfig & ObjectJson<RocketLeagueConfig>;

rocketLeagueData.ready.then(() => {
	console.log("Rocket League data loaded:", rocketLeagueData);
	rocketLeagueData.teams = rocketLeagueData.teams || [];
	rocketLeagueData.ergebnisse = rocketLeagueData.ergebnisse || {};
	rocketLeagueData.manuelleZeiten = rocketLeagueData.manuelleZeiten || {};
	rocketLeagueData.config = rocketLeagueData.config || {
		startFreitag: "18:00",
		startSamstag: "14:00",
		dauer: 10
	};
});

export async function updateRocketLeagueData(data: any): Promise<void> {
	await rocketLeagueData.ready;
	console.log("Updating Rocket League data:", data);
	if(!data || typeof data !== 'object') {
		console.error("Invalid data for Rocket League update:", data);
		return;
	}
	rocketLeagueData.teams = data.teams || rocketLeagueData.teams;
	rocketLeagueData.ergebnisse = data.ergebnisse || rocketLeagueData.ergebnisse;
	rocketLeagueData.manuelleZeiten = data.manuelleZeiten || rocketLeagueData.manuelleZeiten;
	rocketLeagueData.config = data.config || rocketLeagueData.config;
	events.emit('rl', data);
}

export async function getRocketLeagueData(): Promise<RocketLeagueConfig> {
	await rocketLeagueData.ready;
	return rocketLeagueData;
}

export async function deleteRocketLeagueData(): Promise<void> {
	await updateRocketLeagueData({
		teams: [],
		ergebnisse: {},
		manuelleZeiten: {},
		config: {
			startFreitag: "18:00",
			startSamstag: "14:00",
			dauer: 10
		}
	});
}








let counterStrikeData = new ObjectJson<RocketLeagueConfig>('/app/data/counterstrike.json') as RocketLeagueConfig & ObjectJson<RocketLeagueConfig>;

counterStrikeData.ready.then(() => {
	console.log("Counter Strike data loaded:", counterStrikeData);
	counterStrikeData.teams = counterStrikeData.teams || [];
	counterStrikeData.ergebnisse = counterStrikeData.ergebnisse || {};
	counterStrikeData.manuelleZeiten = counterStrikeData.manuelleZeiten || {};
	counterStrikeData.config = counterStrikeData.config || {
		startFreitag: "18:00",
		startSamstag: "14:00",
		dauer: 10
	};
});

export async function updateCounterStrikeData(data: any): Promise<void> {
	await counterStrikeData.ready;
	console.log("Updating Counter Strike data:", data);
	if(!data || typeof data !== 'object') {
		console.error("Invalid data for Counter Strike update:", data);
		return;
	}
	counterStrikeData.teams = data.teams || counterStrikeData.teams;
	counterStrikeData.ergebnisse = data.ergebnisse || counterStrikeData.ergebnisse;
	counterStrikeData.manuelleZeiten = data.manuelleZeiten || counterStrikeData.manuelleZeiten;
	counterStrikeData.config = data.config || counterStrikeData.config;
	events.emit('cs', data);
}

export async function getCounterStrikeData(): Promise<RocketLeagueConfig> {
	await counterStrikeData.ready;
	return counterStrikeData;
}

export async function deleteCounterStrikeData(): Promise<void> {
	await updateCounterStrikeData({
		teams: [],
		ergebnisse: {},
		manuelleZeiten: {},
		config: {
			startFreitag: "18:00",
			startSamstag: "14:00",
			dauer: 10
		}
	});
}