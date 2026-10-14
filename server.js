//create server
const http = require('http');
//parsing url
const url = require('url');
//manipuler chemin fichiers
const path = require('path');
//lire/ecrire des files
const fs = require('fs');

//set the MIME types with map
const mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css",
	"txt": "text/plain",
	"ttf": "font/ttf",
	"otf": "font/otf",
	"pdf": "application/pdf"
};

http.createServer((req, res) => {

	 // route pour les coordonnées
	if (req.url === '/coords' && req.method === 'POST') {
		let body = '';
		req.on('data', chunk => { body += chunk; });
		req.on('end', () => {
			const { x, y } = JSON.parse(body);
			console.log(`x: ${x}, y: ${y}`);
			res.writeHead(200);
			res.end();
		});
		return;
	}

	//parse la requete.
	var uri = url.parse(req.url).pathname;
	//cwd = dossier courant + uri -> vrai chemin sur disque
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log('Loading' + uri);
	//pr stocker info file.
	var stats;


//check if file exist
try {
	//synchrone(bloque en attendant le res)
	stats = fs.lstatSync(fileName);
} catch(e){
	res.writeHead(404, {'Content-type' : 'text/plain'});
	res.write('404 Not Found\n');
	res.end();
	return;
}

if (stats.isFile()){
	//access to the right MIME
	var mimeType = mimeTypes[path.extname(fileName).split("."). reverse()[0]];
	//extension inconnue : header undefined -> crash du serveur
	if (!mimeType)
		mimeType = "application/octet-stream";
	res.writeHead(200, {'Content-type': mimeType});

	//ouvre le fichier comme un flux de donnee.
	var fileStream = fs.createReadStream(fileName);
	//donnee | client
	fileStream.pipe(res);
}
else if (stats.isDirectory()){
	res.writeHead(302, {'Location': 'index.html'});
	res.end();
}
else{
	res.writeHead(500, {'Content-type': 'text/plain'});
	res.write('500 Internal Sever Error\n');
	res.end();
}
}).listen(8080);
