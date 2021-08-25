import * as React from 'react';
import { TextField, Button } from '@material-ui/core';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { useState, useEffect } from 'react';
import { sp } from '@pnp/sp';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import './Stylesheet.scss';
import * as loadImage from 'blueimp-load-image';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);


export const BioForm = ({ props }) => {
    // console.log('bioform',props)
    // console.log('user name', props.context.pageContext.user.displayName);

    const classes = useStyles(0);
    const [open, setOpen] = React.useState(false);
    const [charLeft, setCharLeft] = useState(600);
    const [file, setFile] = useState(null);
    const [userID, setUserID] = useState();
    const [fileName, setFileName] = useState('');
    const [YourExperience, setYourExperience] = useState([]);
    const [defaultUserDetails, setDefaultUserDetails] = useState({});
    const [disable, setDisable] = useState(true);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const CHARACTER_LIMIT = 600;
    let currentUser = props.context.pageContext.user.displayName;

    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };
    const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        handleToggle();
        if (userID) {
            if (file) {
                await sp.web.getFileByServerRelativeUrl(fileName).setContentChunked(file);
                fetch(`https://edifecs.sharepoint.com/sites/PC/_api/web/lists/getByTitle('PhotoBlog')/items(${userID})?$select=*,FileLeafRef`, {
                    method: "GET",
                    headers: { "accept": "application/json;odata=nometadata" }
                }).then(r => r.json()).then((item: any) => {
                    let ext = item.FileLeafRef.split('.').pop();
                    sp.web.lists.getByTitle('PhotoBlog').items.getById(userID).update({ FileLeafRef: createFileName(ext) })
                        .then((myupdate) => {
                            updateStory()
                        });
                });
            } else {
                updateStory()
            }
        } else {
            if (file) {
                sp.web.getFolderByServerRelativeUrl("PhotoBlog").files.add(createFileName(file.name.split('.').pop()), file, true)
                    .then(f => {
                        f.file.getItem().then((item: any) => {
                            item.update({
                                Title: currentUser,
                                YourExperience: YourExperience,
                            }).then((myupdate) => {
                                console.log(myupdate);
                                handleClose();
                                setOpenSnackbar(true);
                                reloadWindow();
                            });
                        });
                    });
            }
        }
    };
    const updateStory = () => {
        sp.web.lists.getByTitle("PhotoBlog").items.getById(userID).update({ 'YourExperience': YourExperience, })
            .then(items => {
                handleClose();
                setOpenSnackbar(true);
                reloadWindow();
            });
    }
    const createFileName = (extention) => {
        return [[...currentUser.split(' '), new Date().getTime()].join('_'), extention].join('.')
    }
    const reloadWindow = () => {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
    const checkValidity = (event) => {
        setDisable(!event.target.value);
        return disable;
    };

    const handleChange = (event) => {
        checkValidity(event)
        setYourExperience(event.target.value);
        updateCharleft(event.target.value.length);
    };
    const updateCharleft = (charCount) => {
        const charLeft = CHARACTER_LIMIT - charCount;
        setCharLeft(charLeft);
    };
    const handleFileSelect = async (filePickerResult: IFilePickerResult) => {
        let file: any = await filePickerResult.downloadFileContent();
        // file.exifdata = null;
        setFile(file);
        //  loadImage(file, (img) => {
        //    console.log(typeof img)

        //}, { orientation: true });
        getBase64(file, (base64) => {
            setDefaultUserDetails({
                ServerRelativeUrl: base64
            });
        });
        // rotate(undefined, document.getElementById('uploaded-image')).then((blob: any) => {
        //     blob.name = file.name;

        // })
        // getBase64(file, (base64) => {
        //     setDefaultUserDetails({
        //         ServerRelativeUrl: base64
        //     });
        // });
        console.log("file received", file);
       // setFile(file);


        // EXIF.getData(file.type, function () {
        //     var orientation = EXIF.getAllTags(this).Orientation;
        //     console.log('orientation', orientation);
        // });
    };

    // const rotate = async (type, img) => {
    //     console.log("here")
    //     return new Promise(resolve => {
    //         const canvas = document.createElement('canvas');
    //         console.log("here1")

    //         EXIF.getData(img, function() {
    //             console.log("here2a = ",img)
    //             var orientation = EXIF.getAllTags(this).Orientation;
    //             console.log("here2",orientation)

    //             if ([5, 6, 7, 8].indexOf(orientation) > -1) {
    //                 canvas.width = img.height;
    //                 canvas.height = img.width;
    //             } else {
    //                 canvas.width = img.width;
    //                 canvas.height = img.height;
    //             }

    //             var ctx:CanvasRenderingContext2D = canvas.getContext("2d");

    //             switch (orientation) {
    //                 case 2:
    //                     ctx.transform(-1, 0, 0, 1, img.width, 0);
    //                     break;
    //                 case 3:
    //                     ctx.transform(-1, 0, 0, -1, img.width, img.height);
    //                     break;
    //                 case 4:
    //                     ctx.transform(1, 0, 0, -1, 0, img.height);
    //                     break;
    //                 case 5:
    //                     ctx.transform(0, 1, 1, 0, 0, 0);
    //                     break;
    //                 case 6:
    //                     ctx.transform(0, 1, -1, 0, img.height, 0);
    //                     break;
    //                 case 7:
    //                     ctx.transform(0, -1, -1, 0, img.height, img.width);
    //                     break;
    //                 case 8:
    //                     ctx.transform(0, -1, 1, 0, 0, img.width);
    //                     break;
    //                 default:
    //                     ctx.transform(1, 0, 0, 1, 0, 0);
    //             }

    //             ctx.drawImage(img, 0, 0, img.width, img.height);
    //             canvas.toBlob(resolve, type);
    //         });
    //     })
    // }


    const getUserPictureDetails = (currentUser) => {
        let url = props.context.pageContext.site.absoluteUrl + "/_api/web/getFolderByServerRelativeUrl('PhotoBlog')/Files?$filter=Title eq'" + currentUser + "'&select=Name,Title,YourExperience,ServerRelativeUrl,Id,ListItemAllFields/Description&$expand=ListItemAllFields";
        props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse): Promise<any> => {
                return response.json();
            }).then((response: any) => {
                let userDetails = response.value[0];
                console.log('response', userDetails);

                userDetails['ID'] = userDetails.ListItemAllFields.ID;
                userDetails['YourExperience'] = userDetails.ListItemAllFields.YourExperience;
                setDefaultUserDetails(userDetails);
                setUserID(userDetails['ID']);
                setFileName(userDetails['ServerRelativeUrl']);
                setYourExperience(userDetails['YourExperience']);
                updateCharleft(userDetails['YourExperience'].length);
                if (userDetails['YourExperience'] && userDetails['ServerRelativeUrl'] || fileName) {
                    setDisable(false)
                }
            });

    }
    const getBase64 = (file, cb) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
    useEffect(() => {
        getUserPictureDetails(currentUser);
    }, []);
    return (
        <div>
            <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Thank you for submitting your story! <br /> Stay home! Stay Safe! - P&C Team
                </Alert>
            </Snackbar>
            {/* Shared =   {props.shared} */}
            <form onSubmit={handleSubmit} >
                {/* <h2>{currentUser}</h2> */}
                <div className="userImageContainer">
                    <div className="userImage">
                        <img id="uploaded-image" src={defaultUserDetails['ServerRelativeUrl'] ? defaultUserDetails['ServerRelativeUrl'] : (props.context.pageContext.site.absoluteUrl + '/PhotoBlog/defaultImage.png')} alt="profile image here" />
                    </div>
                    <h4> Upload your picture</h4>
                    <FilePicker
                        bingAPIKey="<BING API KEY>"
                        accepts={[".gif", ".jpg", ".jpeg", ".bmp", ".dib", ".tif", ".tiff", ".ico", ".png", ".jxr", ".svg"]}
                        buttonIcon="FileImage"
                        onSave={handleFileSelect}
                        onChanged={handleFileSelect}
                        context={props.context}
                        buttonLabel="Select File"
                        hideSiteFilesTab={true}
                        hideRecentTab={true}
                        hideOneDriveTab={true}
                        hideWebSearchTab={true}
                        required={true}
                    />
                </div>

                <h3>#weareedifecs</h3>
                <h4>Share your story on work from home.</h4>
                <TextField id="outlined-textarea" fullWidth required label="Your Story" inputProps={{ maxlength: CHARACTER_LIMIT }} name="YourExperience" value={YourExperience} helperText={charLeft + ' character' + (charLeft > 1 ? 's' : '') + ' left.'} onChange={handleChange} margin="normal" variant="outlined" multiline onBlur={handleChange} rowsMax={15} />

                <Button variant="contained" color="primary" type="submit" disabled={disable || !(file || fileName)}>Submit</Button>
            </form>
        </div>
    )
}