// import * as React from 'react';
// import {useState} from 'react';
// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

//    const [photoList, setPhotoList] = useState([]);
// export class SharePointServiceManager {
 

//     getPictureLibrary = (props) => {
//         let url = props.pageContext.site.absoluteUrl + "/_api/web/getFolderByServerRelativeUrl('PhotoBlog')/Files?select=Name,Title,YourExperience,ServerRelativeUrl,ID,ListItemAllFields/Description&$expand=ListItemAllFields";
//         props.spHttpClient.get(url, SPHttpClient.configurations.v1)
//             .then((response: SPHttpClientResponse): Promise<any> => {
//                 return response.json();
//             }).then(response => {

//                 let blogList = response.value;
//                 let filteredBlogList = blogList.filter(item => item.Name != 'defaultImage.png');
//                 filteredBlogList.forEach(listItem => {
//                     listItem['YourExperience'] = listItem.ListItemAllFields.YourExperience;
//                 });
//                 console.log('Gallery', filteredBlogList);
//                 setPhotoList(filteredBlogList);
//             });
//     };
// }

// const SharePointService = new SharePointServiceManager();
// export default SharePointService; 