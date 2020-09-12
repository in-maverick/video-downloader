# Course Video Downloader :

## Installation
```bash
Downloader library
1. https://github.com/ytdl-org/youtube-dl

	a. sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
	b. sudo chmod a+rx /usr/local/bin/youtube-dl

2. https://evermeet.cx/ffmpeg/ffmpeg-99114-g6a5b38ef44.7z

	a. sudo mv ffmpeg /usr/local/bin/
	b. sudo chmod a+rx /usr/local/bin/ffmpeg


3. npm i --save

4. node -v > 10

5. config .env file

6. node index.js


Features;
1. Resumable download
2. Data-saver mode enabled for slow network (check .env)
3. Feed array of topic for multiple topics download in one go
		topicArr.json is feed data to script in format
		[{ "topic": "RESOURCE URL WITH VIDEO ID" }]

```
## License
[MIT](https://choosealicense.com/licenses/mit/)
