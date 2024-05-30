import bookModel from './book.schema'

class BookService {

    async findAll() {
        try {
            return await bookModel.find()
        } catch (error) {
            console.error('Error occurred while getting books', error)
        }
    }

    async findById(id: string) {
        try {
            return await bookModel.findById(id)
        } catch (error) {
            console.error('Error occurred while getting book', error)
        }
    }

    async create(book: any) {
        try {
            return await bookModel.create(book)
        } catch (error) {
            console.error('Error occurred while creating book', error)
        }
    }

    async update(id: string, book: any) {
        try {
            await bookModel.findByIdAndUpdate(id, book)
            return this.findById(id)
        } catch (error) {
            console.error('Error occurred while updating book', error)
        }
    }

    async delete(id: string) {
        try {
            await bookModel.findByIdAndDelete(id)
            return {
                message: 'Book deleted successfully'
            }
        } catch (error) {
            console.error('Error occurred while deleting book', error)
        }
    }
}

export default new BookService()
