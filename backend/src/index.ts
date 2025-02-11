import express, { Request, Response } from 'express'
import path from 'path'

const app = express()
const port = process.env.PORT || 3000

const books = [
  { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
  { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen' },
  { id: 3, title: '1984', author: 'George Orwell' },
]

app.get('/api/books', (req: Request, res: Response) => {
  res.json(books)
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`)
})
