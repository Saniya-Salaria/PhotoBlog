import * as React from 'react';
import styles from './PhotoBlog.module.scss';
import { IPhotoBlogProps } from './IPhotoBlogProps';
import { Grid } from '@material-ui/core';
import { BioForm } from './BioForm';
import { Gallery } from './Gallery';

export default class PhotoBlog extends React.Component<IPhotoBlogProps, {}> {
  public render(): React.ReactElement<IPhotoBlogProps> {
    return (
      <div className="photoBlog">
        <Grid container xs={12} >
          <Grid item xs={9}>
            <Gallery props={this.props} />
          </Grid>
          <Grid item xs={3}>
            <BioForm props={this.props} />
          </Grid>
        </Grid>
      </div>
    );
  }
}
