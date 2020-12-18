export class Loan {
    public userName:string;
    public bookName:string;
    
    constructor(
        public copyId:string,
        public userId:string,
        public loanDate:string,
    ) {}
}