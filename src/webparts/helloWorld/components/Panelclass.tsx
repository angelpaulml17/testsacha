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
import { Panel } from '@fluentui/react/lib/Panel';
import { DialogFooter} from "office-ui-fabric-react";

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

  export class Panelclass extends React.Component<ICustomPanelProps, ICustomPanelState> {

    constructor(props: ICustomPanelProps) {
      super(props);
      this.state = {
          saving: false
      };
  }
  private _onCancel() {
    this.props.onClose();
  }
  public render(): React.ReactElement<ICustomPanelProps> {
    let { isOpen, currentTitle } = this.props;
    return (
        <Panel isOpen={isOpen}>
            <h2>This is a custom panel with your own content</h2>
            <DialogFooter>
                <DefaultButton text="Cancel" onClick={this._onCancel} />
                {/* <PrimaryButton text="Save" onClick={this._onSave} /> */}
            </DialogFooter>
        </Panel>
    );
}

  }