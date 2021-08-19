import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import * as React from 'react';

export default class ChildOne extends React.Component<any, any>{

    private EmpID = 0;
    private update=false;
    private Empidtochange=0;
    private selectedEmpData=[];
    constructor(props) {
        super(props);
        this.state = {
            id:0,
            name:"",
            age:0,
            hire:"",
            employees: []
        };
        this.SaveData = this.SaveData.bind(this);
        this.UpdateData = this.UpdateData.bind(this);
        this.DeleteData = this.DeleteData.bind(this);
        this.updateElement=this.updateElement.bind(this);
    }

    getdata = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    SaveData=(e) =>{
        e.preventDefault();
       
        let employees=[...this.state.employees];
        employees.push({
            id:this.EmpID++,
            name:this.state.name,
            age:this.state.age,
            hire:this.state.hire
        });
        this.setState({
            employees,
            id:"",
            name:"",
            age:0,
            hire:""  
        });
    
    
    }

    UpdateData=(EID)=> {
            this.Empidtochange=EID;
            this.selectedEmpData = this.state.employees.filter(empl => empl.id === EID);

        this.update==true;
        this.setState({
            name: this.selectedEmpData[0].name,
            age: this.selectedEmpData[0].age,
            hire : this.selectedEmpData[0].hire
        });
        
    }

    updateElement(event){
       const index = this.state.employees.findIndex(empl => empl.id === this.Empidtochange);

    event.preventDefault();
    const updatedObj={ name:this.state.name, age:this.state.age, hire:this.state.hire }
        
    this.setState({
      employees: [
        ...this.state.employees.slice(0, index),
        updatedObj,
        ...this.state.employees.slice(index + 1)
      ]
    });
    }
    DeleteData=(EID)=> {
        const employees=this.state.employees.filter(empl=>empl.id!=EID)
        this.setState({employees})
    }

    public render() {
        const emp=this.state.employees;
        return (
            <div>
                <div>
                    <h1>Crud Operations on Employee data</h1>

                    <form onSubmit={!this.update?(event) => this.SaveData(event): (event) => this.updateElement(event)}>
                        <label>Employee Name</label><br />
                        <input type="text" name="name" value={this.state.name} onChange={(event) => this.getdata(event)} />
                        <br />
                        <label>Age</label><br />
                        <input type="number"  name="age" value={this.state.age} onChange={(event) => this.getdata(event)} />
                        <br />
                        <label>Hire Date</label><br />
                        <input type="date"  name="hire" value={this.state.hire} onChange={(event) => this.getdata(event)} />
                        <br />
                        <button type="submit" >Save</button>
                        <button type="submit" onClick={this.updateElement}>Edit</button>
                    </form>
                    
                    <br />
                    <br />
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th> Employee  Name</th>
                                    <th> Employee Age</th>
                                    <th> Employee Hire Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emp.map(employee => { 
                                    return (<tr key={employee.id}>
                                        <td>{employee.name}</td>
                                        <td>{employee.age}</td>
                                        <td>{employee.hire}</td>
                                        <td>
                                            <button onClick={()=>this.UpdateData(employee.id)}>Update</button>
                                            <button onClick={()=>this.DeleteData(employee.id)}>Remove</button>
                                        </td>
                                    </tr> )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

