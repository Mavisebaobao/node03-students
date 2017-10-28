let  template=require("art-template");
// 设置默认值
	template.defaults.root="./views";
	template.defaults.extname=".html";

let http=require("http");

let url=require("url");

let path=require("path");

let fs=require('fs');

let database=require("./database/students.json");

let server=http.createServer();

server.listen(3000);
server.on("request",(req,res)=>{
	let {pathname}=url.parse(req.url);
	// console.log(pathname);
	let realpath=path.join("public",pathname);	

	res.render=function(fql,data){
		let html = template(fql,data);

		res.end(html);
	}
	let {query}=url.parse(req.url,true);
	switch(pathname){
		case "/":
		case "/add":
				res.render("add",{});
			break;
		case "/list":
				
				res.render('list',{data:database});
			break;
		case "/create":
			//获得提交的数据
			
			database.push(query);

			fs.writeFile("./database/students.json",JSON.stringify(database),(err)=>{
				if(!err){
					res.writeHead(302,{
						"Location":'/list'
					})
				}
				res.end();
			})
			break;	
		case "/delete":
				
				database.splice(query.index,1);
				fs.writeFile("./database/students.json",JSON.stringify(database),(err)=>{
				if(!err){
					res.writeHead(302,{
						"Location":'/list'
					})
				}
				res.end();
			})
				break;
		default:
			fs.readFile(realpath,(err,data)=>{
				if(!err){
					res.end(data);
				}
			})			
	}

})