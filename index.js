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
				const status = await openDownloadFiles(videoLinkData.linkArr[i], videoLinkData.topic,i);
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

const openDownloadFiles = async (videoURL = '', topic = '',index=0) => {
	try {
		console.log('%o', 'Please wait...');
		let filename = execSync(`youtube-dl --get-filename -o '%(title)s.%(ext)s' ${videoURL}`);
		filename = filename.toString();
		filename = filename.split(' ').join('_');
		videoURL = videoURL.split(' ').join('');
		console.log('Start Downloading ...... %o:', filename);
		//console.log(videoURL);
		let _topic = topic.replace(/[^\w\s]/gi, '_');

		let fileExt = filename.split('.');
		fileExt = fileExt[fileExt.length - 1];

		filename = filename.split('.').join('_');
		filename = ''+index+'_'+filename.replace(/\W/g, '_') + '.' + fileExt;

		//console.log('OUTPUT_PATH == ', process.env.OUTPUT_PATH);
		let output_path = process.env.OUTPUT_PATH && process.env.OUTPUT_PATH !== '' ? process.env.OUTPUT_PATH : './';
		console.log('Video saving to == %o', process.env.OUTPUT_PATH);
		let fullOutput = output_path + _topic + '/' + filename;
		//console.log(process.env.LOW_VIDEO_QUALITY);
		console.log(
			'%o \n',
			`VIDEO_QUALITY is ${
				process.env.LOW_VIDEO_QUALITY || process.env.LOW_VIDEO_QUALITY === 'true' ? 'low [Data Saver mode]' : 'high [Must me on High Speed Internet] => [change .env file]'
			}`
		);
		let videoQuality =
			process.env.LOW_VIDEO_QUALITY || process.env.LOW_VIDEO_QUALITY === 'true' ? `'[height <=? 480]'` : `'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'`;
		let cmd = `youtube-dl -f ${videoQuality} -u ${process.env.USER_EMAIL} -p ${process.env.USER_PASSWORD} -o ${fullOutput} ${videoURL.trim()}`;
		cmd = cmd.replace(/(\r\n|\n|\r)/gm, '');
		//console.log(cmd);
		console.log('%o \n', 'Please wait... I will show logs once buffer downloaded...');
		//let code = execSync(cmd);
		exec(cmd, { silent: false }).stdout;
		return filename;
	} catch (err) {
		console.error(err);
	}
};
