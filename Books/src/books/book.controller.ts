import { Request, Response } from "express";
import bookService from "./book.service";

class BookController {
  async findAll(req: Request, res: Response) {
    const books = await bookService.findAll();
    res.status(200);
    return res.json(books);
  }

  async findById(req: Request, res: Response) {
    const book = await bookService.findById(req.params.id);
    res.status(book ? 200 : 404);
    return res.json(book);
  }

  async create(req: Request, res: Response) {
    const book = await bookService.create(req.body);
    res.status(201);
    return res.json(book)
  }

  async update(req: Request, res: Response) {
    const book = await bookService.update(req.params.id, req.body);
    res.status(book ? 200 : 404);
    return res.json(book);
  }

  async delete(req: Request, res: Response) {
    const book = await bookService.delete(req.params.id);
    res.status(book ? 204 : 404);
    return res.json(book);
  }
}

export default new BookController();
