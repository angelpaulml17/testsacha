import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ChildOne from './ChildOne';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { Calendar, defaultCalendarStrings } from '@fluentui/react';
export interface IDetailsListBasicExampleItem {
  InternalId: number;
  Title: string;
  Name: string;
  USN: string;
  DOJ: number;
  Email: string;

}

export interface IDetailsListBasicExampleState {
  items: IDetailsListBasicExampleItem[];
  selectionDetails: string;
}


export default class HelloWorld extends React.Component<IHelloWorldProps, any, any> {
  private toChange = [];
  private toChangeid = 0;
  private getid = 0;
  private update = false;
  private _selection: Selection;
  private _columns: IColumn[];
  private sid=0;
  
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      Title: "",
      Name: "",
      USN: 0,
      DOJ: null,
      Email: "",
      students: [],
      selectionDetails: "",
      item: 0,
      buttonendis:true,
      enable:false,
      errormess:""
    };
    this.addData = this.addData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.getErrormess=this.getErrormess.bind(this);
    sp.setup({ spfxContext: this.props.context });
    this._selection = new Selection({
      onSelectionChanged: () =>
        this.setState({ selectionDetails: this._getSelectionDetails() }),
    });
    this._columns = [

      {
        key: "column1",
        name: "Name",
        fieldName: "Name",
        minWidth: 50,
        maxWidth: 150,
        isResizable: true,
      },
      {
        key: "column2",
        name: "USN",
        fieldName: "USN",
        minWidth: 50,
        maxWidth: 150,
        isResizable: true,
      },
      {
        key: "column3",
        name: "DOJ",
        fieldName: "DOJ",
        minWidth: 50,
        maxWidth: 150,
        isResizable: true,
      },
      {
        key: "column4",
        name: "Email",
        fieldName: "Email",
        minWidth: 50,
        maxWidth: 150,
        isResizable: true,
      }
    ];
  }
  private _getSelectionDetails() {
    if(this._selection.getSelectedCount()===0)
    this.setState({buttonendis:true, enable:false})
    else{
      const getitem = this._selection.getSelection()[0] as IDetailsListBasicExampleItem;
      this.getid = getitem.InternalId
      this.setState({
        buttonendis:false,  enable:true})
    } 
    
    
  }
  getErrormess(){
    this.state.USN?'':"this field cant be empty"
    if(this.state.USN){
      this.setState({errormess:""})
    }
    else{
      this.setState({errormess:"this field cant be empty"})
    }
  }
  componentDidMount() {
    this.readData();
  }


  private readData = async () => {
    const items = await sp.web.lists.getByTitle("College").items.getAll();
    let studs = [];
    for (let i = 0; i < items.length; i++) {
          studs.push({
            InternalId : items[i].Id , 
            Title:items[i].Title,
            Name: items[i].Name,
            USN: items[i].USN,
            DOJ:
              new Date(items[i].DOJ).getDate() +
              "-" +
              (new Date(items[i].DOJ).getMonth() + 1) +
              "-" +
              new Date(items[i].DOJ).getFullYear(),
              Email:items[i].Email
          });
        }
      this.setState({
      students: [...studs]
    });
  }

  private getdata = async (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  private addData = async (event) => {
    const newdate=(new Date(this.state.DOJ).getDate() +"-" +(new Date(this.state.DOJ).getMonth() + 1) +
    "-" +new Date(this.state.DOJ).getFullYear());
    const data = await sp.web.lists.getByTitle("College").items.add({
      // id:this.state.id,
      Title: this.state.Title,
      Name: this.state.Name,
      USN: this.state.USN,
      DOJ: newdate,
      Email: this.state.Email
    });
    this.readData();
  }



  private updateData = async () => {
    //var query = `USN eq '${title}'`
    this.updateElement();
    const items: any = await sp.web.lists.getByTitle("College").items.getById(this.getid).get();
    this.toChange = items;
    this.update = true;
    this.setState({
      Title: items.Title,
      Name: items.Name,
      USN: items.USN,
      DOJ: items.DOJ,
      Email: items.Email
    });
    this.readData();
  }

  private updateElement = async () => {
    await sp.web.lists.getByTitle("College").items.getById(this.getid).update({
      Title: this.state.Title,
      Name: this.state.Name,
      USN: this.state.USN,
      DOJ: this.state.DOJ,
      Email: this.state.Email
    });


  }

  private deleteData = async () => {
    // const items = await sp.web.lists.getByTitle("College").items.get();
    // var query = `Title eq '${title}'`
    // const items: any[] = await sp.web.lists.getByTitle("College").items.top(1).filter(query).get();
    // if (items.length > 0) {
    await sp.web.lists.getByTitle("College").items.getById(this.getid).delete();
    // }
    this.readData();
    this._selection.setAllSelected(false);
  }



  public render(): React.ReactElement<IHelloWorldProps> {
    const emp = this.state.students;
    return (
      <div className={styles.helloWorld}>
        {/* <ChildOne /> */}
        <form >
          <label>Title</label><br />
          <TextField type="text" name="Title" value={this.state.Title}  onChange={(event) => this.getdata(event)} required />
          <br />
          <label>Student Name</label><br />
          <TextField type="text" name="Name" value={this.state.Name}  onChange={(event) => this.getdata(event)} />
          <br />
          <label>USN</label><br />
          <TextField type="number" name="USN" value={this.state.USN}  onChange={(event) => this.getdata(event)} errorMessage={this.state.errormess} onBlur={this.getErrormess}/>
          <br />
          <label>DOJ</label><br />
          <TextField type="date" name="DOJ" value={this.state.DOJ}  onChange={(event) => this.getdata(event)} />
          <br />
          <label>Email</label><br />
          <TextField type="text" name="Email" value={this.state.Email}  onChange={(event) => this.getdata(event)}  />
          <br />
          {/* <button type="submit">Save</button>
          <button type="submit" onClick={this.updateElement} >Edit</button> */}

          <PrimaryButton text="Save" onClick={(event) => this.addData(event)} disabled={this.state.enable}/>
          <PrimaryButton text="Update" onClick={() => this.updateData()} disabled={this.state.buttonendis}/>
          <PrimaryButton text="Delete" onClick={() => this.deleteData()} disabled={this.state.buttonendis} />
        </form>

        <br />
        <br />
        <div>
          <Fabric>
            <DetailsList
              items={this.state.students}
              columns={this._columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selection={this._selection}
              selectionPreservedOnEmptyClick={true}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="Row checkbox"
              selectionMode ={SelectionMode.single}
            />
          </Fabric>

        </div>
      </div>
    );
  }
}
