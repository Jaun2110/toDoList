import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// connect to db
const db = new pg.Client({
user: "postgres",
password: "admin",
database:"permalist",
host:"localhost",
port: 5432,
}
)
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items =[];


// console.log(result.rows)

app.get("/", async(req, res) => {
  items =[];
  const result = await db.query("select * from items order by id asc");

   result.rows.forEach(item => {
    items.push(item)
   });
  res.render("index.ejs", {
    listTitle: new Date().toLocaleDateString(),
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  const result = await db.query("insert into items (title) values($1)",
[item])
  res.redirect("/");
});

app.post("/edit", async(req, res) => {

  const title = req.body.updatedItemTitle
  const id = req.body.updatedItemId
  await db.query
  ("update items set title = $1 where id = $2",[title,id])
res.redirect("/")
  
});

app.post("/delete", async(req, res) => {
  const itemToDelete = req.body.deleteItemId
// console.log(req.body.deleteItemId);
await db.query("delete from items where id =$1",
[itemToDelete])
res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
