const { v4: uuid } = require('uuid');
const _ = require('lodash');
const ValidationError = require('./validationError');

const checkCopy = function(copy) {
    if (!copy.submissionDate) {
        throw new ValidationError('The copy must have a submission date.');
    }
}

class CopyRepository {
    constructor(db, bookRepository) {
        this.db = db;
        this.bookRepository = bookRepository;
    }

    getAll(bookId) {
        let path = this.bookRepository.getIdPath(bookId);
        if(path)
            return this.db.getData(path+"/copies");
        throw new ValidationError('The book does not exist.');
    }

    add(bookId, copy) {
        checkCopy(copy); 
        copy.id = uuid()
        let path = this.bookRepository.getIdPath(bookId); 
        if(path){
            this.db.push(path+"/copies[]", copy);
            return copy;
        }
        throw new ValidationError('The book does not exist.');
    }

    get(bookId, copyId) {
        const copies = this.getAll(bookId);
        return _.find(copies, { id:copyId });
    }

    getByCopyId(copyId) {
        const books = this.bookRepository.getAll();
        let copy;
        books.some(book => {
            if(copy=this.get(book.id,copyId))return true;
        });
        return copy;
    }

    update(bookId, copyId, copy) {
        if (copy.id !== copyId) {
            throw new ValidationError('You cannot change the identifier.');
        }
        checkCopy(copy); 
        const path = this.getIdPath(bookId, copyId);
        if (path) {
            this.db.push(path, copy);
            return copy;
        }
        throw new ValidationError('This copy does not exists');
    
    }

    delete(bookId, copyId) {
        const path = this.getIdPath(bookId, copyId);
        if (path) {
            this.db.delete(path);
        }
        throw new ValidationError('This copy does not exists');
    }

    getIdPath(bookId, copyId) {
        const copies = this.getAll(bookId);
        const index = _.findIndex(copies, { id:copyId });
        if (index == -1) {
            return null;
        }

        return this.bookRepository.getIdPath(bookId)+"/copies[" + index + "]";
    }
}

module.exports = CopyRepository;