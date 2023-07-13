import React from 'react';
import axios from 'axios';

export default class BudgetTracker extends React.Component{

    state={
        newDescription:'',
        newAmount:'',
        itemToBeModified:'',
        descriptionToBeModified:'',
        amountToBeModified:'',
        checkboxToBeModified:'',
        expenses:[]
    }

    importData = async () => {
        const response=await axios.get('./expense.json')
        const data = response.data
        this.setState({
            expenses:data
        })
    }

    componentDidMount(){
        this.importData();
    }

    render(){
        return(
        <React.Fragment>
            <h2> Expense Tracking </h2>
            <ul>
            {this.state.expenses.map((expense) => 
                this.state.itemToBeModified !== expense.id? this.displayNormal(expense) : this.displayUpdate(expense))
            }  
            </ul>
            <h5>Enter new expenses</h5>
            <input  type="text"
                    name="newDescription"
                    value={this.state.newDescription}
                    onChange={this.updateFormField}
                    placeholder="Enter new description"
            />
            <br/>
            <input  type="text"
                    name="newAmount"
                    value={this.state.newAmount}
                    onChange={this.updateFormField}
                    placeholder="Enter Amount"
            />
            <br/>
            <button onClick={this.addItem}>
                Add
            </button>

        </React.Fragment>
        )
    }

    addItem = () => {
        const newItem={
            'id':Math.floor(Math.random()*1000),
            'description': this.state.newDescription,
            'expenseAmount': this.state.newAmount,
            'reconciled':false
        }

        const clone = [...this.state.expenses]
        clone.push(newItem)

        this.setState({
            expenses: clone,
            newDescription:'',
            newAmount:''
        })
    }

    displayNormal=(expense)=>{
        return(
            <li key={expense.id} className="list-group-item">
                Expense: {expense.description} <br/>
                Amount: {expense.expenseAmount} <br/>
                Reconciled? 
                <input  type="checkbox"
                        checked={expense.reconciled===true}
                        onChange={()=>this.checkExpense(expense.id)}
                />
                {expense.reconciled? 'Yes': 'No'}
                <br/>

                <button className="ms-3 btn btn-danger btn-sm"
                        onClick={async()=>{
                            this.setState({
                                'itemToBeModified':expense.id,
                                'descriptionToBeModified':expense.description,
                                'amountToBeModified':expense.expenseAmount,
                            })
                }}> 
                Edit 
                </button>
                
                <button className="ms-3 btn btn-info btn-sm"
                        onClick={()=>this.deleteExpense(expense.id)}
                > 
                Delete 
                </button>
                <br/>
            </li>
        )
    }

    displayUpdate = (expense)=>{
        return(
            <li key={expense.id} className="list-group-item">
                <input  type="text"
                        name="descriptionToBeModified"
                        value={this.state.descriptionToBeModified}
                        onChange={this.updateFormField}
                        placeholder="Update description"
                />
                <br/>
                <input  type="text"
                        name="amountToBeModified"
                        value={this.state.amountToBeModified}
                        onChange={this.updateFormField}
                        placeholder="Update amount"
                />
                <br/>
                Reconciled? 
                <input  type="checkbox"
                        checked={expense.reconciled===true}
                        name="reconciled"
                        onChange={()=>this.checkExpense(expense.id)}
                />
                {expense.reconciled? 'Yes': 'No'}
                <br/>

                <button    className="ms-3 btn btn-danger btn-sm"
                           onClick={()=>this.updateFields(expense.id)}
                >
                Edit
                </button>
                <br/>
            </li>
        )
    }
    
    checkExpense = (expenseId) =>{
        let indexToChange= this.state.expenses.findIndex(expense=> expense.id === expenseId);
        let itemToChange = this.state.expenses[indexToChange];
        let cloneExpense = {...itemToChange}
        cloneExpense.reconciled = !cloneExpense.reconciled
        const left = this.state.expenses.slice(0,indexToChange)
        const right = this.state.expenses.slice(indexToChange+1)
        const modifiedList = [...left,cloneExpense,...right]

        this.setState({
            'expenses': modifiedList
            
        })
    }

    updateFields = (expenseId)=>{

        const clone=this.state.expenses.slice()
        const indexToChange=clone.findIndex(expense => expense.id === expenseId);
        const itemToChange=clone[indexToChange];
        itemToChange.description = this.state.descriptionToBeModified;
        itemToChange.expenseAmount = this.state.amountToBeModified;
        const left=this.state.expenses.slice(0, indexToChange)
        const right=this.state.expenses.slice(indexToChange+1)
        const modifiedList = [...left,itemToChange,...right]

        this.setState({
            'expenses':modifiedList,
            'itemToBeModified':'',
            'descriptionToBeModified':'',
            'amountToBeModified':''           
        })
    }

    deleteExpense = (expenseId) => {
        const indexToDelete=this.state.expenses.findIndex(expense => expense.id === expenseId);
        const left=this.state.expenses.slice(0, indexToDelete);
        const right=this.state.expenses.slice(indexToDelete+1);
        const modifiedList=[...left, ...right]
        this.setState({
            "expenses":modifiedList
        })
    }

    updateFormField =(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }




}

// componentDidMount(){ } inbuild function to setState based on axios - if component mount, this will call it along with await (synchronous)
// this.updateFormField should be added without ()=> in the onchange because it is not calling anything unlike those functions taking parameter
// have to use clone.push(newItem) this will add newItem to clone, but if you assign variable const newClone = clone.push(newItem), it will return the array length instead as that is the 'return' value (for clone.push())
// other way is to put modifiedList = [...clone, newItem]
