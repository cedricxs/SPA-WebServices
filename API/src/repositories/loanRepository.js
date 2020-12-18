const { v4: uuid } = require('uuid');
const _ = require('lodash');
const ValidationError = require('./validationError');
const re = new RegExp('\\d{4}/[0-1]\\d/[0-3]\\d');

class LoanRepository {
    constructor(db, copyRepository, userRepository) {
        this.db = db;
        this.copyRepository = copyRepository;
        this.userRepository = userRepository;
    }

    checkLoan(loan) {
        if (!loan.userId||!loan.copyId||!loan.loanDate) {
            throw new ValidationError('The loan must have a user, copy id and loan date.');
        }
        if(!re.exec(loan.loanDate)){
            throw new ValidationError('The loan date must be a valide date of format yyyy/MM/dd.');
        }
        if(!this.copyRepository.getByCopyId(loan.copyId)){
            throw new ValidationError('This book does not exist.');
        }
        if(!this.userRepository.get(loan.userId)){
            throw new ValidationError('This user does not exist.');
        }
        if (_.some(this.getAll(), { copyId: loan.copyId })) { 
            throw new ValidationError('This copy is already loaned.');
        }
    }

    getAll() {
        return this.db.getData("/loans");
    }

    add(loan) {
        this.checkLoan(loan); 
        loan.id = uuid(); 
        this.db.push("/loans[]", loan);
        return loan;
    }

    get(id) {
        const loans = this.getAll();
        return _.find(loans, { id });
    }

    delete(id) {
        const path = this.getIdPath(id);
        if (path != null) {
            this.db.delete(path);
        }
        
    }

    getIdPath(id) {
        const loans = this.getAll();
        const index = _.findIndex(loans, { id });
        if (index == -1) {
            return null;
        }

        return '/loans[' + index + ']';
    }
    getAvailableCopies(bookId){
        const copies = this.copyRepository.getAll(bookId);
        const loans = this.getAll();
        return _.filter(copies, ({ id }) => !_.some(loans, { copyId: id }));
    }
    getByUser(userId){
        const loans = this.getAll();
        return _.filter(loans, { userId });
    }
}

module.exports = LoanRepository;