const execSync = require('child_process').execSync;
require('dotenv').config();

const openDownloadFiles = async (videoURL = '', topic = '') => {
	let filename = execSync(`youtube-dl --get-filename -o '%(title)s.%(ext)s' ${videoURL}`);
	filename = filename.toString();
	filename = filename.split(' ').join('_');
	videoURL = videoURL.split(' ').join('');
	console.log(videoURL);
	//console.log('OUTPUT_PATH == ', process.env.OUTPUT_PATH);
	let output_path = process.env.OUTPUT_PATH && process.env.OUTPUT_PATH !== '' ? process.env.OUTPUT_PATH : '~/Movies';
	let cmd = 'youtube-dl -o ' + output_path + topic + '/' + filename + ' ' + videoURL.trim();
	cmd = cmd.replace(/(\r\n|\n|\r)/gm, '');
	console.log(cmd);
	let code = execSync(cmd);
	console.log(code.toString());
	return filename;
};
module.exports = { openDownloadFiles };
