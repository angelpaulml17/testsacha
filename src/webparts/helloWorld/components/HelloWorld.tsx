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
import { Calendar, DatePicker, defaultCalendarStrings } from '@fluentui/react';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
export interface IDetailsListBasicExampleItem {
  InternalId: number;
  Title: string;
  Name: string;
  USN: string;
  DOJ: number;
  Email: string;
  tosetdate:string;

}

export interface IDetailsListBasicExampleState {
  items: IDetailsListBasicExampleItem[];
  selectionDetails: string;
}
export interface ICustomPanelState {
  saving: boolean;
}

export interface ICustomPanelProps {
  onClose: () => void;
  isOpen: boolean;
  currentTitle: string;
  itemId: number;
  listId: string;
}

export default class HelloWorld extends React.Component<IHelloWorldProps, any, any> {
  private toChange = [];
  private toChangeid = 0;
  private getid = 0;
  private update = false;
  private _selection: Selection;
  private _columns: IColumn[];
  private sid = 0;
  private selectedDate:any;
  private dialogContentProps = {
    type: DialogType.normal,
    title: 'Delete Entry',
    closeButtonAriaLabel: 'Close',
    subText: 'Are you sure?',
  };
  private dialogModalProps = {
    isBlocking: true,
    styles: { main: { maxWidth: 450 } },
  };
  

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      Title: "",
      Name: "",
      USN: null,
      DOJ: null,
      Email: "",
      students: [],
      selectionDetails: "",
      item: 0,
      tosetdate:0,
      buttonendis: true,
      enable: false,
      errormess: "",
      showpanel: false,
      opened: false,
      clicked: false,
      isPanelOpen: false,
      isDialogVisible: false
    };
    this.addData = this.addData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.getErrormess = this.getErrormess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.hideDialogAndPanel = this.hideDialogAndPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.closePanelSave = this.closePanelSave.bind(this)
    this.cancelclick = this.cancelclick.bind(this)
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

    if (this._selection.getSelectedCount() === 0)
      this.setState({ buttonendis: true, enable: false, clicked: false })
    else {
      const getitem = this._selection.getSelection()[0] as IDetailsListBasicExampleItem;
      this.getid = getitem.InternalId
      console.log(getitem.DOJ);
      // const datev=new Date(getitem.DOJ)
      // const newdatev= new Date(datev.setDate(datev.getDate() + 1)).toISOString().substring(0, 10);
      // const datev=new Date(Date.UTC(getitem.DOJ.getFullYear(), getitem.DOJ.getMonth(), getitem.DOJ.getDate())
      // console.log(newdatev);
      const datev=new Date(getitem.tosetdate).toLocaleDateString("en-GM").substring(0, 2)+"-"+(new Date(getitem.tosetdate).toLocaleDateString("en-GM").substring(3, 5))+"-"+(new Date(getitem.tosetdate).toLocaleDateString("en-GM").substring(6));
      const newdate=datev.substring(0,2)+"-"+datev.substring(3,5)+"-"+datev.substring(6)
     this.selectedDate= new Date(getitem.DOJ).toDateString();
      this.setState({
        buttonendis: false, enable: true, clicked: true, isPanelOpen: true, Title: getitem.Title, Name: getitem.Name, USN: getitem.USN, DOJ:this.selectedDate, Email: getitem.Email
      })
    }

  }

  getErrormess() {
    //this.state.USN?'':"this field cant be empty"
    if (this.state.USN) {
      this.setState({ errormess: "" })
    }
    else {
      this.setState({ errormess: "this field cant be empty" })
    }
  }
  componentDidMount() {
    this.readData();
  }
  private closePanel() {
    this.setState({
      isPanelOpen: false
    })
  }
  private closePanelSave() {
    this.setState({ showpanel: true, opened: true })
  }
  private onDismiss() {

    this.setState({
      isDialogVisible: true
    })

  }
  private hideDialog() {
    this.setState({
      clicked: true,
      isPanelOpen: true,
      isDialogVisible: false
    })
  }
  private hideDialogAndPanel() {
    this.setState({
      isPanelOpen: false,
      isDialogVisible: false
    })
  }
  private readData = async () => {
    const items = await sp.web.lists.getByTitle("College").items.getAll();
    let studs = [];

    for (let i = 0; i < items.length; i++) {
      studs.push({
        InternalId: items[i].Id,
        Title: items[i].Title,
        Name: items[i].Name,
        USN: items[i].USN,
        DOJ:
        (new Date(items[i].DOJ).getMonth() + 1)
           +
          "-" +
           (new Date(items[i].DOJ).getDate())+
          "-" +
          new Date(items[i].DOJ).getFullYear(),
        Email: items[i].Email,
        tosetdate:items[i].DOJ
      });
    }
    this.setState({
      students: [...studs]
    });
  }
  private cancelclick() {
    this.setState({ showpanel: false, opened: false });
  }
  private getdata = async (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  private addData = async (event) => {
    const newdate = (new Date(this.state.DOJ).getDate() + "-" + (new Date(this.state.DOJ).getMonth() + 1) +
      "-" + new Date(this.state.DOJ).getFullYear());
    const data = await sp.web.lists.getByTitle("College").items.add({
      // id:this.state.id,
      Title: this.state.Title,
      Name: this.state.Name,
      USN: this.state.USN,
      DOJ: newdate,
      Email: this.state.Email
    });
    this.readData();
    this.setState({
      showpanel:false, opened:false
    })
  }


  private updateData = async () => {
    //var query = `USN eq '${title}'`
    this.updateElement();
    const items: any = await sp.web.lists.getByTitle("College").items.getById(this.getid).get();
    this.toChange = items;
    this.update = true;

    
  }

  private updateElement = async () => {
    await sp.web.lists.getByTitle("College").items.getById(this.getid).update({
      Title: this.state.Title,
      Name: this.state.Name,
      USN: this.state.USN,
      DOJ: this.state.DOJ,
      Email: this.state.Email
    });
    this.readData();
    this.setState({
      Title: "",
      Name: "",
      USN: "",
      DOJ: "",
      Email: "",
      isPanelOpen:false,
      clicked:false
    })
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
    this.setState({
      isDialogVisible: false,
      Title: "",
      Name: "",
      USN: "",
      DOJ: "",
      Email: ""
    })
  }


  public render(): React.ReactElement<IHelloWorldProps> {
    const emp = this.state.students;
    return (
      <div className={styles.helloWorld}>
        {/* <ChildOne /> */}
        <h1>Crud operations on student data</h1>
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
              selectionMode={SelectionMode.single}
            />
          </Fabric>

        </div>
        <PrimaryButton text="Add" onClick={this.closePanelSave} />
        {this.state.showpanel && <Panel
          isOpen={this.state.opened}
          onDismiss={this.cancelclick}
          closeButtonAriaLabel="Close"
          headerText="Add item"
        >
          <form >
            <label>Title</label><br />
            <TextField type="text" name="Title" value={this.state.Title} onChange={(event) => this.getdata(event)} required />
            <br />
            <label>Student Name</label><br />
            <TextField type="text" name="Name" value={this.state.Name} onChange={(event) => this.getdata(event)} />
            <br />
            {/* <label>USN</label><br /> */}
            <TextField label="USN" required type="number" name="USN" value={this.state.USN} onChange={(event) => this.getdata(event)} errorMessage={this.state.errormess} onBlur={this.getErrormess} />
            <br />
            <label>DOJ</label><br />
            {/* <TextField type="date" name="DOJ" value={this.state.DOJ} onChange={(event) => this.getdata(event)} /> */}
            <DatePicker value={new Date(this.state.DOJ)} onChange={(event) => this.getdata(event)}/>
            <br />
            <label>Email</label><br />
            <TextField type="text" name="Email" value={this.state.Email} onChange={(event) => this.getdata(event)} />
            <br />
            {/* <button type="submit">Save</button>
          <button type="submit" onClick={this.updateElement} >Edit</button> */}

            <PrimaryButton text="Save" onClick={(event) => this.addData(event)} disabled={this.state.enable} />
          </form>
        </Panel>}

        {this.state.clicked && <div><br /><Panel
          isOpen={this.state.isPanelOpen}
          onDismiss={this.closePanel}
          closeButtonAriaLabel="Close"
        >
          <div><label style={{fontSize : "25px"}}>Edit Data</label><PrimaryButton style={{marginLeft: "100px"}} text="Delete" onClick={this.onDismiss} disabled={this.state.buttonendis} /></div>
          <form >
            <label>Title</label><br />
            <TextField type="text" name="Title" value={this.state.Title} onChange={(event) => this.getdata(event)} required />
            <br />
            <label>Student Name</label><br />
            <TextField type="text" name="Name" value={this.state.Name} onChange={(event) => this.getdata(event)} />
            <br />
            {/* <label>USN</label><br /> */}
            <TextField label="USN" required type="number" name="USN" value={this.state.USN} onChange={(event) => this.getdata(event)} errorMessage={this.state.errormess} onBlur={this.getErrormess} />
            <br />
            <label>DOJ</label><br />
            {/* <TextField type="date" name="DOJ" value={this.state.DOJ} onChange={(event) => this.getdata(event)} /> */}
            <DatePicker value={new Date(this.state.DOJ)} onChange={(event) => this.getdata(event)}/>
            <br />
            <label>Email</label><br />
            <TextField type="text" name="Email" value={this.state.Email} onChange={(event) => this.getdata(event)} />
            <br />
            <PrimaryButton text="Update" onClick={() => this.updateData()} disabled={this.state.buttonendis} />
            
          </form>
        </Panel>
          <Dialog
            hidden={!this.state.isDialogVisible}
            onDismiss={this.hideDialog}
            dialogContentProps={this.dialogContentProps}
            modalProps={this.dialogModalProps}
          >
            <DialogFooter>
              <PrimaryButton onClick={() => this.deleteData()} text="Yes" />
              <DefaultButton onClick={this.hideDialog} text="No" />
            </DialogFooter>
          </Dialog>
        </div>
        }
      </div>
    );
  }
}


