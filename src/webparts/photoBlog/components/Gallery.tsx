import * as React from 'react';
import { Grid, ClickAwayListener, Tooltip, Button } from '@material-ui/core';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { useState, useEffect } from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Floater from 'react-floater';
import './Stylesheet.scss';
const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});
export const Gallery = ({ props }) => {
    const classes = useStyles(0);
    const [photoList, setPhotoList] = useState([]);
    console.log('gallary');
    const getPictureLibrary = () => {
        let url = props.context.pageContext.site.absoluteUrl + "/_api/web/getFolderByServerRelativeUrl('PhotoBlog')/Files?select=Name,Title,YourExperience,ServerRelativeUrl,ID,ListItemAllFields/Description&$expand=ListItemAllFields";
        props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse): Promise<any> => {
                return response.json();
            }).then(response => {

                let blogList = response.value;
                let filteredBlogList = blogList.filter(item => item.Name != 'defaultImage.png');
                filteredBlogList.forEach(listItem => {
                    listItem['YourExperience'] = listItem.ListItemAllFields.YourExperience;
                    listItem['charLength'] = listItem.ListItemAllFields.YourExperience.length > 100;
                });
                setPhotoList(filteredBlogList);
            });
    };


    useEffect(() => {
        getPictureLibrary();
    }, []);


    return (
        <Grid container xs={12} spacing={2}>
            {photoList.map(photlistListItem =>
                <Grid item md={4} sm={6} xs={12}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            {/* <CardMedia
                                className={classes.media}
                                image={photlistListItem.ServerRelativeUrl}
                                title={photlistListItem.Name}
                            /> */}
                            <CardContent>
                                <div className='galleryImageCard'>
                                    <img src={photlistListItem.ServerRelativeUrl} alt={photlistListItem.Name} />
                                </div>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {photlistListItem.Title}

                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {photlistListItem.YourExperience}
                                    {photlistListItem.charLength ?
                                        <Floater content={photlistListItem.YourExperience} showCloseButton={true}>
                                            <span className="tooltipContainer" >Read more</span>
                                        </Floater> : ""}

                                </Typography>
                            </CardContent>
                        </CardActionArea>

                    </Card>

                </Grid>

            )
            }

        </Grid >
    )
}

