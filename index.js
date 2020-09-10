const videoLink = require('./videoPageExtract');
const vDownload = require('./video');
const fs = require('fs');
require('dotenv').config();

// console.log('============= process.env ', process.env);

const readTopicFile = async () => {
	try {
		const data = fs.readFileSync(__dirname + '/topicArr.json', 'utf8');
		let topicData = JSON.parse(data);
		return topicData;
	} catch (err) {
		console.error(err);
	}
};

const reWriteTopicFile = async () => {
	try {
		const data = fs.readFileSync(__dirname + '/topicArr.json', 'utf8');
		let topicData = JSON.parse(data);
		topicData = topicData.slice(1, topicData.length);
		console.log('topicData topicData [reWriteTopicFile]', topicData);
		fs.writeFileSync(__dirname + '/topicArr.json', JSON.stringify(topicData));
		console.log('=====================reWriteTopicFile [done]==========================');
	} catch (err) {
		console.error(err);
	}
};
const writeTopicFile = (fileData = `['done']`) => {
	console.log('fileData ', '' + fileData);
	fs.writeFileSync(__dirname + '/topicArr.txt', fileData);
};
const start = async () => {
	const topics = await readTopicFile();
	console.log('topics', topics.length);
	for (let i = 0; i < topics.length; i++) {
		console.log('topics videoURL', topics[i].videoURL);
		videoLinkData = await videoLink.videoLinkFinder(topics[i].videoURL);
		console.log('videoLinkArr', videoLinkData);
		for (let i = 0; i < videoLinkData.linkArr.length; i++) {
			const status = await vDownload.openDownloadFiles(videoLinkData.linkArr[i], videoLinkData.topic);
			console.log('download [100% done]   ', status, '\n\n');
		}
	}
	writeTopicFile(`link: ${videoLinkData.linkArr[i]}, topic: ${videoLinkData.topic}`);
	reWriteTopicFile();
	return null;
};

start();
