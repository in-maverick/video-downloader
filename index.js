const videoLink = require('./videoPageExtract');
const fs = require('fs');
require('dotenv').config();
const execSync = require('child_process').execSync;
var exec = require('shelljs').exec;
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
	try {
		const topics = await readTopicFile();
		console.log('topics', topics.length);
		for (let i = 0; i < topics.length; i++) {
			console.log('topics videoURL', topics[i].videoURL);
			videoLinkData = await videoLink.videoLinkFinder(topics[i].videoURL);
			console.log('videoLinkArr', videoLinkData);
			for (let i = 0; i < videoLinkData.linkArr.length; i++) {
				const status = await openDownloadFiles(videoLinkData.linkArr[i], videoLinkData.topic);
				console.log('download [100% done]   ', status, '\n\n');
			}
		}
		//writeTopicFile(`link: ${videoLinkData.linkArr[i]}, topic: ${videoLinkData.topic}`);
		//reWriteTopicFile();
		return null;
	} catch (err) {
		console.error(err);
	}
};

start();

const openDownloadFiles = async (videoURL = '', topic = '') => {
	try {
		let filename = execSync(`youtube-dl --get-filename -o '%(title)s.%(ext)s' ${videoURL}`);
		let fileLength = execSync(`youtube-dl --get-duration ${videoURL}`);
		fileLength = fileLength.toString();
		filename = filename.toString();
		filename = filename.split(' ').join('_');
		videoURL = videoURL.split(' ').join('');
		console.log('Start Downloading ... %o   :   duration %o', filename, fileLength);
		console.log(videoURL);
		let _topic = topic.replace(/[^\w\s]/gi, '_');

		let fileExt = filename.split('.');
		fileExt = fileExt[fileExt.length - 1];

		filename = filename.split('.').join('_');
		filename = filename.replace(/\W/g, '_') + '.' + fileExt;

		//console.log('OUTPUT_PATH == ', process.env.OUTPUT_PATH);
		let output_path = process.env.OUTPUT_PATH && process.env.OUTPUT_PATH !== '' ? process.env.OUTPUT_PATH : '~/Movies';
		console.log('Video saving to == %o', process.env.OUTPUT_PATH);
		let fullOutput = output_path + _topic + '/' + filename;
		let cmd = 'youtube-dl -o ' + fullOutput + ' ' + videoURL.trim();
		cmd = cmd.replace(/(\r\n|\n|\r)/gm, '');
		//console.log(cmd);
		console.log('%o', 'Please wait... I will show logs once buffer downloaded...');
		//let code = execSync(cmd);

		exec(cmd, { silent: false }).stdout;
		return filename;
	} catch (err) {
		console.error(err);
	}
};
