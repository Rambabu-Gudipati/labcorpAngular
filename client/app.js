const express = require('express')
const path = require('path')

const cors = require("cors"); 




const app = express();
const port = process.env.PORT || 8000;
	app.use(cors()); // enable cors
	// Body parsing Middleware
	app.use(express.json()); // josn middle ware
	





let uiCodePath = "dist/labcorp_admin/browser";


app.use(express.static(path.join(__dirname, uiCodePath)));

app.get("/", async (req, res) => {
	return res.sendFile(
		path.join(__dirname,  uiCodePath, "index.html")
	);
});





app.get("*", async (req, res) => {
	return res.sendFile(
		path.join(__dirname, uiCodePath, "index.html")
	);
});


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

