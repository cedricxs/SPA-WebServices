module.exports = function(app, loanController) {
    app.route('/loans')
        .get(loanController.getAll.bind(loanController))
        .post(loanController.loan.bind(loanController)); 
        
    app.route('/loans/:loanId')
        .get(loanController.get.bind(loanController)) 
        .delete(loanController.delete.bind(loanController));

    app.route('/users/:userId/loans')
        .get(loanController.getByUser.bind(loanController)); 
    
    app.route('/books/:bookId/availableCopies')
        .get(loanController.getAvailableCopies.bind(loanController)); 
}