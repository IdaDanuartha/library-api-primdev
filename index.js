import express from 'express'

const app = express()
const port = 3000

app.get("/", (req, res) => {
    res.send('Hello World')
})

app.get("/books", (req, res) => {
    res.send("List of all books")
})

app.get("/books/:id", (req, res) => {
    const id = req.params.id
    res.send(`Find book by id: ${id}`)
})

app.post("/books", (req, res) => {
    res.send(`Store book to database`)
})

app.put("/books/:id", (req, res) => {
    res.send(`Update book to database`)
})

app.delete("/books/:id", (req, res) => {
    res.send(`Delete book to database`)
})

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`)
})
