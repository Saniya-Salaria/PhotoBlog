import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'PhotoBlogWebPartStrings';
import PhotoBlog from './components/PhotoBlog';
import { IPhotoBlogProps } from './components/IPhotoBlogProps';
import { sp } from "@pnp/sp/presets/all";


export interface IPhotoBlogWebPartProps {
  description: string;
  refreshData: boolean;
  updateProperty: (value: string) => void;
}

export default class PhotoBlogWebPart extends BaseClientSideWebPart<IPhotoBlogWebPartProps> {

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context,
      });

    });

  }
  public render(): void {

    const element: React.ReactElement<IPhotoBlogProps> = React.createElement(
      PhotoBlog,
      {
        description: this.properties.description,
        context: this.context,
        refreshData: this.properties.refreshData,
        updateProperty: (value: any) => {
          this.properties.refreshData = value;
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
